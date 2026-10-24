import { createContext, useContext } from 'react';

export interface ShellAppearance {
  background: string;
  accentColor: string;
}

// Each screen tells the shell the background color and the accent color it wants.
export const ShellContext = createContext<(appearance: ShellAppearance) => void>(() => {});

export const useSetShell = () => useContext(ShellContext);
