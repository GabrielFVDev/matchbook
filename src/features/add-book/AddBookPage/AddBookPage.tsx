import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { likedBooksApi } from '@/lib/api/likedBooks';
import { getSessionUser } from '@/lib/session';
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
  titulo: '',
  autor: '',
  editora: '',
  genero: '',
  anoPublicacao: '',
  numeroPaginas: '',
  idioma: 'Português',
  isbn: '',
  sinopse: '',
  capaUrl: '',
  disponivel: true,
};

type BookForm = typeof emptyForm;

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
  const navigate = useNavigate();
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

    if (!formData.titulo.trim()) newErrors.titulo = 'Informe o título';
    if (!formData.autor.trim()) newErrors.autor = 'Informe o autor';
    if (!formData.genero) newErrors.genero = 'Escolha um gênero';

    if (!formData.sinopse.trim()) {
      newErrors.sinopse = 'Escreva a sinopse';
    } else if (formData.sinopse.length < 50) {
      newErrors.sinopse = 'Escreva pelo menos 50 caracteres';
    }

    if (
      formData.anoPublicacao &&
      (Number(formData.anoPublicacao) < 1000 || Number(formData.anoPublicacao) > maxYear)
    ) {
      newErrors.anoPublicacao = `Use um ano entre 1000 e ${maxYear}`;
    }

    if (
      formData.numeroPaginas &&
      (Number(formData.numeroPaginas) < 1 || Number(formData.numeroPaginas) > 10000)
    ) {
      newErrors.numeroPaginas = 'Use um número entre 1 e 10.000';
    }

    if (formData.capaUrl && !isValidUrl(formData.capaUrl)) {
      newErrors.capaUrl = 'Esse link não parece válido, ele começa com https://';
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

    const user = getSessionUser();
    if (!user) {
      navigate(paths.login);
      return;
    }

    setLoading(true);

    const bookData = {
      ...formData,
      anoPublicacao: formData.anoPublicacao ? parseInt(formData.anoPublicacao) : null,
      numeroPaginas: formData.numeroPaginas ? parseInt(formData.numeroPaginas) : null,
      capaUrl: formData.capaUrl || null,
    };

    const response = await booksApi.create(bookData);

    if (response.success) {
      // Quem adiciona um livro ao catálogo já o leva para os seus favoritos.
      const likeResponse = await likedBooksApi.like(user.id, response.data.id);
      if (likeResponse.success) {
        add(1);
      } else {
        console.warn('Erro ao adicionar aos favoritos:', likeResponse.error);
      }
      setResult({ title: formData.titulo, inFavorites: likeResponse.success });
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

  const synopsisCount = `${formData.sinopse.length} de 1000`;

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
                title={formData.titulo}
                genre={formData.genero}
                coverUrl={formData.capaUrl}
                placeholderTitle="Título do livro"
              />
              <MobilePreviewText $empty={!formData.autor}>
                <p>Prévia</p>
                {formData.genero && (
                  <Tag $background={colors.appBackground} $small>
                    {formData.genero}
                  </Tag>
                )}
                <p>{formData.autor || 'Autor'}</p>
              </MobilePreviewText>
            </MobilePreview>

            <FormContainer onSubmit={handleSubmit} noValidate>
              <FormSection aria-labelledby="aboutSection" {...appear(0)}>
                <SectionTitle id="aboutSection">Sobre o livro</SectionTitle>
                <FieldsGrid>
                  <Field id="titulo" label="Título" tag="obrigatório" error={errors.titulo} span>
                    <Input
                      name="titulo"
                      type="text"
                      maxLength={255}
                      placeholder="Como está na capa"
                      value={formData.titulo}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="autor" label="Autor" tag="obrigatório" error={errors.autor}>
                    <Input
                      name="autor"
                      type="text"
                      maxLength={255}
                      placeholder="Nome de quem escreveu"
                      value={formData.autor}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="genero" label="Gênero" tag="obrigatório" error={errors.genero}>
                    <Select name="genero" value={formData.genero} onChange={handleInputChange}>
                      <option value="">Escolha um gênero</option>
                      {genreList.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field id="editora" label="Editora">
                    <Input
                      name="editora"
                      type="text"
                      maxLength={255}
                      placeholder="Ex.: Companhia das Letras"
                      value={formData.editora}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="idioma" label="Idioma">
                    <Select name="idioma" value={formData.idioma} onChange={handleInputChange}>
                      {languages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    id="anoPublicacao"
                    label="Ano de publicação"
                    error={errors.anoPublicacao}
                    data-half
                  >
                    <Input
                      name="anoPublicacao"
                      type="number"
                      inputMode="numeric"
                      min="1000"
                      max={maxYear}
                      placeholder="Ex.: 1951"
                      value={formData.anoPublicacao}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field
                    id="numeroPaginas"
                    label="Número de páginas"
                    error={errors.numeroPaginas}
                    data-half
                  >
                    <Input
                      name="numeroPaginas"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="10000"
                      placeholder="Ex.: 320"
                      value={formData.numeroPaginas}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field id="isbn" label="ISBN" span>
                    <Input
                      name="isbn"
                      type="text"
                      maxLength={20}
                      placeholder="Os números do código de barras"
                      value={formData.isbn}
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
                <Field
                  id="sinopse"
                  label="Do que o livro trata"
                  tag="obrigatório"
                  error={errors.sinopse}
                  help="Mínimo de 50 caracteres"
                >
                  <TextArea
                    name="sinopse"
                    rows={5}
                    maxLength={1000}
                    placeholder="Em poucas linhas"
                    value={formData.sinopse}
                    onChange={handleInputChange}
                  />
                </Field>
              </FormSection>

              <FormSection aria-labelledby="coverSection" {...appear(2)}>
                <SectionTitle id="coverSection">Capa</SectionTitle>
                <Field
                  id="capaUrl"
                  label="Link da imagem"
                  error={errors.capaUrl}
                  help="Sem link, o Matchbook monta uma capa com a cor do gênero."
                >
                  <Input
                    name="capaUrl"
                    type="url"
                    placeholder="https://"
                    value={formData.capaUrl}
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
                  title={formData.titulo}
                  genre={formData.genero}
                  coverUrl={formData.capaUrl}
                  placeholderTitle="Título do livro"
                />
                <PreviewInfo $empty={!formData.autor}>
                  <p>{formData.autor || 'Autor'}</p>
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
