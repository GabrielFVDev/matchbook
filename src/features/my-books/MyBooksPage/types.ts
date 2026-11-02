import type { BookDto } from '@/lib/api/types';

export type ListNotice =
  | { type: 'removed'; book: BookDto; position: number; id: number }
  | { type: 'error'; message: string; id: number };
