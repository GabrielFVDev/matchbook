import styled from 'styled-components';
import { motion } from 'motion/react';
import { cores, celular } from '@/styles/tokens';

export const CoverStack = styled(motion.div)`
  position: relative;
  width: 380px;
  max-width: 100%;
  height: 360px;

  ${celular} {
    width: 150px;
    height: 170px;
    flex: 0 0 auto;
  }
`;

export const StackCover = styled(motion.div)`
  position: absolute;
  left: ${({ $x }) => $x[0]}px;
  top: ${({ $y }) => $y[0]}px;
  width: ${({ $w }) => $w[0]}px;
  height: ${({ $h }) => $h[0]}px;
  padding: 18px;
  border-radius: 20px;
  background: ${({ $cor }) => $cor};
  color: ${cores.branco};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 18px 40px rgba(26, 23, 38, 0.18);

  span:first-child {
    align-self: flex-start;
    padding: 4px 10px;
    border-radius: 999px;
    background: ${cores.branco};
    color: ${cores.tinta};
    font-size: 12px;
    font-weight: 700;
  }

  span:last-child {
    font-size: ${({ $fonte }) => $fonte[0]}px;
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
  }

  ${celular} {
    left: ${({ $x }) => $x[1]}px;
    top: ${({ $y }) => $y[1]}px;
    width: ${({ $w }) => $w[1]}px;
    height: ${({ $h }) => $h[1]}px;
    padding: 10px;
    border-radius: 12px;
    justify-content: flex-end;

    span:first-child {
      display: none;
    }

    span:last-child {
      display: ${({ $tituloCelular }) => ($tituloCelular ? 'block' : 'none')};
      font-size: ${({ $fonte }) => $fonte[1]}px;
    }
  }
`;

export const BrandRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${celular} {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`;

export const QuoteText = styled(motion.p)`
  max-width: 440px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  text-wrap: balance;

  ${celular} {
    font-size: 19px;
    letter-spacing: -0.01em;
  }
`;
