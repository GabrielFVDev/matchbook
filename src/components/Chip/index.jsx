import styled from 'styled-components';
import { cores, raio } from '../../styles/tokens';

// Etiqueta clicável (filtros e escolha de gênero). O estado vai em aria-pressed.
export const Chip = styled.button.attrs(({ $ativo }) => ({
  type: 'button',
  'aria-pressed': Boolean($ativo),
}))`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: ${raio.pilula};
  background: ${({ $ativo, $fundo }) => ($ativo ? cores.tinta : $fundo || cores.branco)};
  color: ${({ $ativo }) => ($ativo ? cores.branco : cores.tinta)};
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;
`;

export const ChipCount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $ativo }) => ($ativo ? cores.tintaSobreEscuro : cores.tintaSuave)};
`;

// Etiqueta só de leitura (gênero, páginas, ano).
export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: ${({ $pequena }) => ($pequena ? '4px 10px' : '5px 12px')};
  border-radius: ${raio.pilula};
  background: ${({ $fundo }) => $fundo || cores.branco};
  color: ${({ $cor }) => $cor || cores.tinta};
  font-size: ${({ $pequena }) => ($pequena ? '12px' : '13px')};
  font-weight: 700;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
