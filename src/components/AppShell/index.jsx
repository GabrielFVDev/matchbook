import { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import styled from 'styled-components';
import Header from '../Header';
import { MobileNav } from '../MobileNav';
import { ShellContext } from '../../contexts/shell';
import { cores } from '../../styles/tokens';
import { transicaoTela } from '../../styles/movimento';

const Pagina = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ $fundo }) => $fundo};
  transition: background-color 0.5s ease;
`;

const Conteudo = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Estrutura fixa das telas de quem já entrou. Cabeçalho e barra do celular
// ficam montados; só o conteúdo da rota troca, com animação de entrada e saída.
export function AppShell() {
  const location = useLocation();
  const rota = useOutlet();
  const [aparencia, setAparencia] = useState({ fundo: cores.fundoApp, corDestaque: cores.marca });

  return (
    <ShellContext.Provider value={setAparencia}>
      <Pagina $fundo={aparencia.fundo}>
        <Header corDestaque={aparencia.corDestaque} />
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <Conteudo key={location.pathname} {...transicaoTela}>
            {rota}
          </Conteudo>
        </AnimatePresence>
        <MobileNav />
      </Pagina>
    </ShellContext.Provider>
  );
}
