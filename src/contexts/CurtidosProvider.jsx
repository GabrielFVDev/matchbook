import { useCallback, useMemo, useRef, useState } from 'react';
import { recomendacaoService } from '../apis/services';
import { CurtidosContext } from './curtidos';

const usuarioAtual = () => {
  const dados = localStorage.getItem('usuario');
  return dados ? JSON.parse(dados) : null;
};

export function CurtidosProvider({ children }) {
  const [total, setTotal] = useState(null);
  const usuarioCarregado = useRef(null);

  // Busca o contador uma vez por usuário; trocar de conta busca de novo.
  const carregar = useCallback(async () => {
    const usuario = usuarioAtual();
    if (!usuario?.id || usuarioCarregado.current === usuario.id) return;
    usuarioCarregado.current = usuario.id;
    const resposta = await recomendacaoService.contarLivrosCurtidos(usuario.id);
    setTotal(resposta.success ? resposta.data?.total ?? 0 : 0);
  }, []);

  const somar = useCallback((quantidade) => {
    setTotal((atual) => Math.max(0, (atual ?? 0) + quantidade));
  }, []);

  const definir = useCallback((valor) => setTotal(valor), []);

  const valor = useMemo(() => ({ total, carregar, somar, definir }), [total, carregar, somar, definir]);

  return <CurtidosContext.Provider value={valor}>{children}</CurtidosContext.Provider>;
}
