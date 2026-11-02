import type { CreateBookRequest } from '@/lib/api/types';
import type { BookForm, BookFormErrors } from './types';

export const languages = [
  'Português',
  'Inglês',
  'Espanhol',
  'Francês',
  'Alemão',
  'Italiano',
  'Japonês',
  'Outros',
];

export const emptyBookForm: BookForm = {
  title: '',
  author: '',
  publisher: '',
  genre: '',
  publicationYear: '',
  pageCount: '',
  language: 'Português',
  synopsis: '',
  coverUrl: '',
};

export const maxTextLength = 255;

export const maxPublicationYear = () => new Date().getFullYear() + 1;

const isValidUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

export const validateBookForm = (form: BookForm): BookFormErrors => {
  const errors: BookFormErrors = {};
  const maxYear = maxPublicationYear();

  if (!form.title.trim()) errors.title = 'Informe o título';
  if (!form.author.trim()) errors.author = 'Informe o autor';
  if (!form.genre) errors.genre = 'Escolha um gênero';

  if (
    form.publicationYear &&
    (Number(form.publicationYear) < 1000 || Number(form.publicationYear) > maxYear)
  ) {
    errors.publicationYear = `Use um ano entre 1000 e ${maxYear}`;
  }

  if (form.pageCount && (Number(form.pageCount) < 1 || Number(form.pageCount) > 10000)) {
    errors.pageCount = 'Use um número entre 1 e 10.000';
  }

  if (form.coverUrl && !isValidUrl(form.coverUrl)) {
    errors.coverUrl = 'Esse link não parece válido, ele começa com https://';
  }

  return errors;
};

export const toCreateBookRequest = (form: BookForm): CreateBookRequest => ({
  ...form,
  publicationYear: form.publicationYear ? parseInt(form.publicationYear) : null,
  pageCount: form.pageCount ? parseInt(form.pageCount) : null,
  coverUrl: form.coverUrl || null,
});
