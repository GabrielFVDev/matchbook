import styled from 'styled-components';
import { motion } from 'motion/react';
import { cores, celular, raio, sombra } from '../../styles/tokens';

export const MatchArea = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 80px;

  ${celular} {
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

  ${celular} {
    flex: 0 0 auto;
    max-width: none;
  }
`;

export const Eyebrow = styled(motion.p)`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $cor }) => $cor};
  transition: color 0.4s ease;
`;

export const Headline = styled(motion.h1)`
  font-size: 36px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;

  ${celular} {
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
  color: ${cores.tintaSuave};
  text-wrap: pretty;

  ${celular} {
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

  ${celular} {
    flex: 0 0 auto;
    gap: 18px;
  }
`;

// Altura mínima para as cartas de trás não encolherem entre uma carta e outra.
export const Stack = styled.div`
  position: relative;
  width: 100%;
  min-height: 480px;

  ${celular} {
    min-height: 380px;
  }
`;

export const GhostCard = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${raio.carta};
  background: ${cores.branco};
  opacity: ${({ $opacidade }) => $opacidade};
  transform: ${({ $transform }) => $transform};

  ${celular} {
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
  border-radius: ${raio.carta};
  background: ${cores.branco};
  box-shadow: ${sombra.carta};

  ${celular} {
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

  ${celular} {
    gap: 8px;
    padding: 0 6px 6px;
  }
`;

export const BookAuthor = styled.p`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;

  ${celular} {
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
  color: ${cores.tintaSuave};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${celular} {
    font-size: 14px;
    -webkit-line-clamp: 2;
  }
`;

// Selo que aparece no meio da capa enquanto a carta é arrastada.
export const Stamp = styled(motion.span)`
  position: absolute;
  top: 140px;
  left: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  color: ${({ $cor }) => $cor || cores.tinta};
  font-size: 22px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: ${sombra.amei};
  transform: translateX(-50%) rotate(${({ $lado }) => ($lado === 'esquerda' ? '-8deg' : '8deg')});
  pointer-events: none;

  ${celular} {
    top: 100px;
    font-size: 19px;
    padding: 8px 16px;
  }
`;

// Altura parecida com a da carta pronta, para a tela não pular ao carregar.
export const LoadingCard = styled(motion.div)`
  position: relative;
  z-index: 1;
  border-radius: ${raio.carta};
  background: ${cores.branco};
  box-shadow: ${sombra.carta};
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  color: ${cores.tinta};
  font-size: 17px;
  font-weight: 700;

  ${celular} {
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

export const ActionButton = styled(motion.button).attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $principal }) => ($principal ? cores.tinta : cores.tintaSuave)};
  font-size: ${({ $principal }) => ($principal ? '16px' : '14px')};
  font-weight: ${({ $principal }) => ($principal ? 800 : 500)};

  &:disabled {
    opacity: 0.5;
  }

  ${celular} {
    gap: 6px;
    font-size: ${({ $principal }) => ($principal ? '15px' : '13px')};
  }
`;

export const ActionCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $principal }) => ($principal ? 92 : 60)}px;
  height: ${({ $principal }) => ($principal ? 92 : 60)}px;
  border-radius: ${raio.pilula};
  background: ${({ $cor }) => $cor};
  color: ${({ $principal }) => ($principal ? cores.branco : cores.tinta)};
  box-shadow: ${({ $principal }) => ($principal ? sombra.amei : sombra.botaoBranco)};
  transition: background-color 0.4s ease;

  ${celular} {
    width: ${({ $principal }) => ($principal ? 80 : 56)}px;
    height: ${({ $principal }) => ($principal ? 80 : 56)}px;
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
  color: ${cores.tintaSuave};
  text-align: center;

  span:last-child {
    display: none;
  }

  ${celular} {
    font-size: 13px;

    span:first-child {
      display: none;
    }

    span:last-child {
      display: inline;
    }
  }
`;

// Coração do botão Amei: dá uma batida a cada Amei.
export const HeartBeat = styled(motion.span)`
  display: flex;
`;
