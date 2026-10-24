import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Chip';
import { StatTile } from '@/components/StatTile';
import { Dialog, ConfirmDialog } from '@/components/Dialog';
import { Field, FormAlert, Input } from '@/components/Field';
import { TasteFields } from '@/components/TasteFields';
import { Toast } from '@/components/Toast';
import { Spinner } from '@/components/Spinner';
import {
  IconAlert,
  IconCheck,
  IconLogout,
  IconPencil,
  IconRefresh,
  IconTrash,
} from '@/components/Icons';
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
  EditButtons,
} from './styles';
import { useLikedCount } from '@/lib/likedCount';
import { recommendationsApi } from '@/lib/api/recommendations';
import { usersApi } from '@/lib/api/users';
import { isValidEmail } from '@/lib/formatters';
import { clearSessionUser, getSessionUser, saveSessionUser } from '@/lib/session';
import type { SessionUser } from '@/lib/session';
import type { RecommendationStats } from '@/lib/api/types';
import { paths } from '@/app/paths';
import { colors, genreColors, genreName } from '@/styles/tokens';
import { appear } from '@/styles/motion';

// Estratégias do algoritmo adaptativo, na ordem em que aparecem.
const strategies = [
  {
    key: 'PADRAO',
    name: 'Padrão',
    explanation: 'Estou seguindo o gosto que você contou no seu perfil.',
  },
  {
    key: 'DIVERSIFICADO',
    name: 'Diversificado',
    explanation:
      'Você pulou mais do que amou nos últimos livros, então estou misturando gêneros novos com os seus favoritos.',
  },
  {
    key: 'EXPLORATORIO',
    name: 'Exploratório',
    explanation:
      'Foram muitos pulos seguidos, então estou testando livros bem diferentes para achar o que funciona.',
  },
  {
    key: 'REFINADO',
    name: 'Refinado',
    explanation: 'Você amou vários livros, então estou focando no que já sei que você gosta.',
  },
];

const strategyKey = (value?: string | null) =>
  (value || 'PADRAO').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

// O formulário de edição, com os nomes de campo da API (vai inteiro no PUT /usuario/update).
interface ProfileForm {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  generoFavorito: string;
  livrosLidos: number;
  autorPreferido: string;
  nivelLeitura: string;
  receberRecomendacoes: boolean;
  biografia: string;
}

const profileFormFromUser = (user: SessionUser): ProfileForm => ({
  id: user.id,
  nome: user.nome || '',
  email: user.email || '',
  dataNascimento: user.dataNascimento || '',
  generoFavorito: user.generoFavorito || '',
  livrosLidos: user.livrosLidos || 0,
  autorPreferido: user.autorPreferido || '',
  nivelLeitura: user.nivelLeitura || '',
  receberRecomendacoes: user.receberRecomendacoes ?? true,
  biografia: user.biografia || '',
});

// "1995-05-15" vira "15/05/1995" sem passar por Date, para não mudar de dia com o fuso.
const formatBirthDate = (date?: string | null) => {
  if (!date) return null;
  const parts = String(date).slice(0, 10).split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : date;
};

const formatMemberSince = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : null;

