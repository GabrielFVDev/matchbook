// The data as the server sends and receives it, with the server field names. When the backend
// is rebuilt, the contract changes here and the compiler points out the rest.

export interface UserDto {
  id: number;
  nome: string;
  email: string;
  // The backend returns the password on sign-up and in GET /usuario/all; the session drops it.
  senha?: string;
  generoFavorito?: string | null;
  autorPreferido?: string | null;
  nivelLeitura?: string | null;
  livrosLidos?: number | null;
  receberRecomendacoes?: boolean | null;
  biografia?: string | null;
  dataNascimento?: string | null;
  dataCadastro?: string | null;
  fotoUrl?: string | null;
}

// What goes in the sign-up: the user still without an id.
export type SignUpRequest = Omit<UserDto, 'id'> & { senha: string };

// What goes in PUT /usuario/update: the Profile form, without the password (current behavior).
export type UpdateUserRequest = Omit<UserDto, 'senha'>;

export interface BookDto {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  editora?: string | null;
  anoPublicacao?: number | null;
  numeroPaginas?: number | null;
  idioma?: string | null;
  isbn?: string | null;
  sinopse?: string | null;
  // The cover field in the backend is called "capa".
  capa?: string | null;
  disponivel?: boolean;
  dataCadastro?: string | null;
}

// What the Add book form sends today. The cover goes as "capaUrl", which the backend
// ignores (its field is "capa"); changes when the backend is rebuilt.
export interface CreateBookRequest {
  titulo: string;
  autor: string;
  editora: string;
  genero: string;
  anoPublicacao: number | null;
  numeroPaginas: number | null;
  idioma: string;
  isbn: string;
  sinopse: string;
  capaUrl: string | null;
  disponivel: boolean;
}

// An item of the favorites list. The backend sends the book directly; My books and the card also
// read fields it never sends ("livro", "livroId", "capaUrl", "imagem", "imagemUrl",
// "dataCurtida"). The reads stay as they are until the backend phase (see
// ~/.claude/handoffs/reestruturacao-matchbook.files/analise-arquitetura.md, section 1.2).
export interface LikedBookItem extends Partial<BookDto> {
  livro?: Partial<BookDto> & {
    capaUrl?: string;
    imagem?: string;
    imagemUrl?: string;
    dataCurtida?: string;
  };
  livroId?: number;
  capaUrl?: string;
  imagem?: string;
  imagemUrl?: string;
  dataCurtida?: string;
}

export type Strategy = 'PADRAO' | 'DIVERSIFICADO' | 'EXPLORATORIO' | 'REFINADO';

export interface RecommendationStats {
  totalRecusas: number;
  totalAceites: number;
  taxaAceitacao: number;
  estrategiaAtual: Strategy | string;
}

export interface RejectResult {
  totalRecusas?: number;
  algoritmoAlterado?: boolean;
  sugestao?: string;
}

export interface LikeResult {
  sucesso: boolean;
  mensagem: string;
  id?: number;
}

export interface LikedCount {
  total: number;
}

// What each function in src/lib/api returns: it never throws, it always answers in this shape.
export type ApiResult<T, F = null> =
  { success: true; data: T; message: string | null } | { success: false; data: F; error: string };
