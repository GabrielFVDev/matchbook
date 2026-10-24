import { createContext, useContext } from 'react';

// Cada tela informa ao shell a cor de fundo e a cor de destaque que quer.
export const ShellContext = createContext(() => {});

export const useDefinirShell = () => useContext(ShellContext);
