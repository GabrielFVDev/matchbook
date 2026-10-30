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
import { TasteFields, readingLevelLabel } from '@/components/TasteFields';
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
import { accountApi } from '@/lib/api/account';
import { recommendationsApi } from '@/lib/api/recommendations';
import { authErrorMessage, isPopupClosed } from '@/lib/authErrors';
import { confirmIdentity, deleteAccount, logOut, updateName } from '@/lib/firebase';
import { toPreferencesRequest } from '@/lib/formatters';
import { useSessionUser } from '@/lib/session';
import type { SessionUser } from '@/lib/session';
import type { Preferences, RecommendationStats } from '@/lib/api/types';
import { paths } from '@/app/paths';
import { colors, genreColors, genreName } from '@/styles/tokens';
import { appear } from '@/styles/motion';

// Strategies of the adaptive algorithm, in the order they show up.
const strategies = [
  {
    key: 'DEFAULT',
    name: 'Padrão',
    explanation: 'Estou seguindo o gosto que você contou no seu perfil.',
  },
  {
    key: 'DIVERSIFIED',
    name: 'Diversificado',
    explanation:
      'Você pulou mais do que amou nos últimos livros, então estou misturando gêneros novos com os seus favoritos.',
  },
  {
    key: 'EXPLORATORY',
    name: 'Exploratório',
    explanation:
      'Foram muitos pulos seguidos, então estou testando livros bem diferentes para achar o que funciona.',
  },
  {
    key: 'REFINED',
    name: 'Refinado',
    explanation: 'Você amou vários livros, então estou focando no que já sei que você gosta.',
  },
];

// The edit form: the name goes to Firebase, the taste to PUT /me/preferences.
interface ProfileForm {
  name: string;
  favoriteGenre: string;
  favoriteAuthor: string;
  readingLevel: string;
  receiveRecommendations: boolean;
}

// Without preferences saved yet, the form starts blank, with the recommendations on.
const toProfileForm = (user: SessionUser, preferences: Preferences | null): ProfileForm => ({
  name: user.name || '',
  favoriteGenre: preferences?.favoriteGenre || '',
  favoriteAuthor: preferences?.favoriteAuthor || '',
  readingLevel: preferences?.readingLevel || '',
  receiveRecommendations: preferences?.receiveRecommendations ?? true,
});

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

