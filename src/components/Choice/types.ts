import type { ReactNode } from 'react';

export interface SegmentedProps {
  id: string;
  label: ReactNode;
  options: readonly string[];
  value: string;
  onChange: (option: string) => void;
}

export interface StepperProps {
  id: string;
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export interface SwitchProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
