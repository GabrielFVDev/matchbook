import styled, { keyframes } from 'styled-components';

const girar = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Svg = styled.svg`
  flex: 0 0 auto;
  animation: ${girar} 0.9s linear infinite;
`;

export const Spinner = ({ tamanho = 18, cor = 'currentColor' }) => (
  <Svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cor}
    strokeWidth="2.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 3a9 9 0 1 1 -9 9" />
  </Svg>
);