// The photo of the Google account, or the initials when there is none or it does not load (deleted
// photo, no internet). Google's photo servers refuse the image when the browser sends the address
// of the page that asked for it (the Referer header), so it goes without one.
function ProfileAvatar({ user }: { user: SessionUser }) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const { photoUrl } = user;

  return (
    <Avatar aria-hidden="true">
      {photoUrl && photoUrl !== failedPhoto ? (
        <img
          src={photoUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedPhoto(photoUrl)}
        />
      ) : (
        initials(user.name)
      )}
    </Avatar>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { total, set: setLikedCount } = useLikedCount();
  const user = useSessionUser();
  // undefined while it loads; null when the person has not saved preferences yet.
  const [preferences, setPreferences] = useState<Preferences | null | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  // No session, no screen ("if (!user) return null"), so the empty form is never read.
  const [editForm, setEditForm] = useState<ProfileForm>(() =>
    user ? toProfileForm(user, null) : ({} as ProfileForm),
  );
  const [editErrors, setEditErrors] = useState<Record<string, string | null>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ text: string; id: number } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [resetting, setResetting] = useState(false);

  const loadStats = useCallback(async () => {
    const response = await recommendationsApi.getStats();
    setStats(response.success ? response.data : null);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    accountApi.getPreferences().then((response) => {
      setPreferences(response.success ? response.data : null);
    });
  }, []);

  const closeNotice = useCallback(() => setNotice(null), []);

  const openEdit = useCallback(() => {
    // Only called with the screen open, and the screen only opens with a session.
    setEditForm(toProfileForm(user!, preferences ?? null));
    setEditErrors({});
    setSaveError(null);
    setIsEditing(true);
  }, [user, preferences]);

  // The header pencil on mobile opens the edit dialog with ?editar=1, once the taste has arrived.
  useEffect(() => {
    if (searchParams.get('editar') !== '1' || preferences === undefined) return;
    openEdit();
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, openEdit, preferences]);

  const closeEdit = useCallback(() => setIsEditing(false), []);

  const handleFormChange = (field: keyof ProfileForm, value: ProfileForm[keyof ProfileForm]) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) setEditErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const name = editForm.name.trim();

    if (!name) {
      setEditErrors({ name: 'Informe seu nome' });
      return;
    }

    setLoading(true);
    setSaveError(null);

    try {
      // The screen only opens with a session (ProtectedRoute).
      if (name !== user!.name) await updateName(name);
    } catch (error) {
      setSaveError(`Não deu para salvar: ${authErrorMessage(error, 'erro ao trocar o nome')}`);
      setLoading(false);
      return;
    }

    const response = await accountApi.savePreferences(toPreferencesRequest(editForm));

    if (response.success) {
      setPreferences(response.data);
      setIsEditing(false);
      setNotice({ text: 'Perfil atualizado.', id: Date.now() });
    } else {
      setSaveError(`Não deu para salvar: ${response.error}`);
    }
    setLoading(false);
  };

  const confirmReset = async () => {
    setResetting(true);
    const response = await recommendationsApi.resetAlgorithm();
    setResetting(false);
    setShowResetModal(false);

    if (response.success) {
      // The reset also deletes the likes: "Meus livros" is empty now.
      setLikedCount(0);
      await loadStats();
      setNotice({
        text: 'Histórico apagado. O Matchbook recomeça pelo seu perfil.',
        id: Date.now(),
      });
    } else {
      setNotice({ text: 'Não deu para recomeçar agora.', id: Date.now() });
    }
  };

  const handleLogout = async () => {
    await logOut();
    navigate(paths.login);
  };

  const openDelete = () => {
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  // The order matters: Firebase only deletes with a recent login, and the backend only deletes
  // while the token still works, that is, before the Firebase account goes.
  const confirmDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await confirmIdentity();
    } catch (error) {
      // Closing the Google popup is giving up: the account stays.
      if (!isPopupClosed(error)) {
        setDeleteError(authErrorMessage(error, 'Não deu para confirmar sua conta. Tente de novo.'));
      }
      setDeleting(false);
      return;
    }

    const response = await accountApi.deleteData();
    if (!response.success) {
      setDeleteError('Não deu para apagar seus dados. Tente de novo.');
      setDeleting(false);
      return;
    }

    try {
      await deleteAccount();
      navigate(paths.login);
    } catch (error) {
      setDeleteError(
        authErrorMessage(error, 'Seus dados foram apagados, mas a conta não. Tente de novo.'),
      );
      setDeleting(false);
    }
  };

  if (!user) return null;

  const favoriteGenre = genreName(preferences?.favoriteGenre) || preferences?.favoriteGenre;
  const favoriteGenreColors = genreColors(preferences?.favoriteGenre);
  const currentStrategy =
    strategies.find((item) => item.key === stats?.currentStrategy) || strategies[0];
  const memberSince = formatMemberSince(user.createdAt);

  return (
    <AppLayout gap="20px">
      <ProfileHeader aria-label="Seus dados" {...appear(0)}>
        <ProfileAvatar user={user} />
        <ProfileInfo>
          <h1>{user.name}</h1>
          <p>
            {[user.email, memberSince && `Membro desde ${memberSince}`].filter(Boolean).join(' · ')}
          </p>
        </ProfileInfo>
        <HeaderStats>
          <StatTile label="Livros curtidos" value={total ?? 0} />
        </HeaderStats>
      </ProfileHeader>

      <TwoColumns>
        <Card aria-labelledby="tasteSection" {...appear(1)}>
          <CardHeading>
            <CardTitle id="tasteSection">Seu gosto</CardTitle>
            <Button $variant="secondary" onClick={openEdit} disabled={preferences === undefined}>
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
              <dd>{preferences?.favoriteAuthor || 'Não informado'}</dd>
            </InfoItem>
            <InfoItem>
              <dt>Nível de leitura</dt>
              <dd>{readingLevelLabel(preferences?.readingLevel) || 'Não informado'}</dd>
            </InfoItem>
            <StatusRow $enabled={preferences?.receiveRecommendations}>
              <dt>Recomendações personalizadas</dt>
              <dd>
                {preferences?.receiveRecommendations && <IconCheck size={16} />}
                {preferences?.receiveRecommendations ? 'Ativadas' : 'Desativadas'}
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
                <StatTile label="Amei" value={stats.totalAcceptances ?? 0} />
                <StatTile label="Próximo" value={stats.totalRejections ?? 0} />
                <StatTile
                  label="Aceitação"
                  value={`${Math.round(stats.acceptanceRate ?? 0)}%`}
                  color={colors.brand}
                />
              </AlgorithmStats>
              <ResetRow>
                <Button $variant="white" onClick={() => setShowResetModal(true)}>
                  <IconRefresh size={16} />
                  Recomeçar do zero
                </Button>
                <span>Apaga o histórico de Amei e Próximo e esvazia Meus livros.</span>
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
          <Button $variant="danger" onClick={openDelete}>
            <IconTrash size={16} />
            Excluir conta
          </Button>
        </DangerActions>
      </DangerCard>

      <Dialog open={isEditing} title="Editar perfil" onClose={closeEdit} width={600}>
        <EditForm onSubmit={handleSave} noValidate>
          <Field id="editName" label="Nome" error={editErrors.name}>
            <Input
              type="text"
              autoComplete="name"
              value={editForm.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
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
        description="O Matchbook esquece seus Amei e Próximo, Meus livros fica vazio e as recomendações voltam a seguir o seu perfil."
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
        description="Seus livros curtidos, preferências e histórico somem para sempre. Para confirmar, o Google pede a sua conta de novo."
        icon={<IconTrash size={24} />}
        confirmLabel="Sim, excluir"
        loading={deleting}
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      >
        {deleteError && (
          <FormAlert role="alert">
            <IconAlert size={18} />
            {deleteError}
          </FormAlert>
        )}
      </ConfirmDialog>

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
