import type { HTMLAttributes, ReactNode } from 'react';

export interface InputStyleProps {
  $invalid?: boolean;
}

// What Field puts on the child control (Input, Select, TextArea, PasswordInput).
export interface InjectedControlProps {
  id?: string;
  $invalid?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  id: string;
  label: ReactNode;
  tag?: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  success?: ReactNode;
  span?: boolean;
  children: ReactNode;
}
