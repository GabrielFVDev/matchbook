import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppLayout } from '@/layouts/AppLayout';
import { ButtonLink, Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/Spinner';
import { ToastPill, ToastDetail } from '@/components/Toast';
import { IconAlert, IconArrowRight, IconBook, IconHeart, IconRefresh } from '@/components/Icons';
import { SwipeCard } from './SwipeCard';
import type { Notice, SwipeChoice } from './types';
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
import { recommendationsApi } from '@/lib/api/recommendations';
import type { BookDto } from '@/lib/api/types';
import { useSessionUser } from '@/lib/session';
import { colors, genreColors } from '@/styles/tokens';
import { toastAnimation, appear } from '@/styles/motion';
import { paths } from '@/app/paths';

const NOTICE_DURATION = 3500;

export default function HomePage() {
  const { add } = useLikedCount();
  const user = useSessionUser();
  const [currentBook, setCurrentBook] = useState<BookDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<'empty' | 'failed' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [direction, setDirection] = useState(1);
  const [beats, setBeats] = useState(0);
  const [decisions, setDecisions] = useState(0);

  const loadNextRecommendation = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const response = await recommendationsApi.getAdaptive();

    if (response.success && response.data?.length > 0) {
      setCurrentBook(response.data[0]);
    } else {
      setCurrentBook(null);
      setLoadError(response.success ? 'empty' : 'failed');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNextRecommendation();
  }, [loadNextRecommendation]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), NOTICE_DURATION);
    return () => clearTimeout(timer);
  }, [notice]);

  const decide = async (choice: SwipeChoice) => {
    if (!currentBook || isProcessing) return;
    const book = currentBook;
    const loved = choice === 'love';

    setDirection(loved ? 1 : -1);
    setDecisions((n) => n + 1);
    if (loved) setBeats((n) => n + 1);
    setIsProcessing(true);
    setCurrentBook(null);

    if (loved) {
      const acceptResponse = await recommendationsApi.accept(book.id);
      if (acceptResponse.success) {
        add(1);
        setNotice({
          type: 'love',
          title: 'Foi pros seus livros.',
          text: `“${book.title}” está nos favoritos.`,
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
      const response = await recommendationsApi.reject(book.id);
      if (response.success) {
        const { algorithmChanged, suggestion } = response.data || {};
        setNotice({
          type: 'next',
          title: 'Anotado.',
          text: algorithmChanged && suggestion ? suggestion : 'Bora tentar outro.',
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

  const bookColors = currentBook ? genreColors(currentBook.genre) : null;
  const background = bookColors ? bookColors.background : colors.brandBackground;
  const accent = bookColors ? bookColors.cover : colors.brand;
  const firstName = user?.name?.trim().split(' ')[0];
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
