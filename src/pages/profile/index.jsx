import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { AppLayout } from "../../components/AppLayout";
import { Button } from "../../components/Button";
import { Tag } from "../../components/Chip";
import { StatTile } from "../../components/StatTile";
import { Dialog, ConfirmDialog } from "../../components/Dialog";
import { Field, FormAlert, Input } from "../../components/Field";
import { TasteFields } from "../../components/TasteFields";
import { Toast } from "../../components/Toast";
import { Spinner } from "../../components/Spinner";
import { IconAlert, IconCheck, IconLogout, IconPencil, IconRefresh, IconTrash } from "../../components/Icons";
import {
    Card,
    ProfileHeader,
    Avatar,
    ProfileInfo,
    HeaderStats,
    TwoColumns,
    CardHeading,
    CardTitle,
    CardText,
    CardIntro,
    StrategyBlock,
    AlgorithmStats,
    InfoList,
    InfoItem,
    Biography,
    StatusRow,
    StrategyLabel,
    StrategyList,
    StrategyItem,
    ResetRow,
    DangerCard,
    DangerText,
    DangerActions,
    MobileOnly,
    EditForm,
    EditButtons
} from "./styles.module.jsx";
import { useAuth } from "../../hooks/useAuth";
import { useCurtidos } from "../../contexts/curtidos";
import { recomendacaoService, userService } from "../../apis/services";
import { validarEmail } from "../../utils/formatters";
import { cores, coresDoGenero, nomeDoGenero } from "../../styles/tokens";
import { surgir } from "../../styles/movimento";

// Estratégias do algoritmo adaptativo, na ordem em que aparecem.
const estrategias = [
    { chave: "PADRAO", nome: "Padrão", explicacao: "Estou seguindo o gosto que você contou no seu perfil." },
    { chave: "DIVERSIFICADO", nome: "Diversificado", explicacao: "Você pulou mais do que amou nos últimos livros, então estou misturando gêneros novos com os seus favoritos." },
    { chave: "EXPLORATORIO", nome: "Exploratório", explicacao: "Foram muitos pulos seguidos, então estou testando livros bem diferentes para achar o que funciona." },
    { chave: "REFINADO", nome: "Refinado", explicacao: "Você amou vários livros, então estou focando no que já sei que você gosta." }
];

const chaveEstrategia = (valor) =>
    (valor || "PADRAO").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();

const formularioDoUsuario = (usuario) => ({
    id: usuario.id,
    nome: usuario.nome || '',
    email: usuario.email || '',
    dataNascimento: usuario.dataNascimento || '',
    generoFavorito: usuario.generoFavorito || '',
    livrosLidos: usuario.livrosLidos || 0,
    autorPreferido: usuario.autorPreferido || '',
    nivelLeitura: usuario.nivelLeitura || '',
    receberRecomendacoes: usuario.receberRecomendacoes ?? true,
    biografia: usuario.biografia || ''
});

// "1995-05-15" vira "15/05/1995" sem passar por Date, para não mudar de dia com o fuso.
const formatarNascimento = (data) => {
    if (!data) return null;
    const partes = String(data).slice(0, 10).split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
};

const formatarMembroDesde = (data) =>
    data ? new Date(data).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : null;

