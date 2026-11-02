import { createContext, useContext } from 'react';
import type { ShellAppearance } from './types';

export const ShellContext = createContext<(appearance: ShellAppearance) => void>(() => {});

export const useSetShell = () => useContext(ShellContext);
