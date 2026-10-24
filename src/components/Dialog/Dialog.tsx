import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'motion/react';
import type { MotionProps } from 'motion/react';
import { colors, mobile, radius } from '@/styles/tokens';
import { exitEase } from '@/styles/motion';
import { Button } from '@/components/Button';
import type { ButtonVariant } from '@/components/Button';
import { IconX } from '@/components/Icons';

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(26, 23, 38, 0.55);
  overflow-y: auto;

  ${mobile} {
    align-items: flex-end;
    padding: 12px;
  }
`;

const Panel = styled(motion.div)<{ $width: number }>`
  width: 100%;
  max-width: ${({ $width }) => $width}px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  padding: 28px;
  border-radius: ${radius.card};
  background: ${colors.white};
  box-shadow: 0 24px 60px rgba(26, 23, 38, 0.35);
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${mobile} {
    max-height: calc(100vh - 24px);
    padding: 24px 20px;
  }
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.015em;
`;

const CloseButton = styled.button.attrs({ type: 'button' })`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin: -8px -8px 0 0;
  border: 0;
  border-radius: ${radius.pill};
  background: ${colors.appBackground};
  color: ${colors.ink};
`;

type MotionAnimation = Pick<MotionProps, 'initial' | 'animate' | 'exit'>;

const backdropAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18, delay: 0.04 } },
} satisfies MotionAnimation;

const panelAnimation = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 32 },
  },
  exit: { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.15, ease: exitEase } },
} satisfies MotionAnimation;

// Janela sobre a tela. Fecha com Esc, clique fora ou no botão de fechar.
interface DialogProps {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  width?: number;
  children: ReactNode;
}

export function Dialog({ open, title, onClose, width = 560, children }: DialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClick={onClose} {...backdropAnimation}>
          <Panel
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            $width={width}
            onClick={(e) => e.stopPropagation()}
            {...panelAnimation}
          >
            <DialogHeader>
              <Title id={titleId}>{title}</Title>
              <CloseButton aria-label="Fechar" onClick={onClose}>
                <IconX size={18} />
              </CloseButton>
            </DialogHeader>
            {children}
          </Panel>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

const AlertIcon = styled.span<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: ${radius.pill};
  background: ${({ $danger }) => ($danger ? colors.errorBackground : colors.brandBackground)};
  color: ${({ $danger }) => ($danger ? colors.error : colors.brand)};
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: ${colors.inkSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;

  > * {
    flex: 1;
  }
`;

interface ConfirmDialogProps {
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
}

// Confirmação de ação sem volta, como excluir a conta.
export function ConfirmDialog({
  open,
  title,
  description,
  icon,
  confirmLabel,
  loadingLabel = 'Excluindo',
  variant = 'dangerStrong',
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} onClose={onCancel} width={400}>
      {icon && <AlertIcon $danger={variant === 'dangerStrong'}>{icon}</AlertIcon>}
      <Description>{description}</Description>
      <Buttons>
        <Button $variant="secondary" onClick={onCancel} autoFocus>
          Cancelar
        </Button>
        <Button $variant={variant} onClick={onConfirm} disabled={loading}>
          {loading ? loadingLabel : confirmLabel}
        </Button>
      </Buttons>
    </Dialog>
  );
}
