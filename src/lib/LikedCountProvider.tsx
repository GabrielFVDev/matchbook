import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { likedBooksApi } from '@/lib/api/likedBooks';
import { getSessionUser } from '@/lib/session';
import { LikedCountContext } from './likedCount';

export function LikedCountProvider({ children }: { children: ReactNode }) {
  const [total, setTotal] = useState<number | null>(null);
  const loadedUserId = useRef<number | null>(null);

  // Fetches the counter once per user; switching accounts fetches again.
  const load = useCallback(async () => {
    const user = getSessionUser();
    if (!user?.id || loadedUserId.current === user.id) return;
    loadedUserId.current = user.id;
    const response = await likedBooksApi.count(user.id);
    setTotal(response.success ? (response.data?.total ?? 0) : 0);
  }, []);

  const add = useCallback((amount: number) => {
    setTotal((current) => Math.max(0, (current ?? 0) + amount));
  }, []);

  const set = useCallback((value: number | null) => setTotal(value), []);

  const value = useMemo(() => ({ total, load, add, set }), [total, load, add, set]);

  return <LikedCountContext.Provider value={value}>{children}</LikedCountContext.Provider>;
}
