import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { cores, raio } from '@/styles/tokens';

const variantes = {
  primario: css`
    background: ${cores.tinta};
    color: ${cores.branco};
    font-weight: 700;
  `,
  secundario: css`
    background: ${cores.fundoApp};
    color: ${cores.tinta};
    font-weight: 600;
  `,
  branco: css`
    background: ${cores.branco};
    color: ${cores.tinta};
    font-weight: 600;
  `,
  discreto: css`
    background: transparent;
    color: ${cores.marca};
    font-weight: 700;
  `,
  perigo: css`
    background: ${cores.erroFundo};
    color: ${cores.erro};
    font-weight: 700;
  `,
  perigoForte: css`
    background: ${cores.erro};
    color: ${cores.branco};
    font-weight: 700;
  `,
};

const tamanhos = {
  grande: css`
    min-height: 56px;
    padding: 0 28px;
    font-size: 17px;
  `,
  medio: css`
    min-height: 48px;
    padding: 0 20px;
    font-size: 15px;
  `,
};

export type ButtonVariante = keyof typeof variantes;
export type ButtonTamanho = keyof typeof tamanhos;

interface EstiloBotaoProps {
  $variante?: ButtonVariante;
  $tamanho?: ButtonTamanho;
  $total?: boolean;
}

const estiloBotao = css<EstiloBotaoProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: ${raio.pilula};
  text-decoration: none;
  line-height: 1.1;
  text-align: center;
  transition:
    transform 0.18s ease,
    opacity 0.15s ease,
    background-color 0.2s ease;
  ${({ $variante = 'primario' }) => variantes[$variante]}
  ${({ $tamanho = 'medio' }) => tamanhos[$tamanho]}
  ${({ $total }) =>
    $total &&
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

export const Button = styled.button.attrs<EstiloBotaoProps>(({ type }) => ({
  type: type || 'button',
}))<EstiloBotaoProps>`
  ${estiloBotao}
`;

export const ButtonLink = styled(Link)<EstiloBotaoProps>`
  ${estiloBotao}
`;
