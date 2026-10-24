import { useMotionValue, useTransform } from 'motion/react';
import type { PanInfo, Variants } from 'motion/react';
import { BookCover } from '@/components/BookCover';
import { Tag } from '@/components/Chip';
import { IconArrowRight, IconHeart } from '@/components/Icons';
import { BookCard, BookInfo, BookAuthor, MetaList, Synopsis, Stamp } from './styles';
import { exitEase } from '@/styles/motion';
import type { GenreColors } from '@/styles/tokens';
import type { BookDto } from '@/lib/api/types';

// Drag distance (px) or speed (px/s) that counts as a decision.
const DISTANCE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 700;

// Enters rising from the stack; flies off to the side of the decision (1 = right, -1 = left).
const cardVariants: Variants = {
  enter: { opacity: 0, scale: 0.92, y: 24 },
  idle: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
  exit: (direction: number) => ({
    x: direction * 560,
    opacity: 0,
    transition: { duration: 0.32, ease: exitEase },
  }),
};

export type SwipeChoice = 'love' | 'next';

// The card's book. It also reads "capaUrl", which the backend never sends (see LikedBookItem in
// src/lib/api/types.ts); the read stays until the backend phase.
export type CardBook = BookDto & { capaUrl?: string | null };

interface SwipeCardProps {
  book: CardBook;
  bookColors: GenreColors;
  disabled?: boolean;
  onDecide: (choice: SwipeChoice) => void;
}

// Card of the recommended book. It can be dragged: right is Amei, left is Próximo.
export function SwipeCard({ book, bookColors, disabled, onDecide }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-14, 14]);
  const loveOpacity = useTransform(x, [30, 130], [0, 1]);
  const nextOpacity = useTransform(x, [-130, -30], [1, 0]);

  const meta = [
    book.numeroPaginas && `${book.numeroPaginas} páginas`,
    book.anoPublicacao,
    book.editora,
  ].filter((item): item is string | number => Boolean(item));

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > DISTANCE_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD)
      onDecide('love');
    else if (info.offset.x < -DISTANCE_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD)
      onDecide('next');
  };

  return (
    <BookCard
      style={{ x, rotate }}
      drag={disabled ? false : 'x'}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      variants={cardVariants}
      initial="enter"
      animate="idle"
      exit="exit"
    >
      <Stamp
        $side="left"
        $color={bookColors.cover}
        style={{ opacity: loveOpacity }}
        aria-hidden="true"
      >
        <IconHeart size={16} />
        Amei
      </Stamp>
      <Stamp $side="right" style={{ opacity: nextOpacity }} aria-hidden="true">
        Próximo
        <IconArrowRight size={16} />
      </Stamp>
      <BookCover
        size="match"
        title={book.titulo}
        genre={book.genero}
        coverUrl={book.capaUrl || book.capa}
      />
      <BookInfo>
        <BookAuthor>{book.autor}</BookAuthor>
        {meta.length > 0 && (
          <MetaList>
            {meta.map((item) => (
              <li key={item}>
                <Tag $background={bookColors.background}>{item}</Tag>
              </li>
            ))}
          </MetaList>
        )}
        {book.sinopse && <Synopsis>{book.sinopse}</Synopsis>}
      </BookInfo>
    </BookCard>
  );
}
