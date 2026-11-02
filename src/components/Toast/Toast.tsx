import { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'motion/react';
import { colors, mobile, radius, shadow } from '@/styles/tokens';
import { toastAnimation } from '@/styles/motion';
import type { ToastProps, ToastTone } from './types';

const Area = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 24px;
  z-index: 40;
  display: flex;
  justify-content: center;
  pointer-events: none;

  ${mobile} {
    bottom: 96px;
  }
`;

export const ToastPill = styled(motion.div)<{ $tone: ToastTone }>`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 460px;
  border-radius: ${radius.pill};
  font-size: 15px;
  line-height: 1.35;

  ${({ $tone }) =>
    $tone === 'dark'
      ? css`
          padding: 6px 6px 6px 20px;
          background: ${colors.ink};
          color: ${colors.white};
          box-shadow: ${shadow.toast};
        `
      : css`
          padding: 12px 18px;
          background: ${colors.white};
          color: ${colors.ink};
          box-shadow: ${shadow.whiteButton};
        `}

  svg {
    flex: 0 0 auto;
  }

  strong {
    font-weight: 800;
  }

  ${mobile} {
    font-size: 14px;
  }
`;

export const ToastDetail = styled.span`
  color: ${colors.inkSoft};
`;

const ActionButton = styled.button.attrs({ type: 'button' })`
  flex: 0 0 auto;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: ${radius.pill};
  background: ${colors.white};
  color: ${colors.ink};
  font-size: 15px;
  font-weight: 700;
`;

export function Toast({
  children,
  icon,
  action,
  tone = 'dark',
  duration = 4000,
  onClose,
  resetKey,
}: ToastProps) {
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!duration) return undefined;
    const timer = setTimeout(() => closeRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, resetKey]);

  return (
    <Area>
      <ToastPill role="status" $tone={tone} {...toastAnimation}>
        {icon}
        <span>{children}</span>
        {action && <ActionButton onClick={action.onClick}>{action.label}</ActionButton>}
      </ToastPill>
    </Area>
  );
}
