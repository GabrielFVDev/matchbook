import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { AppLayout } from '@/layouts/AppLayout';
import { BookCover } from '@/components/BookCover';
import { ChipCount } from '@/components/Chip';
import { ButtonLink, Button } from '@/components/Button';
import { StatGrid, StatTile } from '@/components/StatTile';
import { EmptyState } from '@/components/EmptyState';
import { Toast } from '@/components/Toast';
import { Spinner } from '@/components/Spinner';
import { IconAlert, IconHeart, IconPlus, IconRefresh, IconTrash } from '@/components/Icons';
import {
  PageHeading,
  TitleBlock,
  PageTitle,
  PageSubtitle,
  HeadingActions,
  FilterContainer,
  FilterChip,
  FilterPill,
  FilterLabel,
  BooksGrid,
  BookCard,
  BookCardInner,
  RemoveButton,
  BookInfo,
  BookAuthor,
  BookDetail,
  LoadingContainer,
} from './styles';
import type { ListNotice } from './types';
import { useLikedCount } from '@/lib/likedCount';
import { likedBooksApi } from '@/lib/api/likedBooks';
import { recommendationsApi } from '@/lib/api/recommendations';
import type { BookDto } from '@/lib/api/types';
import { colors, genreColors } from '@/styles/tokens';
import { exitEase, spring, softSpring } from '@/styles/motion';
import { paths } from '@/app/paths';

// Books enter in sequence, leave shrinking, and the rest of the grid reorders.
const itemVariants: Variants = {
  enter: { opacity: 0, y: 16, scale: 0.96 },
  idle: (order: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...softSpring, delay: Math.min(order * 0.04, 0.32) },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: exitEase } },
};

