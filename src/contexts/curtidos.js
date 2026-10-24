import { createContext, useContext } from 'react';

// Contador de livros curtidos mostrado no cabeçalho de todas as telas.
export const CurtidosContext = createContext({
  total: null,
  carregar: () => {},
  somar: () => {},
  definir: () => {},
});

export const useCurtidos = () => useContext(CurtidosContext);
