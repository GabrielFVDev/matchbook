import { createContext, useContext } from 'react';

export interface ShellAppearance {
  background: string;
  accentColor: string;
}

// Cada tela informa ao shell a cor de fundo e a cor de destaque que quer.
export const ShellContext = createContext<(appearance: ShellAppearance) => void>(() => {});

export const useSetShell = () => useContext(ShellContext);
