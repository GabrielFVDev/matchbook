import styled from 'styled-components';
import Header from '../Header';
import { MobileNav } from '../MobileNav';
import { cores, celular } from '../../styles/tokens';

const Pagina = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ $fundo }) => $fundo};
  transition: background-color 0.4s ease;
`;

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

// Estrutura das telas de quem já entrou: cabeçalho, conteúdo e a barra do celular.
export function AppLayout({ fundo = cores.fundoApp, corDestaque, acaoCelular, espaco = '28px', children }) {
  return (
    <Pagina $fundo={fundo}>
      <Header corDestaque={corDestaque} acaoCelular={acaoCelular} />
      <Principal $espaco={espaco}>{children}</Principal>
      <MobileNav />
    </Pagina>
  );
}
