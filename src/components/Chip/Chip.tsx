import styled from 'styled-components';
import { colors, radius } from '@/styles/tokens';

interface ChipProps {
  $active?: boolean;
  $background?: string;
}

// Clickable tag (filters and genre choice). The state goes in aria-pressed.
export const Chip = styled.button.attrs<ChipProps>(({ $active }) => ({
  type: 'button',
  'aria-pressed': Boolean($active),
}))<ChipProps>`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: ${radius.pill};
  background: ${({ $active, $background }) => ($active ? colors.ink : $background || colors.white)};
  color: ${({ $active }) => ($active ? colors.white : colors.ink)};
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.12s ease;

  &:active {
    transform: scale(0.96);
  }
`;

export const ChipCount = styled.span<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? colors.inkOnDark : colors.inkSoft)};
`;

// Read-only tag (genre, pages, year).
export const Tag = styled.span<{ $small?: boolean; $background?: string; $color?: string }>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: ${({ $small }) => ($small ? '4px 10px' : '5px 12px')};
  border-radius: ${radius.pill};
  background: ${({ $background }) => $background || colors.white};
  color: ${({ $color }) => $color || colors.ink};
  font-size: ${({ $small }) => ($small ? '12px' : '13px')};
  font-weight: 700;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
