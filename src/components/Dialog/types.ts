import type { ReactNode } from 'react';
import type { ButtonVariant } from '@/components/Button';

export interface DialogProps {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  width?: number;
  children: ReactNode;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  confirmLabel: ReactNode;
  loadingLabel?: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}
