import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Field, FormAlert, Input } from '@/components/Field';
import { PasswordInput } from '@/components/PasswordInput';
import { TasteFields } from '@/components/TasteFields';
import { Button, ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { IconAlert, IconArrowLeft, IconArrowRight, IconCheck } from '@/components/Icons';
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
import type { StepState } from './styles';
import { useSignUp } from '@/features/auth/useAuth';
import { paths } from '@/app/paths';
import { isValidEmail, toPreferencesRequest } from '@/lib/formatters';
import { enterEase, exitEase, cardEntrance } from '@/styles/motion';

// The new step enters from the side of travel: from the right going on, from the left going back.
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
  { number: 1, name: 'Sua conta', detail: 'Nome, email e senha' },
  { number: 2, name: 'Seu gosto', detail: 'Gênero, autor e ritmo de leitura' },
];

// The form of both steps: the account goes to Firebase, the taste to the backend.
interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  favoriteGenre: string;
  favoriteAuthor: string;
  readingLevel: string;
  receiveRecommendations: boolean;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, loading } = useSignUp();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);

  const [formData, setFormData] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const updateField = <K extends keyof SignUpForm>(field: K, value: SignUpForm[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    if (signUpError) setSignUpError(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateField(e.target.name as keyof SignUpForm, e.target.value);

  const passwordValid = formData.password.length >= 6;
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Informe seu nome';
    if (!formData.email.trim()) newErrors.email = 'Informe seu email';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Esse email parece incompleto';
    if (!formData.password) newErrors.password = 'Crie uma senha';
    else if (!passwordValid) newErrors.password = 'Use pelo menos 6 caracteres';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Repita a senha';
    else if (!passwordsMatch) newErrors.confirmPassword = 'As senhas não coincidem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep2 = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setDirection(1);
      setStep(2);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const account = {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
    };
    const result = await signUp(account, toPreferencesRequest(formData));

    if (result.success) {
      setAccountCreated(true);
    } else {
      setSignUpError(result.error || 'Não deu para criar sua conta. Tente de novo.');
    }
  };

  // Messages under the passwords: a submit error wins over the live validation.
  const passwordMessage = errors.password
    ? { error: errors.password }
    : formData.password
      ? passwordValid
        ? { success: 'Senha válida' }
        : { error: 'Muito curta, use pelo menos 6 caracteres' }
      : { help: 'Pelo menos 6 caracteres' };

  const confirmationMessage = errors.confirmPassword
    ? { error: errors.confirmPassword }
    : formData.confirmPassword
      ? passwordsMatch
        ? { success: 'As senhas coincidem' }
        : { error: 'As senhas não coincidem' }
      : {};

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
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {accountCreated ? (
            <StepContent key="accountCreated" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                icon={<IconCheck size={30} />}
                tone="success"
                title="Conta criada"
                description={`Boas-vindas, ${formData.name.trim().split(' ')[0]}! Em instantes chega o seu primeiro livro.`}
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
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="idle"
              exit="exit"
            >
              <AuthHeading>
                <AuthEyebrow>Etapa {step} de 2</AuthEyebrow>
                <AuthTitle id="signUpTitle">{step === 1 ? 'Sua conta' : 'Seu gosto'}</AuthTitle>
                {step === 2 && (
                  <AuthText>
                    Ajuda o Matchbook a acertar desde o primeiro livro. Tudo aqui é opcional.
                  </AuthText>
                )}
              </AuthHeading>

              {step === 1 ? (
                <AuthForm onSubmit={goToStep2} noValidate>
                  <Field id="name" label="Nome completo" error={errors.name}>
                    <Input
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="password" label="Senha" {...passwordMessage}>
                    <PasswordInput
                      name="password"
                      autoComplete="new-password"
                      placeholder="Crie uma senha"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="confirmPassword" label="Confirmar senha" {...confirmationMessage}>
                    <PasswordInput
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Repita a senha"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Button type="submit" $size="large" $fullWidth>
                    Continuar
                    <IconArrowRight size={18} />
                  </Button>
                </AuthForm>
              ) : (
                <AuthForm onSubmit={handleSubmit} noValidate>
                  <TasteFields values={formData} onChange={updateField} idPrefix="signUp" />

                  {signUpError && (
                    <FormAlert role="alert">
                      <IconAlert size={18} />
                      {signUpError}
                    </FormAlert>
                  )}

                  <ButtonRow>
                    <Button
                      $variant="secondary"
                      $size="large"
                      onClick={() => {
                        setDirection(-1);
                        setStep(1);
                      }}
                    >
                      <IconArrowLeft size={18} />
                      Voltar
                    </Button>
                    <Button type="submit" $size="large" disabled={loading}>
                      {loading && <Spinner />}
                      {loading ? 'Criando conta' : 'Criar conta'}
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
