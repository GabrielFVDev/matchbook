// Utilitários para formatação e validação de dados

// Valida email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Normaliza dados do usuário antes de enviar para a API
export const normalizarDadosUsuario = (dados) => {
  return {
    ...dados,
    nome: dados.nome?.trim(),
    email: dados.email?.toLowerCase().trim(),
    generoFavorito: dados.generoFavorito?.trim(),
    autorPreferido: dados.autorPreferido?.trim(),
    nivelLeitura: dados.nivelLeitura?.trim(),
    biografia: dados.biografia?.trim(),
    livrosLidos: parseInt(dados.livrosLidos) || 0,
    receberRecomendacoes: Boolean(dados.receberRecomendacoes),
  };
};
