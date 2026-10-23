import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthCard,
  AuthHeading,
  AuthEyebrow,
  AuthTitle,
  AuthText,
  AuthForm
} from "../../../components/AuthLayout";
import { Field, FormAlert, Input } from "../../../components/Field";
import { PasswordInput } from "../../../components/PasswordInput";
import { TasteFields } from "../../../components/TasteFields";
import { Button, ButtonLink } from "../../../components/Button";
import { EmptyState } from "../../../components/EmptyState";
import { Spinner } from "../../../components/Spinner";
import { IconAlert, IconArrowLeft, IconArrowRight, IconCheck } from "../../../components/Icons";
import {
  CadastroSide,
  SideTitle,
  SideHeadline,
  StepList,
  StepItem,
  StepNumber,
  StepText,
  StepPills,
  StepPill,
  PillNumber,
  ButtonRow
} from "./styles.module.jsx";
import { useRegister } from "../../../hooks/useAuth";
import { validarEmail, normalizarDadosUsuario } from "../../../utils/formatters";

const etapas = [
  { numero: 1, nome: "Sua conta", detalhe: "Nome, email e senha" },
  { numero: 2, nome: "Seu gosto", detalhe: "Gênero, autor e ritmo de leitura" },
];

export default function CadastroPage() {
  const navigate = useNavigate();
  const { register, loading } = useRegister();

  const [etapa, setEtapa] = useState(1);
  const [erros, setErros] = useState({});
  const [erroCadastro, setErroCadastro] = useState(null);
  const [contaCriada, setContaCriada] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    dataNascimento: "",
    generoFavorito: "",
    livrosLidos: 0,
    autorPreferido: "",
    nivelLeitura: "",
    receberRecomendacoes: false,
    biografia: ""
  });

  // Depois de criar a conta, leva para o login.
  useEffect(() => {
    if (!contaCriada) return undefined;
    const timer = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(timer);
  }, [contaCriada, navigate]);

  const atualizar = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros(prev => ({ ...prev, [campo]: null }));
    if (erroCadastro) setErroCadastro(null);
  };

  const handleInputChange = (e) => atualizar(e.target.name, e.target.value);

  const senhaValida = formData.senha.length >= 6;
  const senhasConferem = formData.confirmarSenha && formData.senha === formData.confirmarSenha;

  const validarEtapa1 = () => {
    const novosErros = {};
    if (!formData.nome.trim()) novosErros.nome = "Informe seu nome";
    if (!formData.email.trim()) novosErros.email = "Informe seu email";
    else if (!validarEmail(formData.email)) novosErros.email = "Esse email parece incompleto";
    if (!formData.senha) novosErros.senha = "Crie uma senha";
    else if (!senhaValida) novosErros.senha = "Use pelo menos 6 caracteres";
    if (!formData.confirmarSenha) novosErros.confirmarSenha = "Repita a senha";
    else if (!senhasConferem) novosErros.confirmarSenha = "As senhas não coincidem";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const continuar = (e) => {
    e.preventDefault();
    if (validarEtapa1()) setEtapa(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { confirmarSenha: _confirmarSenha, ...dadosParaEnvio } = formData;
    const resultado = await register(normalizarDadosUsuario(dadosParaEnvio));

    if (resultado.success) {
      setContaCriada(true);
    } else {
      setErroCadastro(resultado.error || "Não deu para criar sua conta. Tente de novo.");
    }
  };

  // Mensagens embaixo das senhas: erro de envio vence a validação ao vivo.
  const mensagemSenha = erros.senha
    ? { error: erros.senha }
    : formData.senha
      ? senhaValida ? { success: "Senha válida" } : { error: "Muito curta, use pelo menos 6 caracteres" }
      : { help: "Pelo menos 6 caracteres" };

  const mensagemConfirmacao = erros.confirmarSenha
    ? { error: erros.confirmarSenha }
    : formData.confirmarSenha
      ? senhasConferem ? { success: "As senhas coincidem" } : { error: "As senhas não coincidem" }
      : {};

  const estadoEtapa = (numero) => (numero === etapa ? "atual" : numero < etapa ? "feito" : "proximo");

  return (
    <AuthLayout
      alinhar="flex-start"
      linkTopo={<>Já tem conta? <Link to="/">Entrar</Link></>}
    >
      <CadastroSide>
        <SideTitle>
          <AuthEyebrow $marca>Criar conta</AuthEyebrow>
          <SideHeadline>Duas etapas e você recebe seu primeiro livro.</SideHeadline>
        </SideTitle>
        <StepList aria-label="Etapas do cadastro">
          {etapas.map((item) => {
            const estado = estadoEtapa(item.numero);
            return (
              <StepItem key={item.numero} aria-current={estado === "atual" ? "step" : undefined}>
                <StepNumber $estado={estado}>
                  {estado === "feito" ? <IconCheck tamanho={20} /> : item.numero}
                </StepNumber>
                <StepText $apagado={estado === "proximo"}>
                  <strong>{item.nome}</strong>
                  <span>{estado === "feito" ? "Pronta" : item.detalhe}</span>
                </StepText>
              </StepItem>
            );
          })}
        </StepList>
        <StepPills aria-label="Etapas do cadastro">
          {etapas.map((item) => {
            const estado = estadoEtapa(item.numero);
            return (
              <StepPill key={item.numero} $atual={estado === "atual"} aria-current={estado === "atual" ? "step" : undefined}>
                {estado === "feito" ? <IconCheck tamanho={16} /> : <PillNumber $atual={estado === "atual"}>{item.numero}</PillNumber>}
                {item.nome}
              </StepPill>
            );
          })}
        </StepPills>
      </CadastroSide>

      <AuthCard $largura={etapa === 1 ? 520 : 560} aria-labelledby="tituloCadastro">
        {contaCriada ? (
          <EmptyState
            icone={<IconCheck tamanho={30} />}
            tom="sucesso"
            titulo="Conta criada"
            descricao={`Boas-vindas, ${formData.nome.trim().split(" ")[0]}! Em instantes você vai para o login.`}
            role="status"
          >
            <ButtonLink to="/" $variante="primario">Entrar agora</ButtonLink>
          </EmptyState>
        ) : (
          <>
            <AuthHeading>
              <AuthEyebrow>Etapa {etapa} de 2</AuthEyebrow>
              <AuthTitle id="tituloCadastro">{etapa === 1 ? "Sua conta" : "Seu gosto"}</AuthTitle>
              {etapa === 2 && (
                <AuthText>Ajuda o Matchbook a acertar desde o primeiro livro. Tudo aqui é opcional.</AuthText>
              )}
            </AuthHeading>

            {etapa === 1 ? (
              <AuthForm onSubmit={continuar} noValidate>
                <Field id="nome" label="Nome completo" error={erros.nome}>
                  <Input name="nome" type="text" autoComplete="name" placeholder="Seu nome" value={formData.nome} onChange={handleInputChange} />
                </Field>
                <Field id="email" label="Email" error={erros.email}>
                  <Input name="email" type="email" autoComplete="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} />
                </Field>
                <Field id="senha" label="Senha" {...mensagemSenha}>
                  <PasswordInput name="senha" autoComplete="new-password" placeholder="Crie uma senha" value={formData.senha} onChange={handleInputChange} />
                </Field>
                <Field id="confirmarSenha" label="Confirmar senha" {...mensagemConfirmacao}>
                  <PasswordInput name="confirmarSenha" autoComplete="new-password" placeholder="Repita a senha" value={formData.confirmarSenha} onChange={handleInputChange} />
                </Field>
                <Field id="dataNascimento" label="Data de nascimento" tag="opcional">
                  <Input name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleInputChange} />
                </Field>
                <Button type="submit" $tamanho="grande" $total>
                  Continuar
                  <IconArrowRight tamanho={18} />
                </Button>
              </AuthForm>
            ) : (
              <AuthForm onSubmit={handleSubmit} noValidate>
                <TasteFields dados={formData} onChange={atualizar} prefixo="cadastro" />

                {erroCadastro && (
                  <FormAlert role="alert">
                    <IconAlert tamanho={18} />
                    {erroCadastro}
                  </FormAlert>
                )}

                <ButtonRow>
                  <Button $variante="secundario" $tamanho="grande" onClick={() => setEtapa(1)}>
                    <IconArrowLeft tamanho={18} />
                    Voltar
                  </Button>
                  <Button type="submit" $tamanho="grande" disabled={loading}>
                    {loading && <Spinner />}
                    {loading ? "Criando conta" : "Criar conta"}
                  </Button>
                </ButtonRow>
              </AuthForm>
            )}
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
