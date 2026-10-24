// Utilitários para formatação e validação de dados

// Formata data para o padrão brasileiro
export const formatarData = (data) => {
  if (!data) return '';

  const date = new Date(data);
  return date.toLocaleDateString('pt-BR');
};

// Formata data para input do tipo date (yyyy-mm-dd)
export const formatarDataParaInput = (data) => {
  if (!data) return '';

  const date = new Date(data);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Valida email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Valida se todos os campos obrigatórios estão preenchidos
export const validarCamposObrigatorios = (dados, camposObrigatorios) => {
  for (const campo of camposObrigatorios) {
    if (!dados[campo] || dados[campo].toString().trim() === '') {
      return {
        valido: false,
        erro: `O campo ${campo} é obrigatório`,
      };
    }
  }

  return { valido: true, erro: null };
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