export default function MyBooksPage() {
  const { add } = useLikedCount();
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState('Todos');
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<ListNotice | null>(null);

  const loadLikedBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    // The backend already sends them from the most recent to the oldest.
    const response = await likedBooksApi.list();

    if (response.success) {
      setBooks(response.data);
    } else {
      setError(response.error || 'Erro ao carregar seus livros.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLikedBooks();
  }, [loadLikedBooks]);

  const closeNotice = useCallback(() => setNotice(null), []);

  const handleRemoveBook = async (book: BookDto) => {
    const position = books.findIndex((item) => item.id === book.id);
    setRemovingId(book.id);

    const response = await likedBooksApi.unlike(book.id);

    if (response.success) {
      setBooks((current) => current.filter((item) => item.id !== book.id));
      add(-1);
      setNotice({ type: 'removed', book, position, id: Date.now() });
    } else {
      setNotice({ type: 'error', message: 'Não deu para remover agora.', id: Date.now() });
    }
    setRemovingId(null);
  };

  const undoRemoval = async () => {
    if (notice?.type !== 'removed') return;
    const { book, position } = notice;
    setNotice(null);

    // Liking again is accepting the book again.
    const response = await recommendationsApi.accept(book.id);

    if (response.success) {
      setBooks((current) => {
        const list = [...current];
        list.splice(Math.min(position, list.length), 0, book);
        return list;
      });
      add(1);
    } else {
      setNotice({ type: 'error', message: 'Não deu para desfazer.', id: Date.now() });
    }
  };

  const countByGenre = books.reduce<Record<string, number>>((total, book) => {
    total[book.genre] = (total[book.genre] || 0) + 1;
    return total;
  }, {});
  const likedGenres = Object.keys(countByGenre);
  const activeFilter =
    genreFilter !== 'Todos' && !countByGenre[genreFilter] ? 'Todos' : genreFilter;
  const filteredBooks =
    activeFilter === 'Todos' ? books : books.filter((book) => book.genre === activeFilter);

  const totalPages = books.reduce((total, book) => total + (Number(book.pageCount) || 0), 0);
  const topGenre = likedGenres.reduce<string | null>(
    (top, genre) =>
      countByGenre[genre] > ((top !== null && countByGenre[top]) || 0) ? genre : top,
    null,
  );
  const topGenreColors = topGenre ? genreColors(topGenre) : null;

  return (
    <AppLayout>
      <PageHeading>
        <TitleBlock>
          <PageTitle>Meus livros</PageTitle>
          <PageSubtitle>Os livros que você amou, do mais recente ao mais antigo.</PageSubtitle>
        </TitleBlock>
        <HeadingActions>
          <ButtonLink to={paths.addBook} $variant="white">
            <IconPlus size={17} />
            Adicionar livro
          </ButtonLink>
          <ButtonLink to={paths.home}>
            <IconHeart size={17} />
            Descobrir livros
          </ButtonLink>
        </HeadingActions>
      </PageHeading>

      {loading && (
        <LoadingContainer role="status">
          <Spinner size={36} color={colors.brand} />
          Carregando seus livros
        </LoadingContainer>
      )}

      {!loading && error && (
        <EmptyState
          icon={<IconAlert size={28} />}
          tone="error"
          title="Não deu para carregar seus livros"
          description="Confira sua conexão e tente de novo."
        >
          <Button onClick={loadLikedBooks}>
            <IconRefresh size={16} />
            Tentar de novo
          </Button>
        </EmptyState>
      )}

      {!loading && !error && books.length === 0 && (
        <EmptyState
          icon={<IconHeart size={30} />}
          title="Nenhum livro por aqui ainda"
          description="Dê Amei nas recomendações e os livros aparecem aqui."
        >
          <ButtonLink to={paths.home}>Descobrir livros</ButtonLink>
          <ButtonLink to={paths.addBook} $variant="secondary">
            Adicionar livro
          </ButtonLink>
        </EmptyState>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <StatGrid>
            <StatTile order={0} label="Livros curtidos" value={books.length} />
            <StatTile
              order={1}
              label="Páginas no total"
              value={totalPages.toLocaleString('pt-BR')}
            />
            <StatTile order={2} label="Gêneros diferentes" value={likedGenres.length} />
            {topGenre && (
              <StatTile
                order={3}
                label="Gênero mais curtido"
                value={topGenre}
                background={topGenreColors?.background}
                color={topGenreColors?.cover}
                isText
              />
            )}
          </StatGrid>

          {likedGenres.length > 1 && (
            <FilterContainer role="group" aria-label="Filtrar por gênero">
              {['Todos', ...likedGenres].map((genre) => {
                const active = genre === activeFilter;
                return (
                  <FilterChip
                    key={genre}
                    $active={active}
                    aria-pressed={active}
                    onClick={() => setGenreFilter(genre)}
                  >
                    {active && <FilterPill layoutId="activeFilter" transition={spring} />}
                    <FilterLabel>
                      {genre}
                      <ChipCount $active={active}>
                        {genre === 'Todos' ? books.length : countByGenre[genre]}
                      </ChipCount>
                    </FilterLabel>
                  </FilterChip>
                );
              })}
            </FilterContainer>
          )}

          <BooksGrid>
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book, order) => (
                <BookCard
                  key={book.id}
                  layout
                  custom={order}
                  variants={itemVariants}
                  initial="enter"
                  animate="idle"
                  exit="exit"
                >
                  <BookCardInner>
                    <BookCover
                      title={book.title}
                      genre={book.genre}
                      coverUrl={book.coverUrl}
                      size="grid"
                    >
                      <RemoveButton
                        aria-label={`Remover ${book.title} dos favoritos`}
                        onClick={() => handleRemoveBook(book)}
                        disabled={removingId === book.id}
                      >
                        <span>
                          {removingId === book.id ? <Spinner size={16} /> : <IconTrash size={17} />}
                        </span>
                      </RemoveButton>
                    </BookCover>
                    <BookInfo>
                      <BookAuthor>{book.author}</BookAuthor>
                      <BookDetail>{book.pageCount ? `${book.pageCount} páginas` : ''}</BookDetail>
                    </BookInfo>
                  </BookCardInner>
                </BookCard>
              ))}
            </AnimatePresence>
          </BooksGrid>
        </>
      )}

      <AnimatePresence>
        {notice && (
          <Toast
            key={notice.id}
            resetKey={notice.id}
            onClose={closeNotice}
            duration={notice.type === 'removed' ? 6000 : 4000}
            action={
              notice.type === 'removed' ? { label: 'Desfazer', onClick: undoRemoval } : undefined
            }
          >
            {notice.type === 'removed' ? (
              <>
                <strong>{notice.book.title}</strong> saiu dos seus livros.
              </>
            ) : (
              notice.message
            )}
          </Toast>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
