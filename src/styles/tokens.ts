// Tokens of the "Pilha com hierarquia" design system.
// The values come from the "Design system" board of the redesign canvas.

export const colors = {
  ink: '#1A1726',
  inkSoft: '#5D5970',
  inkOnDark: '#C9C5DA',
  white: '#FFFFFF',
  appBackground: '#F2F0F7',
  brandBackground: '#E6E3FF',
  brand: '#4B3FD6',
  error: '#B42318',
  errorBackground: '#FDECEA',
  success: '#17703F',
  successBackground: '#DCF2E3',
  empty: '#E4E1EE',
  disabled: '#BDB9CC',
};

export interface GenreColors {
  cover: string;
  background: string;
}

// Each genre has the color of the generated cover and the screen background color.
// White text on "cover" and "cover" on "background" pass AA contrast.
export const genres = {
  Romance: { cover: '#A13958', background: '#FFE4EA' },
  'Ficção Científica': { cover: '#4B3FD6', background: '#E6E3FF' },
  Fantasia: { cover: '#17703F', background: '#DCF2E3' },
  Mistério: { cover: '#714CA6', background: '#F0E8FF' },
  Terror: { cover: '#A43A41', background: '#FFE4E3' },
  Aventura: { cover: '#9A4A00', background: '#FFE8D6' },
  Drama: { cover: '#8E4088', background: '#FBE5F8' },
  Comédia: { cover: '#875A00', background: '#F8ECD3' },
  História: { cover: '#945000', background: '#FDE9D4' },
  Biografia: { cover: '#00758D', background: '#D3F4FA' },
  Autoajuda: { cover: '#007A46', background: '#DAF5E5' },
  Técnico: { cover: '#006AAA', background: '#D9F1FF' },
  Acadêmico: { cover: '#2063B0', background: '#DEEFFF' },
  Infantil: { cover: '#696800', background: '#EEEFD5' },
  'Jovem Adulto': { cover: '#983C75', background: '#FFE4F2' },
  Distopia: { cover: '#B13A0B', background: '#FFE3D6' },
  Thriller: { cover: '#5D53AE', background: '#EAEAFF' },
  Policial: { cover: '#00719E', background: '#D5F2FF' },
  Suspense: { cover: '#007779', background: '#D3F5F4' },
  Outros: { cover: '#4A4658', background: '#ECEAF1' },
} satisfies Record<string, GenreColors>;

// The official name of a genre: one of the keys of the map above.
export type GenreName = keyof typeof genres;

export const genreList = Object.keys(genres) as GenreName[];

const stripAccents = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const genresByKey: Record<string, GenreName> = Object.fromEntries(
  genreList.map((name) => [stripAccents(name), name]),
);

// Takes the genre as it comes from the API ("ficção científica", "FICCAO CIENTIFICA"...)
// and returns the official name from the list, or null if it is none of them.
export const genreName = (genre?: string | null): GenreName | null => {
  if (!genre) return null;
  return genresByKey[stripAccents(genre)] || null;
};

export const genreColors = (genre?: string | null): GenreColors => {
  const name = genreName(genre);
  return (name && genres[name]) || genres['Outros'];
};

export const font = "'Bricolage Grotesque', system-ui, sans-serif";

export const radius = {
  field: '14px',
  cover: '18px',
  card: '24px',
  matchCard: '30px',
  pill: '999px',
};

export const shadow = {
  soft: '0 10px 28px rgba(26, 23, 38, 0.06)',
  active: '0 2px 8px rgba(26, 23, 38, 0.08)',
  whiteButton: '0 6px 16px rgba(26, 23, 38, 0.1)',
  floating: '0 8px 24px rgba(26, 23, 38, 0.12)',
  card: '0 28px 64px rgba(26, 23, 38, 0.16)',
  matchCard: '0 28px 64px rgba(26, 23, 38, 0.2)',
  love: '0 14px 30px rgba(26, 23, 38, 0.28)',
  toast: '0 12px 32px rgba(26, 23, 38, 0.3)',
};

export const mobile = '@media (max-width: 720px)';
