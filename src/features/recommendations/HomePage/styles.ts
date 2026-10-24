import styled from 'styled-components';
import { motion } from 'motion/react';
import { colors, mobile, radius, shadow } from '@/styles/tokens';

export const MatchArea = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 80px;

  ${mobile} {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: flex-start;
    gap: 14px;
  }
`;

export const Intro = styled.div`
  flex: 1 1 300px;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  ${mobile} {
    flex: 0 0 auto;
    max-width: none;
  }
`;

export const Eyebrow = styled(motion.p)<{ $color: string }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  transition: color 0.4s ease;
`;

export const Headline = styled(motion.h1)`
  font-size: 36px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;

  ${mobile} {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;

export const Helper = styled(motion.p)`
  font-size: 17px;
  line-height: 1.5;
  color: ${colors.inkSoft};
  text-wrap: pretty;

  ${mobile} {
    display: none;
  }
`;

export const Recommendation = styled.section`
  flex: 0 0 420px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 28px;

  ${mobile} {
    flex: 0 0 auto;
    gap: 18px;
  }
`;

// Minimum height so the cards behind do not shrink between one card and the next.
export const Stack = styled.div`
  position: relative;
  width: 100%;
  min-height: 480px;

  ${mobile} {
    min-height: 380px;
  }
`;

export const GhostCard = styled.div<{ $opacity: number; $transform: string }>`
  position: absolute;
  inset: 0;
  border-radius: ${radius.matchCard};
  background: ${colors.white};
  opacity: ${({ $opacity }) => $opacity};
  transform: ${({ $transform }) => $transform};

  ${mobile} {
    border-radius: 26px;
  }
`;

export const BookCard = styled(motion.article)`
  position: relative;
  z-index: 1;
  min-height: 300px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 14px;
  border-radius: ${radius.matchCard};
  background: ${colors.white};
  box-shadow: ${shadow.matchCard};

  ${mobile} {
    gap: 14px;
    padding: 12px;
    border-radius: 26px;
  }
`;

export const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px 10px;

  ${mobile} {
    gap: 8px;
    padding: 0 6px 6px;
  }
`;

export const BookAuthor = styled.p`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;

  ${mobile} {
    font-size: 19px;
  }
`;

export const MetaList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Synopsis = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: ${colors.inkSoft};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${mobile} {
    font-size: 14px;
    -webkit-line-clamp: 2;
  }
`;

// Stamp that shows in the middle of the cover while the card is dragged.
export const Stamp = styled(motion.span)<{ $color?: string; $side: 'left' | 'right' }>`
  position: absolute;
  top: 140px;
  left: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: ${radius.pill};
  background: ${colors.white};
  color: ${({ $color }) => $color || colors.ink};
  font-size: 22px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: ${shadow.love};
  transform: translateX(-50%) rotate(${({ $side }) => ($side === 'left' ? '-8deg' : '8deg')});
  pointer-events: none;

  ${mobile} {
    top: 100px;
    font-size: 19px;
    padding: 8px 16px;
  }
`;

// Height close to the finished card's, so the screen does not jump while loading.
export const LoadingCard = styled(motion.div)`
  position: relative;
  z-index: 1;
  border-radius: ${radius.matchCard};
  background: ${colors.white};
  box-shadow: ${shadow.matchCard};
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  color: ${colors.ink};
  font-size: 17px;
  font-weight: 700;

  ${mobile} {
    min-height: 400px;
    border-radius: 26px;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 40px;
`;

export const ActionButton = styled(motion.button).attrs({ type: 'button' })<{
  $primary?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $primary }) => ($primary ? colors.ink : colors.inkSoft)};
  font-size: ${({ $primary }) => ($primary ? '16px' : '14px')};
  font-weight: ${({ $primary }) => ($primary ? 800 : 500)};

  &:disabled {
    opacity: 0.5;
  }

  ${mobile} {
    gap: 6px;
    font-size: ${({ $primary }) => ($primary ? '15px' : '13px')};
  }
`;

export const ActionCircle = styled.span<{ $primary?: boolean; $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $primary }) => ($primary ? 92 : 60)}px;
  height: ${({ $primary }) => ($primary ? 92 : 60)}px;
  border-radius: ${radius.pill};
  background: ${({ $color }) => $color};
  color: ${({ $primary }) => ($primary ? colors.white : colors.ink)};
  box-shadow: ${({ $primary }) => ($primary ? shadow.love : shadow.whiteButton)};
  transition: background-color 0.4s ease;

  ${mobile} {
    width: ${({ $primary }) => ($primary ? 80 : 56)}px;
    height: ${({ $primary }) => ($primary ? 80 : 56)}px;
  }
`;

export const FeedbackArea = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const Hint = styled(motion.p)`
  font-size: 14px;
  color: ${colors.inkSoft};
  text-align: center;

  span:last-child {
    display: none;
  }

  ${mobile} {
    font-size: 13px;

    span:first-child {
      display: none;
    }

    span:last-child {
      display: inline;
    }
  }
`;

// Heart of the Amei button: it beats once per Amei.
export const HeartBeat = styled(motion.span)`
  display: flex;
`;
