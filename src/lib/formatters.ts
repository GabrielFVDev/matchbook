// Helpers for formatting and validating data

// Validates an email
export const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// The user text fields the normalization touches; the rest passes through as it came.
interface UserFields {
  nome?: string;
  email?: string;
  generoFavorito?: string;
  autorPreferido?: string;
  nivelLeitura?: string;
  biografia?: string;
  livrosLidos?: number | string;
  receberRecomendacoes?: boolean;
}

// Normalizes user data before sending it to the API. The return type is the input's: trimming
// text keeps text, and livrosLidos and receberRecomendacoes always come out as number and boolean.
export const normalizeUserData = <T extends UserFields>(data: T) => {
  return {
    ...data,
    nome: data.nome?.trim(),
    email: data.email?.toLowerCase().trim(),
    generoFavorito: data.generoFavorito?.trim(),
    autorPreferido: data.autorPreferido?.trim(),
    nivelLeitura: data.nivelLeitura?.trim(),
    biografia: data.biografia?.trim(),
    livrosLidos: parseInt(String(data.livrosLidos)) || 0,
    receberRecomendacoes: Boolean(data.receberRecomendacoes),
  } as T & { livrosLidos: number; receberRecomendacoes: boolean };
};
