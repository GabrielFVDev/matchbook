// Utilitários para formatação e validação de dados

// Valida email
export const validarEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Os campos de texto do usuário que a normalização mexe; o resto passa como veio.
interface DadosUsuario {
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
export const normalizarDadosUsuario = <T extends DadosUsuario>(dados: T) => {
  return {
    ...dados,
    nome: dados.nome?.trim(),
    email: dados.email?.toLowerCase().trim(),
    generoFavorito: dados.generoFavorito?.trim(),
    autorPreferido: dados.autorPreferido?.trim(),
    nivelLeitura: dados.nivelLeitura?.trim(),
    biografia: dados.biografia?.trim(),
    livrosLidos: parseInt(String(dados.livrosLidos)) || 0,
    receberRecomendacoes: Boolean(dados.receberRecomendacoes),
  } as T & { livrosLidos: number; receberRecomendacoes: boolean };
};