const iniciais = (nome) =>
    (nome || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((parte) => parte[0].toUpperCase()).join("");

export default function ProfilePage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { getCurrentUser, logout } = useAuth();
    const { total } = useCurtidos();
    const [user, setUser] = useState(() => getCurrentUser());
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(() => (user ? formularioDoUsuario(user) : {}));
    const [errosEdicao, setErrosEdicao] = useState({});
    const [erroSalvar, setErroSalvar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aviso, setAviso] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [estatisticas, setEstatisticas] = useState(null);
    const [resetando, setResetando] = useState(false);

    const carregarEstatisticas = useCallback(async () => {
        if (!user?.id) return;
        const response = await recomendacaoService.obterEstatisticas(user.id);
        setEstatisticas(response.success ? response.data : null);
    }, [user?.id]);

    useEffect(() => {
        carregarEstatisticas();
    }, [carregarEstatisticas]);

    const fecharAviso = useCallback(() => setAviso(null), []);

    const abrirEdicao = useCallback(() => {
        setEditForm(formularioDoUsuario(user));
        setErrosEdicao({});
        setErroSalvar(null);
        setIsEditing(true);
    }, [user]);

    // O lápis do cabeçalho no celular abre a edição com ?editar=1.
    useEffect(() => {
        if (searchParams.get("editar") !== "1") return;
        abrirEdicao();
        setSearchParams({}, { replace: true });
    }, [searchParams, setSearchParams, abrirEdicao]);

    const fecharEdicao = useCallback(() => setIsEditing(false), []);

    const handleFormChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
        if (errosEdicao[field]) setErrosEdicao(prev => ({ ...prev, [field]: null }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const novosErros = {};
        if (!editForm.nome.trim()) novosErros.nome = "Informe seu nome";
        if (!editForm.email.trim()) novosErros.email = "Informe seu email";
        else if (!validarEmail(editForm.email)) novosErros.email = "Esse email parece incompleto";
        setErrosEdicao(novosErros);
        if (Object.keys(novosErros).length > 0) return;

        setLoading(true);
        const response = await userService.atualizar(editForm);

        if (response.success) {
            setUser(response.data);
            localStorage.setItem('usuario', JSON.stringify(response.data));
            setIsEditing(false);
            setAviso({ texto: "Perfil atualizado.", chave: Date.now() });
        } else {
            setErroSalvar(`Não deu para salvar: ${response.error}`);
        }
        setLoading(false);
    };

    const confirmarReset = async () => {
        setResetando(true);
        const response = await recomendacaoService.resetarAlgoritmo(user.id);
        setResetando(false);
        setShowResetModal(false);

        if (response.success) {
            await carregarEstatisticas();
            setAviso({ texto: "Histórico apagado. O Matchbook recomeça pelo seu perfil.", chave: Date.now() });
        } else {
            setAviso({ texto: "Não deu para recomeçar agora.", chave: Date.now() });
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const confirmDeleteAccount = () => {
        // A exclusão ainda não chama a API: limpa a sessão e volta para o login.
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    if (!user) return null;

    const generoFavorito = nomeDoGenero(user.generoFavorito) || user.generoFavorito;
    const coresGenero = coresDoGenero(user.generoFavorito);
    const estrategiaAtual = estrategias.find((item) => item.chave === chaveEstrategia(estatisticas?.estrategiaAtual)) || estrategias[0];
    const membroDesde = formatarMembroDesde(user.dataCadastro);

    return (
        <AppLayout espaco="20px">
            <ProfileHeader aria-label="Seus dados" {...surgir(0)}>
                <Avatar aria-hidden="true">
                    {user.fotoUrl ? <img src={user.fotoUrl} alt="" /> : iniciais(user.nome)}
                </Avatar>
                <ProfileInfo>
                    <h1>{user.nome}</h1>
                    <p>{[user.email, membroDesde && `Membro desde ${membroDesde}`].filter(Boolean).join(" · ")}</p>
                </ProfileInfo>
                <HeaderStats>
                    <StatTile rotulo="Livros lidos" valor={user.livrosLidos || 0} />
                    <StatTile rotulo="Livros curtidos" valor={total ?? 0} />
                </HeaderStats>
            </ProfileHeader>

            <TwoColumns>
                <Card aria-labelledby="secaoGosto" {...surgir(1)}>
                    <CardHeading>
                        <CardTitle id="secaoGosto">Seu gosto</CardTitle>
                        <Button $variante="secundario" onClick={abrirEdicao}>
                            <IconPencil tamanho={16} />
                            Editar perfil
                        </Button>
                    </CardHeading>
                    <InfoList>
                        <InfoItem>
                            <dt>Gênero favorito</dt>
                            <dd>
                                {generoFavorito
                                    ? <Tag $fundo={coresGenero.fundo} $cor={coresGenero.capa}>{generoFavorito}</Tag>
                                    : "Não informado"}
                            </dd>
                        </InfoItem>
                        <InfoItem>
                            <dt>Autor preferido</dt>
                            <dd>{user.autorPreferido || "Não informado"}</dd>
                        </InfoItem>
                        <InfoItem>
                            <dt>Nível de leitura</dt>
                            <dd>{user.nivelLeitura || "Não informado"}</dd>
                        </InfoItem>
                        <InfoItem>
                            <dt>Data de nascimento</dt>
                            <dd>{formatarNascimento(user.dataNascimento) || "Não informada"}</dd>
                        </InfoItem>
                        {user.biografia && (
                            <InfoItem $span>
                                <dt>Biografia</dt>
                                <Biography>{user.biografia}</Biography>
                            </InfoItem>
                        )}
                        <StatusRow $ligado={user.receberRecomendacoes}>
                            <dt>Recomendações personalizadas</dt>
                            <dd>
                                {user.receberRecomendacoes && <IconCheck tamanho={16} />}
                                {user.receberRecomendacoes ? "Ativadas" : "Desativadas"}
                            </dd>
                        </StatusRow>
                    </InfoList>
                </Card>

                <Card $fundo={cores.fundoMarca} aria-labelledby="secaoAlgoritmo" {...surgir(2)}>
                    <CardIntro>
                        <CardTitle id="secaoAlgoritmo">Como o Matchbook lê seu gosto</CardTitle>
                        <CardText>
                            {estatisticas ? estrategiaAtual.explicacao : "Ainda não deu para carregar o seu histórico."}
                        </CardText>
                    </CardIntro>
                    {estatisticas && (
                        <>
                            <StrategyBlock>
                                <StrategyLabel>Estratégia atual</StrategyLabel>
                                <StrategyList aria-label="Estratégias">
                                    {estrategias.map((item) => {
                                        const atual = item.chave === estrategiaAtual.chave;
                                        return (
                                            <StrategyItem key={item.chave} $atual={atual} aria-current={atual ? "true" : undefined}>
                                                {atual && <IconCheck tamanho={14} />}
                                                {item.nome}
                                            </StrategyItem>
                                        );
                                    })}
                                </StrategyList>
                            </StrategyBlock>
                            <AlgorithmStats>
                                <StatTile rotulo="Amei" valor={estatisticas.totalAceites ?? 0} />
                                <StatTile rotulo="Próximo" valor={estatisticas.totalRecusas ?? 0} />
                                <StatTile rotulo="Aceitação" valor={`${Math.round(estatisticas.taxaAceitacao ?? 0)}%`} cor={cores.marca} />
                            </AlgorithmStats>
                            <ResetRow>
                                <Button $variante="branco" onClick={() => setShowResetModal(true)}>
                                    <IconRefresh tamanho={16} />
                                    Recomeçar do zero
                                </Button>
                                <span>Apaga o histórico de Amei e Próximo.</span>
                            </ResetRow>
                        </>
                    )}
                </Card>
            </TwoColumns>

            <DangerCard aria-labelledby="secaoConta" {...surgir(3)}>
                <DangerText>
                    <h2 id="secaoConta">Excluir conta</h2>
                    <p>Remove seus dados, seus livros curtidos e suas preferências. Não dá para desfazer.</p>
                </DangerText>
                <DangerActions>
                    <MobileOnly>
                        <Button $variante="secundario" onClick={handleLogout}>
                            <IconLogout tamanho={17} />
                            Sair
                        </Button>
                    </MobileOnly>
                    <Button $variante="perigo" onClick={() => setShowDeleteModal(true)}>
                        <IconTrash tamanho={16} />
                        Excluir conta
                    </Button>
                </DangerActions>
            </DangerCard>

            <Dialog aberto={isEditing} titulo="Editar perfil" onFechar={fecharEdicao} largura={600}>
                <EditForm onSubmit={handleSave} noValidate>
                    <Field id="editarNome" label="Nome" error={errosEdicao.nome}>
                        <Input type="text" autoComplete="name" value={editForm.nome} onChange={(e) => handleFormChange('nome', e.target.value)} />
                    </Field>
                    <Field id="editarEmail" label="Email" error={errosEdicao.email}>
                        <Input type="email" autoComplete="email" value={editForm.email} onChange={(e) => handleFormChange('email', e.target.value)} />
                    </Field>
                    <Field id="editarNascimento" label="Data de nascimento" tag="opcional">
                        <Input type="date" value={editForm.dataNascimento} onChange={(e) => handleFormChange('dataNascimento', e.target.value)} />
                    </Field>
                    <TasteFields dados={editForm} onChange={handleFormChange} prefixo="editar" />

                    {erroSalvar && (
                        <FormAlert role="alert">
                            <IconAlert tamanho={18} />
                            {erroSalvar}
                        </FormAlert>
                    )}

                    <EditButtons>
                        <Button $variante="secundario" $tamanho="grande" onClick={fecharEdicao}>Cancelar</Button>
                        <Button type="submit" $tamanho="grande" disabled={loading}>
                            {loading && <Spinner />}
                            {loading ? "Salvando" : "Salvar"}
                        </Button>
                    </EditButtons>
                </EditForm>
            </Dialog>

            <ConfirmDialog
                aberto={showResetModal}
                titulo="Recomeçar do zero?"
                descricao="O Matchbook esquece seus Amei e Próximo e volta a recomendar pelo seu perfil. Seus livros curtidos continuam."
                icone={<IconRefresh tamanho={24} />}
                rotuloConfirmar="Sim, recomeçar"
                rotuloCarregando="Recomeçando"
                variante="primario"
                carregando={resetando}
                onConfirmar={confirmarReset}
                onCancelar={() => setShowResetModal(false)}
            />

            <ConfirmDialog
                aberto={showDeleteModal}
                titulo="Excluir sua conta?"
                descricao="Seus livros curtidos, preferências e histórico somem para sempre."
                icone={<IconTrash tamanho={24} />}
                rotuloConfirmar="Sim, excluir"
                onConfirmar={confirmDeleteAccount}
                onCancelar={() => setShowDeleteModal(false)}
            />

            <AnimatePresence>
                {aviso && (
                    <Toast key={aviso.chave} chave={aviso.chave} onFechar={fecharAviso}>
                        {aviso.texto}
                    </Toast>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
