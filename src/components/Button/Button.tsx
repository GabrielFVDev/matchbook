import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, radius } from '@/styles/tokens';

const variants = {
  primary: css`
    background: ${colors.ink};
    color: ${colors.white};
    font-weight: 700;
  `,
  secondary: css`
    background: ${colors.appBackground};
    color: ${colors.ink};
    font-weight: 600;
  `,
  white: css`
    background: ${colors.white};
    color: ${colors.ink};
    font-weight: 600;
  `,
  subtle: css`
    background: transparent;
    color: ${colors.brand};
    font-weight: 700;
  `,
  danger: css`
    background: ${colors.errorBackground};
    color: ${colors.error};
    font-weight: 700;
  `,
  dangerStrong: css`
    background: ${colors.error};
    color: ${colors.white};
    font-weight: 700;
  `,
};

const sizes = {
  large: css`
    min-height: 56px;
    padding: 0 28px;
    font-size: 17px;
  `,
  medium: css`
    min-height: 48px;
    padding: 0 20px;
    font-size: 15px;
  `,
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

interface ButtonStyleProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}

const buttonStyle = css<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: ${radius.pill};
  text-decoration: none;
  line-height: 1.1;
  text-align: center;
  transition:
    transform 0.18s ease,
    opacity 0.15s ease,
    background-color 0.2s ease;
  ${({ $variant = 'primary' }) => variants[$variant]}
  ${({ $size = 'medium' }) => sizes[$size]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-1px);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
    transition-duration: 0.08s;
  }

  &:disabled {
    opacity: 0.4;
  }
`;

export const Button = styled.button.attrs<ButtonStyleProps>(({ type }) => ({
  type: type || 'button',
}))<ButtonStyleProps>`
  ${buttonStyle}
`;

export const ButtonLink = styled(Link)<ButtonStyleProps>`
  ${buttonStyle}
`;
