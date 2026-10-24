import { createContext, useContext } from 'react';

export interface CurtidosValor {
  // null enquanto o contador ainda não chegou da API.
  total: number | null;
  carregar: () => void;
  somar: (quantidade: number) => void;
  definir: (valor: number | null) => void;
}

// Contador de livros curtidos mostrado no cabeçalho de todas as telas.
export const CurtidosContext = createContext<CurtidosValor>({
  total: null,
  carregar: () => {},
  somar: () => {},
  definir: () => {},
});

export const useCurtidos = () => useContext(CurtidosContext);
