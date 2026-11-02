import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import {
  AuthLayout,
  AuthCard,
  AuthHeading,
  AuthEyebrow,
  AuthTitle,
  AuthText,
  AuthForm,
} from '@/layouts/AuthLayout';
import { FormAlert } from '@/components/Field';
import { TasteFields } from '@/components/TasteFields';
import type { TasteValues } from '@/components/TasteFields';
import { Button, ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { IconAlert, IconCheck, IconGoogle } from '@/components/Icons';
import {
  SignUpSide,
  SideTitle,
  SideHeadline,
  StepList,
  StepItem,
  StepNumber,
  StepText,
  StepPills,
  StepPill,
  PillNumber,
  ButtonRow,
  StepContent,
} from './styles';
import type { SignUpLocationState, StepState } from './types';
import { useGoogleSignIn } from '@/features/auth/useAuth';
import { paths } from '@/app/paths';
import { accountApi } from '@/lib/api/account';
import { toPreferencesRequest } from '@/lib/formatters';
import { useSessionUser } from '@/lib/session';
import { enterEase, exitEase, cardEntrance } from '@/styles/motion';

// The new step enters from the right; leaving, the old one goes to the left.
const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 40 }),
  idle: { opacity: 1, x: 0, transition: { duration: 0.3, ease: enterEase } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -40,
    transition: { duration: 0.15, ease: exitEase },
  }),
};

const steps = [
  { number: 1, name: 'Sua conta', detail: 'Com a sua conta do Google' },
  { number: 2, name: 'Seu gosto', detail: 'Gênero, autor e ritmo de leitura' },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSessionUser();
  const { signIn, loading: signingIn, error: signInError } = useGoogleSignIn();

  // A new account that came in through the login (LoginPage) starts at the taste step.
  const cameFromLogin = (location.state as SignUpLocationState | null)?.step === 2;
  const [step, setStep] = useState(user && cameFromLogin ? 2 : 1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);

  const [taste, setTaste] = useState<TasteValues>({
    favoriteGenre: '',
    favoriteAuthor: '',
    readingLevel: '',
    receiveRecommendations: false,
  });

  // The new account is already logged in: after a moment, goes to Home.
  useEffect(() => {
    if (!accountCreated) return undefined;
    const timer = setTimeout(() => navigate(paths.home), 3000);
    return () => clearTimeout(timer);
  }, [accountCreated, navigate]);

  const updateTaste = (field: keyof TasteValues, value: TasteValues[keyof TasteValues]) => {
    setTaste((prev) => ({ ...prev, [field]: value }));
    if (saveError) setSaveError(null);
  };

  // Step 1: the Google popup creates the account. An account that already existed skips the taste,
  // so its saved preferences are not replaced by a blank form.
  const handleGoogle = async () => {
    const result = await signIn();
    if (!result.success) return;
    if (result.isNewUser) setStep(2);
    else navigate(paths.home);
  };

  // Step 2: the taste goes to the backend, which keeps it under the uid of the token.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const response = await accountApi.savePreferences(toPreferencesRequest(taste));
    setSaving(false);

    if (response.success) {
      setAccountCreated(true);
    } else {
      setSaveError('Não deu para salvar seu gosto. Tente de novo ou pule esta etapa.');
    }
  };

  const firstName = user?.name?.trim().split(' ')[0];

  const stepState = (stepNumber: number): StepState =>
    stepNumber === step ? 'current' : stepNumber < step ? 'done' : 'next';

  return (
    <AuthLayout
      align="flex-start"
      topLink={
        <>
          Já tem conta? <Link to={paths.login}>Entrar</Link>
        </>
      }
    >
      <SignUpSide>
        <SideTitle>
          <AuthEyebrow $brand>Criar conta</AuthEyebrow>
          <SideHeadline>Duas etapas e você recebe seu primeiro livro.</SideHeadline>
        </SideTitle>
        <StepList aria-label="Etapas do cadastro">
          {steps.map((item) => {
            const state = stepState(item.number);
            return (
              <StepItem key={item.number} aria-current={state === 'current' ? 'step' : undefined}>
                <StepNumber $state={state}>
                  {state === 'done' ? <IconCheck size={20} /> : item.number}
                </StepNumber>
                <StepText $dimmed={state === 'next'}>
                  <strong>{item.name}</strong>
                  <span>{state === 'done' ? 'Pronta' : item.detail}</span>
                </StepText>
              </StepItem>
            );
          })}
        </StepList>
        <StepPills aria-label="Etapas do cadastro">
          {steps.map((item) => {
            const state = stepState(item.number);
            return (
              <StepPill
                key={item.number}
                $current={state === 'current'}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {state === 'done' ? (
                  <IconCheck size={16} />
                ) : (
                  <PillNumber $current={state === 'current'}>{item.number}</PillNumber>
                )}
                {item.name}
              </StepPill>
            );
          })}
        </StepPills>
      </SignUpSide>

      <AuthCard $width={560} aria-labelledby="signUpTitle" {...cardEntrance}>
        <AnimatePresence mode="wait" initial={false} custom={1}>
          {accountCreated ? (
            <StepContent key="accountCreated" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                icon={<IconCheck size={30} />}
                tone="success"
                title="Conta criada"
                description={`Boas-vindas${firstName ? `, ${firstName}` : ''}! Em instantes chega o seu primeiro livro.`}
                role="status"
              >
                <ButtonLink to={paths.home} $variant="primary">
                  Ver meu primeiro livro
                </ButtonLink>
              </EmptyState>
            </StepContent>
          ) : (
            <StepContent
              key={step}
              custom={1}
              variants={stepVariants}
              initial="enter"
              animate="idle"
              exit="exit"
            >
              <AuthHeading>
                <AuthEyebrow>Etapa {step} de 2</AuthEyebrow>
                <AuthTitle id="signUpTitle">{step === 1 ? 'Sua conta' : 'Seu gosto'}</AuthTitle>
                <AuthText>
                  {step === 1
                    ? 'Entre com a sua conta do Google. O Matchbook não guarda senha.'
                    : 'Ajuda o Matchbook a acertar desde o primeiro livro. Tudo aqui é opcional.'}
                </AuthText>
              </AuthHeading>

              {step === 1 ? (
                <AuthForm as="div">
                  {signInError && (
                    <FormAlert role="alert">
                      <IconAlert size={18} />
                      {signInError}
                    </FormAlert>
                  )}
                  <Button
                    $variant="secondary"
                    $size="large"
                    $fullWidth
                    disabled={signingIn}
                    onClick={handleGoogle}
                  >
                    {signingIn ? <Spinner /> : <IconGoogle size={20} />}
                    {signingIn ? 'Criando conta' : 'Criar conta com Google'}
                  </Button>
                </AuthForm>
              ) : (
                <AuthForm onSubmit={handleSubmit} noValidate>
                  <TasteFields values={taste} onChange={updateTaste} idPrefix="signUp" />

                  {saveError && (
                    <FormAlert role="alert">
                      <IconAlert size={18} />
                      {saveError}
                    </FormAlert>
                  )}

                  {/* The account already exists: skipping only leaves the taste for the Profile. */}
                  <ButtonRow>
                    <ButtonLink to={paths.home} $variant="secondary" $size="large">
                      Pular
                    </ButtonLink>
                    <Button type="submit" $size="large" disabled={saving}>
                      {saving && <Spinner />}
                      {saving ? 'Salvando' : 'Salvar e começar'}
                    </Button>
                  </ButtonRow>
                </AuthForm>
              )}
            </StepContent>
          )}
        </AnimatePresence>
      </AuthCard>
    </AuthLayout>
  );
}