const initials = (name?: string | null) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { total } = useLikedCount();
  const [user, setUser] = useState(() => getSessionUser());
  const [isEditing, setIsEditing] = useState(false);
  // Sem sessão a tela não aparece ("if (!user) return null"), então o formulário vazio nunca é lido.
  const [editForm, setEditForm] = useState<ProfileForm>(() =>
    user ? profileFormFromUser(user) : ({} as ProfileForm),
  );
  const [editErrors, setEditErrors] = useState<Record<string, string | null>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ text: string; id: number } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [resetting, setResetting] = useState(false);

  const loadStats = useCallback(async () => {
    if (!user?.id) return;
    const response = await recommendationsApi.getStats(user.id);
    setStats(response.success ? response.data : null);
  }, [user?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const closeNotice = useCallback(() => setNotice(null), []);

  const openEdit = useCallback(() => {
    // Só é chamada com a tela aberta, e a tela só abre com sessão.
    setEditForm(profileFormFromUser(user!));
    setEditErrors({});
    setSaveError(null);
    setIsEditing(true);
  }, [user]);

  // O lápis do cabeçalho no celular abre a edição com ?editar=1.
  useEffect(() => {
    if (searchParams.get('editar') !== '1') return;
    openEdit();
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, openEdit]);

  const closeEdit = useCallback(() => setIsEditing(false), []);

  const handleFormChange = (field: keyof ProfileForm, value: ProfileForm[keyof ProfileForm]) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) setEditErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!editForm.nome.trim()) newErrors.nome = 'Informe seu nome';
    if (!editForm.email.trim()) newErrors.email = 'Informe seu email';
    else if (!isValidEmail(editForm.email)) newErrors.email = 'Esse email parece incompleto';
    setEditErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const response = await usersApi.update(editForm);

    if (response.success) {
      setUser(response.data);
      saveSessionUser(response.data);
      setIsEditing(false);
      setNotice({ text: 'Perfil atualizado.', id: Date.now() });
    } else {
      setSaveError(`Não deu para salvar: ${response.error}`);
    }
    setLoading(false);
  };

  const confirmReset = async () => {
    setResetting(true);
    // A tela só abre com sessão (ProtectedRoute).
    const response = await recommendationsApi.resetAlgorithm(user!.id);
    setResetting(false);
    setShowResetModal(false);

    if (response.success) {
      await loadStats();
      setNotice({
        text: 'Histórico apagado. O Matchbook recomeça pelo seu perfil.',
        id: Date.now(),
      });
    } else {
      setNotice({ text: 'Não deu para recomeçar agora.', id: Date.now() });
    }
  };

  const handleLogout = () => {
    clearSessionUser();
    navigate(paths.login);
  };

  const confirmDeleteAccount = () => {
    // A exclusão ainda não chama a API: limpa a sessão e volta para o login.
    clearSessionUser();
    localStorage.removeItem('token');
    window.location.href = paths.login;
  };

  if (!user) return null;

  const favoriteGenre = genreName(user.generoFavorito) || user.generoFavorito;
  const favoriteGenreColors = genreColors(user.generoFavorito);
  const currentStrategy =
    strategies.find((item) => item.key === strategyKey(stats?.estrategiaAtual)) || strategies[0];
  const memberSince = formatMemberSince(user.dataCadastro);

  return (
    <AppLayout gap="20px">
      <ProfileHeader aria-label="Seus dados" {...appear(0)}>
        <Avatar aria-hidden="true">
          {user.fotoUrl ? <img src={user.fotoUrl} alt="" /> : initials(user.nome)}
        </Avatar>
        <ProfileInfo>
          <h1>{user.nome}</h1>
          <p>
            {[user.email, memberSince && `Membro desde ${memberSince}`].filter(Boolean).join(' · ')}
          </p>
        </ProfileInfo>
        <HeaderStats>
          <StatTile label="Livros lidos" value={user.livrosLidos || 0} />
          <StatTile label="Livros curtidos" value={total ?? 0} />
        </HeaderStats>
      </ProfileHeader>

      <TwoColumns>
        <Card aria-labelledby="tasteSection" {...appear(1)}>
          <CardHeading>
            <CardTitle id="tasteSection">Seu gosto</CardTitle>
            <Button $variant="secondary" onClick={openEdit}>
              <IconPencil size={16} />
              Editar perfil
            </Button>
          </CardHeading>
          <InfoList>
            <InfoItem>
              <dt>Gênero favorito</dt>
              <dd>
                {favoriteGenre ? (
                  <Tag
                    $background={favoriteGenreColors.background}
                    $color={favoriteGenreColors.cover}
                  >
                    {favoriteGenre}
                  </Tag>
                ) : (
                  'Não informado'
                )}
              </dd>
            </InfoItem>
            <InfoItem>
              <dt>Autor preferido</dt>
              <dd>{user.autorPreferido || 'Não informado'}</dd>
            </InfoItem>
            <InfoItem>
              <dt>Nível de leitura</dt>
              <dd>{user.nivelLeitura || 'Não informado'}</dd>
            </InfoItem>
            <InfoItem>
              <dt>Data de nascimento</dt>
              <dd>{formatBirthDate(user.dataNascimento) || 'Não informada'}</dd>
            </InfoItem>
            {user.biografia && (
              <InfoItem $span>
                <dt>Biografia</dt>
                <Biography>{user.biografia}</Biography>
              </InfoItem>
            )}
            <StatusRow $enabled={user.receberRecomendacoes}>
              <dt>Recomendações personalizadas</dt>
              <dd>
                {user.receberRecomendacoes && <IconCheck size={16} />}
                {user.receberRecomendacoes ? 'Ativadas' : 'Desativadas'}
              </dd>
            </StatusRow>
          </InfoList>
        </Card>

        <Card
          $background={colors.brandBackground}
          aria-labelledby="algorithmSection"
          {...appear(2)}
        >
          <CardIntro>
            <CardTitle id="algorithmSection">Como o Matchbook lê seu gosto</CardTitle>
            <CardText>
              {stats ? currentStrategy.explanation : 'Ainda não deu para carregar o seu histórico.'}
            </CardText>
          </CardIntro>
          {stats && (
            <>
              <StrategyBlock>
                <StrategyLabel>Estratégia atual</StrategyLabel>
                <StrategyList aria-label="Estratégias">
                  {strategies.map((item) => {
                    const isCurrent = item.key === currentStrategy.key;
                    return (
                      <StrategyItem
                        key={item.key}
                        $current={isCurrent}
                        aria-current={isCurrent ? 'true' : undefined}
                      >
                        {isCurrent && <IconCheck size={14} />}
                        {item.name}
                      </StrategyItem>
                    );
                  })}
                </StrategyList>
              </StrategyBlock>
              <AlgorithmStats>
                <StatTile label="Amei" value={stats.totalAceites ?? 0} />
                <StatTile label="Próximo" value={stats.totalRecusas ?? 0} />
                <StatTile
                  label="Aceitação"
                  value={`${Math.round(stats.taxaAceitacao ?? 0)}%`}
                  color={colors.brand}
                />
              </AlgorithmStats>
              <ResetRow>
                <Button $variant="white" onClick={() => setShowResetModal(true)}>
                  <IconRefresh size={16} />
                  Recomeçar do zero
                </Button>
                <span>Apaga o histórico de Amei e Próximo.</span>
              </ResetRow>
            </>
          )}
        </Card>
      </TwoColumns>

      <DangerCard aria-labelledby="accountSection" {...appear(3)}>
        <DangerText>
          <h2 id="accountSection">Excluir conta</h2>
          <p>Remove seus dados, seus livros curtidos e suas preferências. Não dá para desfazer.</p>
        </DangerText>
        <DangerActions>
          <MobileOnly>
            <Button $variant="secondary" onClick={handleLogout}>
              <IconLogout size={17} />
              Sair
            </Button>
          </MobileOnly>
          <Button $variant="danger" onClick={() => setShowDeleteModal(true)}>
            <IconTrash size={16} />
            Excluir conta
          </Button>
        </DangerActions>
      </DangerCard>

      <Dialog open={isEditing} title="Editar perfil" onClose={closeEdit} width={600}>
        <EditForm onSubmit={handleSave} noValidate>
          <Field id="editName" label="Nome" error={editErrors.nome}>
            <Input
              type="text"
              autoComplete="name"
              value={editForm.nome}
              onChange={(e) => handleFormChange('nome', e.target.value)}
            />
          </Field>
          <Field id="editEmail" label="Email" error={editErrors.email}>
            <Input
              type="email"
              autoComplete="email"
              value={editForm.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
            />
          </Field>
          <Field id="editBirthDate" label="Data de nascimento" tag="opcional">
            <Input
              type="date"
              value={editForm.dataNascimento}
              onChange={(e) => handleFormChange('dataNascimento', e.target.value)}
            />
          </Field>
          <TasteFields values={editForm} onChange={handleFormChange} idPrefix="edit" />

          {saveError && (
            <FormAlert role="alert">
              <IconAlert size={18} />
              {saveError}
            </FormAlert>
          )}

          <EditButtons>
            <Button $variant="secondary" $size="large" onClick={closeEdit}>
              Cancelar
            </Button>
            <Button type="submit" $size="large" disabled={loading}>
              {loading && <Spinner />}
              {loading ? 'Salvando' : 'Salvar'}
            </Button>
          </EditButtons>
        </EditForm>
      </Dialog>

      <ConfirmDialog
        open={showResetModal}
        title="Recomeçar do zero?"
        description="O Matchbook esquece seus Amei e Próximo e volta a recomendar pelo seu perfil. Seus livros curtidos continuam."
        icon={<IconRefresh size={24} />}
        confirmLabel="Sim, recomeçar"
        loadingLabel="Recomeçando"
        variant="primary"
        loading={resetting}
        onConfirm={confirmReset}
        onCancel={() => setShowResetModal(false)}
      />

      <ConfirmDialog
        open={showDeleteModal}
        title="Excluir sua conta?"
        description="Seus livros curtidos, preferências e histórico somem para sempre."
        icon={<IconTrash size={24} />}
        confirmLabel="Sim, excluir"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />

      <AnimatePresence>
        {notice && (
          <Toast key={notice.id} resetKey={notice.id} onClose={closeNotice}>
            {notice.text}
          </Toast>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
