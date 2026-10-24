import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AuthLayout,
  AuthSide,
  AuthCard,
  AuthHeading,
  AuthTitle,
  AuthText,
  AuthForm,
  AuthFooter,
} from '@/layouts/AuthLayout';
import { Field, FormAlert, Input } from '@/components/Field';
import { PasswordInput } from '@/components/PasswordInput';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { IconAlert } from '@/components/Icons';
import { BrandRow, CoverStack, StackCover, QuoteText } from './styles';
import { useAuth } from '@/features/auth/useAuth';
import { genres } from '@/styles/tokens';
import type { GenreName } from '@/styles/tokens';
import { enterEase, cardEntrance, spring, softSpring } from '@/styles/motion';
import type { Variants } from 'motion/react';
import { paths } from '@/app/paths';

// Cada medida vem em par: [desktop, celular].
type Pair = [number, number];

interface StackCoverSpec {
  title: string;
  genre: GenreName;
  x: Pair;
  y: Pair;
  w: Pair;
  h: Pair;
  tilt: number;
  spread: number;
  fontSize: Pair;
  mobileTitle: boolean;
}

// Pilha de capas da lateral: posição, tamanho e giro no desktop e no celular.
// "spread" é quanto cada capa se afasta quando o mouse passa por cima da pilha.
const stackCovers: StackCoverSpec[] = [
  {
    title: 'O Hobbit',
    genre: 'Fantasia',
    x: [0, 0],
    y: [50, 24],
    w: [200, 92],
    h: [280, 130],
    tilt: -9,
    spread: -22,
    fontSize: [32, 17],
    mobileTitle: false,
  },
  {
    title: '1984',
    genre: 'Distopia',
    x: [170, 58],
    y: [10, 6],
    w: [200, 92],
    h: [280, 130],
    tilt: 7,
    spread: 22,
    fontSize: [32, 17],
    mobileTitle: false,
  },
  {
    title: 'Fundação',
    genre: 'Ficção Científica',
    x: [86, 28],
    y: [72, 34],
    w: [210, 98],
    h: [288, 134],
    tilt: -1.5,
    spread: 0,
    fontSize: [36, 17],
    mobileTitle: true,
  },
];

// As capas caem uma de cada vez e se abrem em leque no hover.
const coverVariants: Variants = {
  hidden: { opacity: 0, y: -48, rotate: 0 },
  visible: (cover: StackCoverSpec) => ({
    opacity: 1,
    y: 0,
    x: 0,
    rotate: cover.tilt,
    transition: softSpring,
  }),
  open: (cover: StackCoverSpec) => ({
    rotate: cover.tilt * 1.8,
    x: cover.spread,
    y: cover.spread ? 0 : -10,
    transition: spring,
  }),
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [stackReady, setStackReady] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (loginError) setLoginError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Informe seu email';
    if (!formData.senha) newErrors.senha = 'Informe sua senha';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await login(formData.email, formData.senha);

    if (result.success) {
      navigate(paths.home);
    } else {
      setLoginError(result.error || 'Confira seu email e sua senha e tente de novo.');
    }
  };

  return (
    <AuthLayout>
      <AuthSide>
        <BrandRow>
          <CoverStack
            aria-hidden="true"
            initial="hidden"
            animate="visible"
            whileHover="open"
            variants={{
              visible: {
                transition: stackReady ? {} : { delayChildren: 0.15, staggerChildren: 0.12 },
              },
            }}
            onAnimationComplete={() => setStackReady(true)}
          >
            {stackCovers.map((cover) => (
              <StackCover
                key={cover.title}
                custom={cover}
                variants={coverVariants}
                $color={genres[cover.genre].cover}
                $x={cover.x}
                $y={cover.y}
                $w={cover.w}
                $h={cover.h}
                $tilt={cover.tilt}
                $fontSize={cover.fontSize}
                $mobileTitle={cover.mobileTitle}
              >
                <span>{cover.genre}</span>
                <span>{cover.title}</span>
              </StackCover>
            ))}
          </CoverStack>
          <QuoteText
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: enterEase, delay: 0.5 },
            }}
          >
            Um livro é um sonho que você segura em suas mãos.
          </QuoteText>
        </BrandRow>
      </AuthSide>

      <AuthCard aria-labelledby="loginTitle" {...cardEntrance}>
        <AuthHeading>
          <AuthTitle id="loginTitle">Entrar</AuthTitle>
          <AuthText>Boas-vindas de volta ao Matchbook.</AuthText>
        </AuthHeading>

        <AuthForm onSubmit={handleSubmit} noValidate>
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
          <Field id="senha" label="Senha" error={errors.senha}>
            <PasswordInput
              name="senha"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={formData.senha}
              onChange={handleInputChange}
            />
          </Field>

          {loginError && (
            <FormAlert role="alert">
              <IconAlert size={18} />
              {loginError}
            </FormAlert>
          )}

          <Button type="submit" $size="large" $fullWidth disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Entrando' : 'Entrar'}
          </Button>
        </AuthForm>

        <AuthFooter>
          Ainda não tem conta? <Link to={paths.signUp}>Criar conta</Link>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}
