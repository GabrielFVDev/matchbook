export interface BookForm {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  publicationYear: string;
  pageCount: string;
  language: string;
  synopsis: string;
  coverUrl: string;
}

export type BookFormErrors = Partial<Record<keyof BookForm, string>>;

export interface AddedBook {
  title: string;
  inFavorites: boolean;
}
