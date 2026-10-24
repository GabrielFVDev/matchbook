import styled from 'styled-components';
import { motion } from 'motion/react';
import { cores, celular, raio, sombra } from '@/styles/tokens';

export const PageHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PageTitle = styled.h1`
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.03em;

  ${celular} {
    font-size: 32px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 17px;
  color: ${cores.tintaSuave};

  ${celular} {
    font-size: 15px;
  }
`;

export const HeadingActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  ${celular} {
    display: none;
  }
`;

export const FilterChip = styled.button.attrs({ type: 'button' })`
  position: relative;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  color: ${({ $ativo }) => ($ativo ? cores.branco : cores.tinta)};
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.2s ease,
    transform 0.12s ease;

  &:active {
    transform: scale(0.96);
  }
`;

// Fundo escuro do filtro ativo. Desliza até o gênero escolhido.
export const FilterPill = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: ${raio.pilula};
  background: ${cores.tinta};
`;

export const FilterLabel = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  ${celular} {
    flex-wrap: nowrap;
    margin: 0 -20px;
    padding: 0 20px 4px;
    overflow-x: auto;
  }
`;

export const BooksGrid = styled.ul`
  position: relative;
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(230px, 100%), 1fr));
  gap: 20px;

  ${celular} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
`;

export const BookCard = styled(motion.li)`
  display: flex;
  flex-direction: column;
`;

// Visual do cartão. Fica separado do item da lista para o "levantar" no hover
// não brigar com a animação de reorganizar a grade.
export const BookCardInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 10px 14px;
  border-radius: ${raio.cartao};
  background: ${cores.branco};
  box-shadow: ${sombra.leve};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 18px 40px rgba(26, 23, 38, 0.12);
    }
  }

  ${celular} {
    gap: 10px;
    padding: 8px 8px 12px;
    border-radius: 20px;
  }
`;

export const RemoveButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${raio.pilula};
  background: transparent;
  color: ${cores.tinta};

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: ${raio.pilula};
    background: ${cores.branco};
    transition:
      transform 0.12s ease,
      color 0.15s ease;
  }

  &:hover span {
    color: ${cores.erro};
  }

  &:active:not(:disabled) span {
    transform: scale(0.88);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 6px;

  ${celular} {
    gap: 2px;
    padding: 0 4px;
  }
`;

export const BookAuthor = styled.p`
  font-size: 16px;
  font-weight: 700;

  ${celular} {
    font-size: 14px;
  }
`;

export const BookDetail = styled.p`
  font-size: 13px;
  color: ${cores.tintaSuave};

  ${celular} {
    font-size: 12px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 360px;
  font-size: 17px;
  font-weight: 700;
`;
