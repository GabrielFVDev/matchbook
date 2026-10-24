// Os dados como o servidor manda e recebe, com os nomes de campo do servidor. Quando o backend
// for refeito, o contrato muda aqui e o compilador aponta o resto.

export interface UserDto {
  id: number;
  nome: string;
  email: string;
  // O backend devolve a senha no cadastro e em GET /usuario/all; a sessão guarda o usuário sem ela.
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

// O que vai no cadastro: o usuário ainda sem id.
export type SignUpRequest = Omit<UserDto, 'id'> & { senha: string };

// O que vai no PUT /usuario/update: o formulário do Perfil, sem a senha (comportamento atual).
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
  // O campo da capa no backend se chama "capa".
  capa?: string | null;
  disponivel?: boolean;
  dataCadastro?: string | null;
}

// O que o formulário de Adicionar livro envia hoje. A capa vai como "capaUrl", que o backend
// ignora (o campo dele é "capa"); muda quando o backend for refeito.
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

// Um item da lista de favoritos. O backend manda o livro direto; Meus livros e a carta também
// leem campos que ele nunca manda ("livro", "livroId", "capaUrl", "imagem", "imagemUrl",
// "dataCurtida"). As leituras ficam como estão até a fase do backend (ver
// ~/.claude/handoffs/reestruturacao-matchbook.files/analise-arquitetura.md, seção 1.2).
export interface LikedBookItem extends Partial<BookDto> {
  livro?: Partial<BookDto> & { capaUrl?: string; imagem?: string; imagemUrl?: string };
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

// O que cada função de src/lib/api devolve: nunca lança, sempre responde neste formato.
export type ApiResult<T, F = null> =
  { success: true; data: T; message: string | null } | { success: false; data: F; error: string };
