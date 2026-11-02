import { createContext, useContext } from 'react';
import type { ShellAppearance } from './types';

// Each screen tells the shell the background color and the accent color it wants.
export const ShellContext = createContext<(appearance: ShellAppearance) => void>(() => {});

export const useSetShell = () => useContext(ShellContext);
