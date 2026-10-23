import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthSide,
  AuthCard,
  AuthHeading,
  AuthTitle,
  AuthText,
  AuthForm,
  AuthFooter
} from "../../../components/AuthLayout";
import { Field, FormAlert, Input } from "../../../components/Field";
import { PasswordInput } from "../../../components/PasswordInput";
import { Button } from "../../../components/Button";
import { Spinner } from "../../../components/Spinner";
import { IconAlert } from "../../../components/Icons";
import { BrandRow, CoverStack, StackCover, QuoteText } from "./styles.module.jsx";
import { useAuth } from "../../../hooks/useAuth";
import { generos } from "../../../styles/tokens";

// Pilha de capas da lateral: posição, tamanho e giro no desktop e no celular.
const capasDaPilha = [
  { titulo: "O Hobbit", genero: "Fantasia", x: [0, 0], y: [50, 24], w: [200, 92], h: [280, 130], giro: -9, fonte: [32, 17], tituloCelular: false },
  { titulo: "1984", genero: "Distopia", x: [170, 58], y: [10, 6], w: [200, 92], h: [280, 130], giro: 7, fonte: [32, 17], tituloCelular: false },
  { titulo: "Fundação", genero: "Ficção Científica", x: [86, 28], y: [72, 34], w: [210, 98], h: [288, 134], giro: -1.5, fonte: [36, 17], tituloCelular: true },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [erros, setErros] = useState({});
  const [erroLogin, setErroLogin] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: null }));
    if (erroLogin) setErroLogin(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novosErros = {};
    if (!formData.email) novosErros.email = "Informe seu email";
    if (!formData.senha) novosErros.senha = "Informe sua senha";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const resultado = await login(formData.email, formData.senha);

    if (resultado.success) {
      navigate("/home");
    } else {
      setErroLogin(resultado.error || "Confira seu email e sua senha e tente de novo.");
    }
  };

  return (
    <AuthLayout>
      <AuthSide>
        <BrandRow>
          <CoverStack aria-hidden="true">
            {capasDaPilha.map((capa) => (
              <StackCover
                key={capa.titulo}
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
          <QuoteText>Um livro é um sonho que você segura em suas mãos.</QuoteText>
        </BrandRow>
      </AuthSide>

      <AuthCard aria-labelledby="tituloEntrar">
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
            {loading ? "Entrando" : "Entrar"}
          </Button>
        </AuthForm>

        <AuthFooter>
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}
