import { createContext, useContext } from 'react';

export interface AparenciaShell {
  fundo: string;
  corDestaque: string;
}

// Cada tela informa ao shell a cor de fundo e a cor de destaque que quer.
export const ShellContext = createContext<(aparencia: AparenciaShell) => void>(() => {});

export const useDefinirShell = () => useContext(ShellContext);
