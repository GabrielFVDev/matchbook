import { useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useDefinirShell } from '../../contexts/shell';
import { cores, celular } from '../../styles/tokens';

const Principal = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px 64px;
  display: flex;
  flex-direction: column;
  gap: ${({ $espaco }) => $espaco};

  ${celular} {
    padding: 4px 20px 112px;
    gap: 16px;
  }
`;

// Conteúdo de uma tela dentro do AppShell. Avisa ao shell o fundo e a cor de destaque.
export function AppLayout({
  fundo = cores.fundoApp,
  corDestaque = cores.marca,
  espaco = '28px',
  children,
}) {
  const definirShell = useDefinirShell();

  useLayoutEffect(() => {
    definirShell({ fundo, corDestaque });
  }, [definirShell, fundo, corDestaque]);

  return <Principal $espaco={espaco}>{children}</Principal>;
}
