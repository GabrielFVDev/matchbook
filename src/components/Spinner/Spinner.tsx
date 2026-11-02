import styled, { keyframes } from 'styled-components';
import type { SpinnerProps } from './types';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Svg = styled.svg`
  flex: 0 0 auto;
  animation: ${spin} 0.9s linear infinite;
`;

export const Spinner = ({ size = 18, color = 'currentColor' }: SpinnerProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 3a9 9 0 1 1 -9 9" />
  </Svg>
);
