import { useState } from 'react';
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
} from '../../../components/AuthLayout';
import { Field, FormAlert, Input } from '../../../components/Field';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';
import { Spinner } from '../../../components/Spinner';
import { IconAlert } from '../../../components/Icons';
import { BrandRow, CoverStack, StackCover, QuoteText } from './styles.module.jsx';
import { useAuth } from '../../../hooks/useAuth';
import { generos } from '../../../styles/tokens';
import { curvaEntrada, entradaCartao, mola, molaSuave } from '../../../styles/movimento';

// Pilha de capas da lateral: posição, tamanho e giro no desktop e no celular.
// "abrir" é quanto cada capa se afasta quando o mouse passa por cima da pilha.
const capasDaPilha = [
  {
    titulo: 'O Hobbit',
    genero: 'Fantasia',
    x: [0, 0],
    y: [50, 24],
    w: [200, 92],
    h: [280, 130],
    giro: -9,
    abrir: -22,
    fonte: [32, 17],
    tituloCelular: false,
  },
  {
    titulo: '1984',
    genero: 'Distopia',
    x: [170, 58],
    y: [10, 6],
    w: [200, 92],
    h: [280, 130],
    giro: 7,
    abrir: 22,
    fonte: [32, 17],
    tituloCelular: false,
  },
  {
    titulo: 'Fundação',
    genero: 'Ficção Científica',
    x: [86, 28],
    y: [72, 34],
    w: [210, 98],
    h: [288, 134],
    giro: -1.5,
    abrir: 0,
    fonte: [36, 17],
    tituloCelular: true,
  },
];

// As capas caem uma de cada vez e se abrem em leque no hover.
const variantesCapa = {
  escondida: { opacity: 0, y: -48, rotate: 0 },
  visivel: (capa) => ({ opacity: 1, y: 0, x: 0, rotate: capa.giro, transition: molaSuave }),
  aberta: (capa) => ({
    rotate: capa.giro * 1.8,
    x: capa.abrir,
    y: capa.abrir ? 0 : -10,
    transition: mola,
  }),
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroLogin, setErroLogin] = useState(null);
  const [pilhaPronta, setPilhaPronta] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: null }));
    if (erroLogin) setErroLogin(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novosErros = {};
    if (!formData.email) novosErros.email = 'Informe seu email';
    if (!formData.senha) novosErros.senha = 'Informe sua senha';
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const resultado = await login(formData.email, formData.senha);

    if (resultado.success) {
      navigate('/home');
    } else {
      setErroLogin(resultado.error || 'Confira seu email e sua senha e tente de novo.');
    }
  };

  return (
    <AuthLayout>
      <AuthSide>
        <BrandRow>
          <CoverStack
            aria-hidden="true"
            initial="escondida"
            animate="visivel"
            whileHover="aberta"
            variants={{
              visivel: {
                transition: pilhaPronta ? {} : { delayChildren: 0.15, staggerChildren: 0.12 },
              },
            }}
            onAnimationComplete={() => setPilhaPronta(true)}
          >
            {capasDaPilha.map((capa) => (
              <StackCover
                key={capa.titulo}
                custom={capa}
                variants={variantesCapa}
                $cor={generos[capa.genero].capa}
                $x={capa.x}
                $y={capa.y}
                $w={capa.w}
                $h={capa.h}
                $giro={capa.giro}
                $fonte={capa.fonte}
                $tituloCelular={capa.tituloCelular}
              >
                <span>{capa.genero}</span>
                <span>{capa.titulo}</span>
              </StackCover>
            ))}
          </CoverStack>
          <QuoteText
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: curvaEntrada, delay: 0.5 },
            }}
          >
            Um livro é um sonho que você segura em suas mãos.
          </QuoteText>
        </BrandRow>
      </AuthSide>

      <AuthCard aria-labelledby="tituloEntrar" {...entradaCartao}>
        <AuthHeading>
          <AuthTitle id="tituloEntrar">Entrar</AuthTitle>
          <AuthText>Boas-vindas de volta ao Matchbook.</AuthText>
        </AuthHeading>

        <AuthForm onSubmit={handleSubmit} noValidate>
          <Field id="email" label="Email" error={erros.email}>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Field>
          <Field id="senha" label="Senha" error={erros.senha}>
            <PasswordInput
              name="senha"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={formData.senha}
              onChange={handleInputChange}
            />
          </Field>

          {erroLogin && (
            <FormAlert role="alert">
              <IconAlert tamanho={18} />
              {erroLogin}
            </FormAlert>
          )}

          <Button type="submit" $tamanho="grande" $total disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Entrando' : 'Entrar'}
          </Button>
        </AuthForm>

        <AuthFooter>
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}
