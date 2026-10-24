import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { recomendacaoService } from '@/lib/api/services';
import { getSessionUser } from '@/lib/session';
import { CurtidosContext } from './likedCount';

export function CurtidosProvider({ children }: { children: ReactNode }) {
  const [total, setTotal] = useState<number | null>(null);
  const usuarioCarregado = useRef<number | null>(null);

  // Busca o contador uma vez por usuário; trocar de conta busca de novo.
  const carregar = useCallback(async () => {
    const usuario = getSessionUser();
    if (!usuario?.id || usuarioCarregado.current === usuario.id) return;
    usuarioCarregado.current = usuario.id;
    const resposta = await recomendacaoService.contarLivrosCurtidos(usuario.id);
    setTotal(resposta.success ? (resposta.data?.total ?? 0) : 0);
  }, []);

  const somar = useCallback((quantidade: number) => {
    setTotal((atual) => Math.max(0, (atual ?? 0) + quantidade));
  }, []);

  const definir = useCallback((valor: number | null) => setTotal(valor), []);

  const valor = useMemo(
    () => ({ total, carregar, somar, definir }),
    [total, carregar, somar, definir],
  );

  return <CurtidosContext.Provider value={valor}>{children}</CurtidosContext.Provider>;
}
