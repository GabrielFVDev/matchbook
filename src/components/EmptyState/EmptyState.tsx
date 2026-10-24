import type { AriaRole, ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { colors, mobile } from '@/styles/tokens';
import { enterEase } from '@/styles/motion';

const tones = {
  brand: { background: colors.brandBackground, color: colors.brand },
  error: { background: colors.errorBackground, color: colors.error },
  success: { background: colors.successBackground, color: colors.success },
};

type Tone = keyof typeof tones;

const Box = styled(motion.div)<{ $background?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 64px 24px;
  border-radius: 28px;
  background: ${({ $background }) => $background || colors.white};
  text-align: center;

  ${mobile} {
    padding: 44px 20px;
    border-radius: 24px;
  }
`;

const IconWrap = styled(motion.span)<{ $tone: Tone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: ${({ $tone }) => tones[$tone].background};
  color: ${({ $tone }) => tones[$tone].color};
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;

  ${mobile} {
    font-size: 22px;
  }
`;

const Description = styled.p`
  max-width: 420px;
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.inkSoft};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
`;

// Block for an empty, error or success screen: icon, title, text and actions.
interface EmptyStateProps {
  icon?: ReactNode;
  tone?: Tone;
  title: ReactNode;
  description?: ReactNode;
  background?: string;
  children?: ReactNode;
  role?: AriaRole;
}

export function EmptyState({
  icon,
  tone = 'brand',
  title,
  description,
  background,
  children,
  role,
}: EmptyStateProps) {
  return (
    <Box
      $background={background}
      role={role}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: enterEase }}
    >
      {icon && (
        <IconWrap
          $tone={tone}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.1 }}
        >
          {icon}
        </IconWrap>
      )}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {children && <Actions>{children}</Actions>}
    </Box>
  );
}
