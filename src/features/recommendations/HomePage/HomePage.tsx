import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppLayout } from '@/layouts/AppLayout';
import { ButtonLink, Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { ToastPill, ToastDetail } from '@/components/Toast';
import { IconAlert, IconArrowRight, IconBook, IconHeart, IconRefresh } from '@/components/Icons';
import { SwipeCard } from './SwipeCard';
import type { SwipeChoice, CardBook } from './SwipeCard';
import {
  MatchArea,
  Intro,
  Eyebrow,
  Headline,
  Helper,
  Recommendation,
  Stack,
  GhostCard,
  LoadingCard,
  Actions,
  ActionButton,
  ActionCircle,
  HeartBeat,
  FeedbackArea,
  Hint,
} from './styles';
import { useLikedCount } from '@/lib/likedCount';
import { likedBooksApi } from '@/lib/api/likedBooks';
import { recommendationsApi } from '@/lib/api/recommendations';
import { getSessionUser } from '@/lib/session';
import { colors, genreColors } from '@/styles/tokens';
import { toastAnimation, appear } from '@/styles/motion';
import { paths } from '@/app/paths';

const NOTICE_DURATION = 3500;

interface Notice {
  type: SwipeChoice | 'error';
  title: string;
  text: string;
  id: number;
}

export default function HomePage() {
  const { add } = useLikedCount();
  const [user] = useState(() => getSessionUser());
  const [currentBook, setCurrentBook] = useState<CardBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<'empty' | 'failed' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  // Side the card leaves through: 1 is right (Amei), -1 is left (Próximo).
  const [direction, setDirection] = useState(1);
  const [beats, setBeats] = useState(0);
  const [decisions, setDecisions] = useState(0);

  const loadNextRecommendation = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setLoadError(null);

    const response = await recommendationsApi.getAdaptive(user.id);

    if (response.success && response.data?.length > 0) {
      // The API returns a list; we show its first book.
      setCurrentBook(response.data[0]);
    } else {
      setCurrentBook(null);
      setLoadError(response.success ? 'empty' : 'failed');
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadNextRecommendation();
  }, [loadNextRecommendation]);

  // The notice goes away by itself; a new notice restarts the countdown.
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), NOTICE_DURATION);
    return () => clearTimeout(timer);
  }, [notice]);

  // The card leaves right away; if the API fails, it comes back to the stack.
  const decide = async (choice: SwipeChoice) => {
    if (!currentBook || !user?.id || isProcessing) return;
    const book = currentBook;
    const loved = choice === 'love';

    setDirection(loved ? 1 : -1);
    setDecisions((n) => n + 1);
    if (loved) setBeats((n) => n + 1);
    setIsProcessing(true);
    setCurrentBook(null);

    if (loved) {
      const acceptResponse = await recommendationsApi.accept(user.id, book.id);
      if (acceptResponse.success) {
        // Accepting teaches the algorithm; liking stores the book in "Meus livros".
        const likeResponse = await likedBooksApi.like(user.id, book.id);
        if (likeResponse.success) {
          add(1);
        } else {
          console.warn('Livro aceito, mas não foi salvo como curtido:', likeResponse.error);
        }
        setNotice({
          type: 'love',
          title: 'Foi pros seus livros.',
          text: `“${book.titulo}” está nos favoritos.`,
          id: Date.now(),
        });
        await loadNextRecommendation();
      } else {
        setCurrentBook(book);
        setNotice({
          type: 'error',
          title: 'Não deu para salvar.',
          text: 'Tente de novo.',
          id: Date.now(),
        });
      }
    } else {
      const response = await recommendationsApi.reject(user.id, book.id);
      if (response.success) {
        const { algoritmoAlterado, sugestao } = response.data || {};
        setNotice({
          type: 'next',
          title: 'Anotado.',
          text: algoritmoAlterado && sugestao ? sugestao : 'Bora tentar outro.',
          id: Date.now(),
        });
        await loadNextRecommendation();
      } else {
        setCurrentBook(book);
        setNotice({
          type: 'error',
          title: 'Não deu para registrar.',
          text: 'Tente de novo.',
          id: Date.now(),
        });
      }
    }

    setIsProcessing(false);
  };

  // Arrow keys: right is Amei, left is Próximo.
  const decideRef = useRef(decide);
  useEffect(() => {
    decideRef.current = decide;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if ((event.target as Element).closest?.('input, textarea, select, [role="dialog"]')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        decideRef.current('love');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        decideRef.current('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const bookColors = currentBook ? genreColors(currentBook.genero) : null;
  const background = bookColors ? bookColors.background : colors.brandBackground;
  const accent = bookColors ? bookColors.cover : colors.brand;
  const firstName = user?.nome?.trim().split(' ')[0];
  const noCard = !currentBook || loading;

  return (
    <AppLayout background={background} accentColor={accent}>
      <MatchArea>
        <Intro>
          <Eyebrow $color={accent} {...appear(0)}>
            {firstName ? `Para você, ${firstName}` : 'Para você'}
          </Eyebrow>
          <Headline {...appear(1)}>Achei um pra você.</Headline>
          <Helper {...appear(2)}>
            Amei guarda o livro nos seus favoritos. Próximo ensina ao Matchbook o que não é a sua.
          </Helper>
        </Intro>

        <Recommendation aria-label="Recomendação">
          {loadError === 'empty' && (
            <EmptyState
              icon={<IconBook size={28} />}
              title="Você viu tudo por enquanto"
              description="Adicione um livro ao catálogo ou volte mais tarde."
            >
              <ButtonLink to={paths.addBook}>Adicionar livro</ButtonLink>
              <ButtonLink to={paths.myBooks} $variant="secondary">
                Ver meus livros
              </ButtonLink>
            </EmptyState>
          )}

          {loadError === 'failed' && (
            <EmptyState
              icon={<IconAlert size={28} />}
              tone="error"
              title="Não deu para buscar um livro"
              description="Confira sua conexão e tente de novo."
            >
              <Button onClick={loadNextRecommendation}>
                <IconRefresh size={16} />
                Tentar de novo
              </Button>
            </EmptyState>
          )}

          {!loadError && (
            <>
              <Stack>
                <GhostCard
                  aria-hidden="true"
                  $opacity={0.5}
                  $transform="rotate(-5deg) translate(-18px, 14px)"
                />
                <GhostCard
                  aria-hidden="true"
                  $opacity={0.75}
                  $transform="rotate(3.5deg) translate(16px, 6px)"
                />
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  {noCard ? (
                    <LoadingCard
                      key="loading"
                      role="status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.2 } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      <Spinner size={40} color={accent} />
                      Buscando um livro pra você
                    </LoadingCard>
                  ) : (
                    <SwipeCard
                      key={currentBook.id}
                      book={currentBook}
                      // With the card on screen there is a book, and with a book there are colors.
                      bookColors={bookColors!}
                      disabled={isProcessing}
                      onDecide={decide}
                    />
                  )}
                </AnimatePresence>
              </Stack>

              <Actions>
                <ActionButton
                  onClick={() => decide('next')}
                  disabled={isProcessing || noCard}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ActionCircle $color={colors.white}>
                    <IconArrowRight size={24} />
                  </ActionCircle>
                  Próximo
                </ActionButton>
                <ActionButton
                  $primary
                  onClick={() => decide('love')}
                  disabled={isProcessing || noCard}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ActionCircle $primary $color={accent}>
                    <HeartBeat
                      key={beats}
                      initial={beats ? { scale: 1.5 } : false}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                    >
                      <IconHeart size={36} />
                    </HeartBeat>
                  </ActionCircle>
                  Amei
                </ActionButton>
              </Actions>
            </>
          )}

          <FeedbackArea aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {notice ? (
                <ToastPill key={notice.id} $tone="light" {...toastAnimation}>
                  {notice.type === 'love' && <IconHeart size={18} style={{ color: accent }} />}
                  {notice.type === 'next' && <IconArrowRight size={18} />}
                  {notice.type === 'error' && (
                    <IconAlert size={18} style={{ color: colors.error }} />
                  )}
                  <span>
                    <strong>{notice.title}</strong> <ToastDetail>{notice.text}</ToastDetail>
                  </span>
                </ToastPill>
              ) : (
                !loadError &&
                decisions === 0 && (
                  <Hint
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>Dica: arraste a carta ou use as setas ← e → do teclado.</span>
                    <span>Dica: arraste a carta para os lados.</span>
                  </Hint>
                )
              )}
            </AnimatePresence>
          </FeedbackArea>
        </Recommendation>
      </MatchArea>
    </AppLayout>
  );
}
