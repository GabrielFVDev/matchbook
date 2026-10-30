import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppLayout } from '@/layouts/AppLayout';
import { BookCover } from '@/components/BookCover';
import { Tag } from '@/components/Chip';
import { Field, FormAlert, Input, Select, TextArea } from '@/components/Field';
import { Button, ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { IconAlert, IconCheck, IconHeart } from '@/components/Icons';
import {
  PageHeading,
  PageTitle,
  PageSubtitle,
  Columns,
  FormContainer,
  FormSection,
  SectionHeading,
  SectionTitle,
  FieldsGrid,
  CounterRow,
  SubmitRow,
  PreviewAside,
  PreviewLabel,
  PreviewCard,
  PreviewInfo,
  MobilePreview,
  MobilePreviewText,
  SuccessWrapper,
} from './styles';
import { useLikedCount } from '@/lib/likedCount';
import { booksApi } from '@/lib/api/books';
import { recommendationsApi } from '@/lib/api/recommendations';
import { paths } from '@/app/paths';
import { colors, genreList } from '@/styles/tokens';
import { exitEase, appear } from '@/styles/motion';

const quickExit = { opacity: 0, y: -8, transition: { duration: 0.15, ease: exitEase } };

const languages = [
  'Português',
  'Inglês',
  'Espanhol',
  'Francês',
  'Alemão',
  'Italiano',
  'Japonês',
  'Outros',
];

const emptyForm = {
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

type BookForm = typeof emptyForm;

// Every text column of the books table is varchar(255): a longer text makes the database refuse the book.
const maxTextLength = 255;

const isValidUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

export default function AddBookPage() {
  const { add } = useLikedCount();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; inFavorites: boolean } | null>(null);

  const maxYear = new Date().getFullYear() + 1;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (submitError) setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Informe o título';
    if (!formData.author.trim()) newErrors.author = 'Informe o autor';
    if (!formData.genre) newErrors.genre = 'Escolha um gênero';

    if (
      formData.publicationYear &&
      (Number(formData.publicationYear) < 1000 || Number(formData.publicationYear) > maxYear)
    ) {
      newErrors.publicationYear = `Use um ano entre 1000 e ${maxYear}`;
    }

    if (
      formData.pageCount &&
      (Number(formData.pageCount) < 1 || Number(formData.pageCount) > 10000)
    ) {
      newErrors.pageCount = 'Use um número entre 1 e 10.000';
    }

    if (formData.coverUrl && !isValidUrl(formData.coverUrl)) {
      newErrors.coverUrl = 'Esse link não parece válido, ele começa com https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitError('Confira os campos marcados e tente de novo.');
      return;
    }

    setLoading(true);

    const bookData = {
      ...formData,
      publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : null,
      coverUrl: formData.coverUrl || null,
    };

    const response = await booksApi.create(bookData);

    if (response.success) {
      // Whoever adds a book to the catalog also takes it to their favorites, by accepting it.
      const likeResponse = await recommendationsApi.accept(response.data.id);
      if (likeResponse.success) {
        add(1);
      } else {
        console.warn('Error adding to favorites:', likeResponse.error);
      }
      setResult({ title: formData.title, inFavorites: likeResponse.success });
      setFormData(emptyForm);
    } else {
      setSubmitError(response.error || 'Não deu para adicionar o livro. Tente de novo.');
    }

    setLoading(false);
  };

  const addAnother = () => {
    setResult(null);
    window.scrollTo({ top: 0 });
  };

  const synopsisCount = `${formData.synopsis.length} de ${maxTextLength}`;

  return (
    <AppLayout>
      <PageHeading>
        <PageTitle>Adicionar livro</PageTitle>
        <PageSubtitle>Ele entra no catálogo e vai direto para os seus livros.</PageSubtitle>
      </PageHeading>

      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <SuccessWrapper key="success" exit={quickExit}>
            <EmptyState
              icon={<IconCheck size={30} />}
              tone="success"
              title="Livro adicionado"
              description={
                result.inFavorites
                  ? `${result.title} já está nos seus livros e no catálogo.`
                  : `${result.title} entrou no catálogo, mas não foi para os seus livros. Dê Amei nele quando aparecer no Início.`
              }
              role="status"
            >
              <ButtonLink to={paths.myBooks}>Ver meus livros</ButtonLink>
              <Button $variant="secondary" onClick={addAnother}>
                Adicionar outro
              </Button>
            </EmptyState>
          </SuccessWrapper>
        ) : (
          <Columns key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={quickExit}>
            <MobilePreview role="group" aria-label="Prévia da capa">
              <BookCover
                size="mini"
                title={formData.title}
                genre={formData.genre}
                coverUrl={formData.coverUrl}
                placeholderTitle="Título do livro"
              />
              <MobilePreviewText $empty={!formData.author}>
                <p>Prévia</p>
                {formData.genre && (
                  <Tag $background={colors.appBackground} $small>
                    {formData.genre}
                  </Tag>
                )}
                <p>{formData.author || 'Autor'}</p>
              </MobilePreviewText>
            </MobilePreview>

            <FormContainer onSubmit={handleSubmit} noValidate>
              <FormSection aria-labelledby="aboutSection" {...appear(0)}>
                <SectionTitle id="aboutSection">Sobre o livro</SectionTitle>
                <FieldsGrid>
                  <Field id="title" label="Título" tag="obrigatório" error={errors.title} span>
                    <Input
                      name="title"
                      type="text"
                      maxLength={maxTextLength}
                      placeholder="Como está na capa"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="author" label="Autor" tag="obrigatório" error={errors.author}>
                    <Input
                      name="author"
                      type="text"
                      maxLength={maxTextLength}
                      placeholder="Nome de quem escreveu"
                      value={formData.author}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="genre" label="Gênero" tag="obrigatório" error={errors.genre}>
                    <Select name="genre" value={formData.genre} onChange={handleInputChange}>
                      <option value="">Escolha um gênero</option>
                      {genreList.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field id="publisher" label="Editora">
                    <Input
                      name="publisher"
                      type="text"
                      maxLength={maxTextLength}
                      placeholder="Ex.: Companhia das Letras"
                      value={formData.publisher}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="language" label="Idioma">
                    <Select name="language" value={formData.language} onChange={handleInputChange}>
                      {languages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    id="publicationYear"
                    label="Ano de publicação"
                    error={errors.publicationYear}
                    data-half
                  >
                    <Input
                      name="publicationYear"
                      type="number"
                      inputMode="numeric"
                      min="1000"
                      max={maxYear}
                      placeholder="Ex.: 1951"
                      value={formData.publicationYear}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field
                    id="pageCount"
                    label="Número de páginas"
                    error={errors.pageCount}
                    data-half
                  >
                    <Input
                      name="pageCount"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="10000"
                      placeholder="Ex.: 320"
                      value={formData.pageCount}
                      onChange={handleInputChange}
                    />
                  </Field>
                </FieldsGrid>
              </FormSection>

              <FormSection aria-labelledby="synopsisSection" {...appear(1)}>
                <SectionHeading>
                  <SectionTitle id="synopsisSection">Sinopse</SectionTitle>
                  <CounterRow aria-live="polite">{synopsisCount}</CounterRow>
                </SectionHeading>
                <Field id="synopsis" label="Do que o livro trata">
                  <TextArea
                    name="synopsis"
                    rows={5}
                    maxLength={maxTextLength}
                    placeholder="Em poucas linhas"
                    value={formData.synopsis}
                    onChange={handleInputChange}
                  />
                </Field>
              </FormSection>

              <FormSection aria-labelledby="coverSection" {...appear(2)}>
                <SectionTitle id="coverSection">Capa</SectionTitle>
                <Field
                  id="coverUrl"
                  label="Link da imagem"
                  error={errors.coverUrl}
                  help="Sem link, o Matchbook monta uma capa com a cor do gênero."
                >
                  <Input
                    name="coverUrl"
                    type="url"
                    maxLength={maxTextLength}
                    placeholder="https://"
                    value={formData.coverUrl}
                    onChange={handleInputChange}
                  />
                </Field>
              </FormSection>

              {submitError && (
                <FormAlert role="alert">
                  <IconAlert size={18} />
                  {submitError}
                </FormAlert>
              )}

              <SubmitRow>
                <Button type="submit" $size="large" disabled={loading}>
                  {loading ? <Spinner /> : <IconHeart size={18} />}
                  {loading ? 'Adicionando' : 'Adicionar aos meus livros'}
                </Button>
                <ButtonLink to={paths.home} $variant="white" $size="large">
                  Cancelar
                </ButtonLink>
              </SubmitRow>
            </FormContainer>

            <PreviewAside
              aria-label="Prévia da capa"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.15 } }}
            >
              <PreviewLabel>Prévia</PreviewLabel>
              <PreviewCard>
                <BookCover
                  size="preview"
                  title={formData.title}
                  genre={formData.genre}
                  coverUrl={formData.coverUrl}
                  placeholderTitle="Título do livro"
                />
                <PreviewInfo $empty={!formData.author}>
                  <p>{formData.author || 'Autor'}</p>
                  <p>Assim ele aparece nas recomendações.</p>
                </PreviewInfo>
              </PreviewCard>
            </PreviewAside>
          </Columns>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
