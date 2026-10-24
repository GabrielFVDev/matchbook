import type { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { colors, mobile } from '@/styles/tokens';
import { appear } from '@/styles/motion';

export const StatGrid = styled.dl<{ $min?: number; $mobileColumns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(${({ $min = 220 }) => $min}px, 100%), 1fr));
  gap: 16px;

  ${mobile} {
    grid-template-columns: repeat(${({ $mobileColumns = 2 }) => $mobileColumns}, minmax(0, 1fr));
    gap: 10px;
  }
`;

const Tile = styled(motion.div)<{ $background?: string; $color?: string; $isText?: boolean }>`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  gap: 4px;
  padding: 20px 22px;
  border-radius: 20px;
  background: ${({ $background }) => $background || colors.white};

  dt {
    font-size: 14px;
    color: ${({ $background }) => ($background ? colors.ink : colors.inkSoft)};
  }

  dd {
    font-size: ${({ $isText }) => ($isText ? '28px' : '38px')};
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ $color }) => $color || colors.ink};
    overflow-wrap: anywhere;
  }

  ${mobile} {
    padding: 14px 16px;
    border-radius: 18px;

    dt {
      font-size: 13px;
    }

    dd {
      font-size: ${({ $isText }) => ($isText ? '20px' : '28px')};
    }
  }
`;

// Número de destaque com o rótulo embaixo. Vai dentro de um StatGrid (dl).
// "order" faz os números entrarem em sequência.
interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  background?: string;
  color?: string;
  isText?: boolean;
  order?: number;
}

export function StatTile({ label, value, background, color, isText, order }: StatTileProps) {
  return (
    <Tile
      $background={background}
      $color={color}
      $isText={isText}
      {...(order !== undefined ? appear(order) : {})}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </Tile>
  );
}
