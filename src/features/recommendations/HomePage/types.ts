import type { BookDto } from '@/lib/api/types';
import type { GenreColors } from '@/styles/types';

export type SwipeChoice = 'love' | 'next';

export interface Notice {
  type: SwipeChoice | 'error';
  title: string;
  text: string;
  id: number;
}

export interface SwipeCardProps {
  book: BookDto;
  bookColors: GenreColors;
  disabled?: boolean;
  onDecide: (choice: SwipeChoice) => void;
}
