import styled from 'styled-components';
import { motion } from 'motion/react';
import { cores, celular } from '../../styles/tokens';
import { surgir } from '../../styles/movimento';

export const StatGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(${({ $minimo = 220 }) => $minimo}px, 100%), 1fr));
  gap: 16px;

  ${celular} {
    grid-template-columns: repeat(${({ $colunasCelular = 2 }) => $colunasCelular}, minmax(0, 1fr));
    gap: 10px;
  }
`;

const Tile = styled(motion.div)`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  gap: 4px;
  padding: 20px 22px;
  border-radius: 20px;
  background: ${({ $fundo }) => $fundo || cores.branco};

  dt {
    font-size: 14px;
    color: ${({ $fundo }) => ($fundo ? cores.tinta : cores.tintaSuave)};
  }

  dd {
    font-size: ${({ $texto }) => ($texto ? '28px' : '38px')};
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ $cor }) => $cor || cores.tinta};
    overflow-wrap: anywhere;
  }

  ${celular} {
    padding: 14px 16px;
    border-radius: 18px;

    dt {
      font-size: 13px;
    }

    dd {
      font-size: ${({ $texto }) => ($texto ? '20px' : '28px')};
    }
  }
`;

// Número de destaque com o rótulo embaixo. Vai dentro de um StatGrid (dl).
// "ordem" faz os números entrarem em sequência.
export function StatTile({ rotulo, valor, fundo, cor, texto, ordem }) {
  return (
    <Tile $fundo={fundo} $cor={cor} $texto={texto} {...(ordem !== undefined ? surgir(ordem) : {})}>
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </Tile>
  );
}
