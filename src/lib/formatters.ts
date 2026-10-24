// Utilitários para formatação e validação de dados

// Valida email
export const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Os campos de texto do usuário que a normalização mexe; o resto passa como veio.
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

// Normaliza dados do usuário antes de enviar para a API. O tipo de volta é o da entrada: aparar
// texto mantém texto, e livrosLidos e receberRecomendacoes saem sempre como número e booleano.
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
