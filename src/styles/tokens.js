// Tokens do design system "Pilha com hierarquia".
// Os valores vêm do board "Design system" do canvas de redesign.

export const cores = {
  tinta: '#1A1726',
  tintaSuave: '#5D5970',
  tintaSobreEscuro: '#C9C5DA',
  branco: '#FFFFFF',
  fundoApp: '#F2F0F7',
  fundoMarca: '#E6E3FF',
  marca: '#4B3FD6',
  erro: '#B42318',
  erroFundo: '#FDECEA',
  sucesso: '#17703F',
  sucessoFundo: '#DCF2E3',
  vazio: '#E4E1EE',
  desligado: '#BDB9CC',
};

// Cada gênero tem a cor da capa gerada e a cor de fundo da tela.
// Texto branco sobre "capa" e "capa" sobre "fundo" passam no contraste AA.
export const generos = {
  Romance: { capa: '#A13958', fundo: '#FFE4EA' },
  'Ficção Científica': { capa: '#4B3FD6', fundo: '#E6E3FF' },
  Fantasia: { capa: '#17703F', fundo: '#DCF2E3' },
  Mistério: { capa: '#714CA6', fundo: '#F0E8FF' },
  Terror: { capa: '#A43A41', fundo: '#FFE4E3' },
  Aventura: { capa: '#9A4A00', fundo: '#FFE8D6' },
  Drama: { capa: '#8E4088', fundo: '#FBE5F8' },
  Comédia: { capa: '#875A00', fundo: '#F8ECD3' },
  História: { capa: '#945000', fundo: '#FDE9D4' },
  Biografia: { capa: '#00758D', fundo: '#D3F4FA' },
  Autoajuda: { capa: '#007A46', fundo: '#DAF5E5' },
  Técnico: { capa: '#006AAA', fundo: '#D9F1FF' },
  Acadêmico: { capa: '#2063B0', fundo: '#DEEFFF' },
  Infantil: { capa: '#696800', fundo: '#EEEFD5' },
  'Jovem Adulto': { capa: '#983C75', fundo: '#FFE4F2' },
  Distopia: { capa: '#B13A0B', fundo: '#FFE3D6' },
  Thriller: { capa: '#5D53AE', fundo: '#EAEAFF' },
  Policial: { capa: '#00719E', fundo: '#D5F2FF' },
  Suspense: { capa: '#007779', fundo: '#D3F5F4' },
  Outros: { capa: '#4A4658', fundo: '#ECEAF1' },
};

export const listaGeneros = Object.keys(generos);

const semAcento = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const generosPorChave = Object.fromEntries(listaGeneros.map((nome) => [semAcento(nome), nome]));

// Aceita o gênero como vier da API ("ficção científica", "FICCAO CIENTIFICA"...)
// e devolve o nome oficial da lista, ou null se não for nenhum deles.
export const nomeDoGenero = (genero) => {
  if (!genero) return null;
  return generosPorChave[semAcento(genero)] || null;
};

export const coresDoGenero = (genero) => generos[nomeDoGenero(genero)] || generos['Outros'];

export const fonte = "'Bricolage Grotesque', system-ui, sans-serif";

export const raio = {
  campo: '14px',
  capa: '18px',
  cartao: '24px',
  carta: '30px',
  pilula: '999px',
};

export const sombra = {
  leve: '0 10px 28px rgba(26, 23, 38, 0.06)',
  ativo: '0 2px 8px rgba(26, 23, 38, 0.08)',
  botaoBranco: '0 6px 16px rgba(26, 23, 38, 0.1)',
  flutuante: '0 8px 24px rgba(26, 23, 38, 0.12)',
  cartao: '0 28px 64px rgba(26, 23, 38, 0.16)',
  carta: '0 28px 64px rgba(26, 23, 38, 0.2)',
  amei: '0 14px 30px rgba(26, 23, 38, 0.28)',
  aviso: '0 12px 32px rgba(26, 23, 38, 0.3)',
};

export const celular = '@media (max-width: 720px)';
