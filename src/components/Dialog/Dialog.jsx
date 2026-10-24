import { useEffect, useId } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'motion/react';
import { cores, celular, raio } from '@/styles/tokens';
import { curvaSaida } from '@/styles/motion';
import { Button } from '@/components/Button';
import { IconX } from '@/components/Icons';

const Fundo = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(26, 23, 38, 0.55);
  overflow-y: auto;

  ${celular} {
    align-items: flex-end;
    padding: 12px;
  }
`;

const Caixa = styled(motion.div)`
  width: 100%;
  max-width: ${({ $largura }) => $largura}px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  padding: 28px;
  border-radius: ${raio.cartao};
  background: ${cores.branco};
  box-shadow: 0 24px 60px rgba(26, 23, 38, 0.35);
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${celular} {
    max-height: calc(100vh - 24px);
    padding: 24px 20px;
  }
`;

const Topo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Titulo = styled.h2`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.015em;
`;

const Fechar = styled.button.attrs({ type: 'button' })`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin: -8px -8px 0 0;
  border: 0;
  border-radius: ${raio.pilula};
  background: ${cores.fundoApp};
  color: ${cores.tinta};
`;

const animacaoFundo = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18, delay: 0.04 } },
};

const animacaoCaixa = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 32 },
  },
  exit: { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.15, ease: curvaSaida } },
};

// Janela sobre a tela. Fecha com Esc, clique fora ou no botão de fechar.
export function Dialog({ aberto, titulo, onFechar, largura = 560, children }) {
  const tituloId = useId();

  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') onFechar();
    };
    document.addEventListener('keydown', aoTeclar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [aberto, onFechar]);

  return (
    <AnimatePresence>
      {aberto && (
        <Fundo onClick={onFechar} {...animacaoFundo}>
          <Caixa
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
            $largura={largura}
            onClick={(e) => e.stopPropagation()}
            {...animacaoCaixa}
          >
            <Topo>
              <Titulo id={tituloId}>{titulo}</Titulo>
              <Fechar aria-label="Fechar" onClick={onFechar}>
                <IconX tamanho={18} />
              </Fechar>
            </Topo>
            {children}
          </Caixa>
        </Fundo>
      )}
    </AnimatePresence>
  );
}

const IconeAlerta = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: ${raio.pilula};
  background: ${({ $perigo }) => ($perigo ? cores.erroFundo : cores.fundoMarca)};
  color: ${({ $perigo }) => ($perigo ? cores.erro : cores.marca)};
`;

const Texto = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: ${cores.tintaSuave};
`;

const Botoes = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;

  > * {
    flex: 1;
  }
`;

// Confirmação de ação sem volta, como excluir a conta.
export function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  icone,
  rotuloConfirmar,
  rotuloCarregando = 'Excluindo',
  variante = 'perigoForte',
  carregando,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Dialog aberto={aberto} titulo={titulo} onFechar={onCancelar} largura={400}>
      {icone && <IconeAlerta $perigo={variante === 'perigoForte'}>{icone}</IconeAlerta>}
      <Texto>{descricao}</Texto>
      <Botoes>
        <Button $variante="secundario" onClick={onCancelar} autoFocus>
          Cancelar
        </Button>
        <Button $variante={variante} onClick={onConfirmar} disabled={carregando}>
          {carregando ? rotuloCarregando : rotuloConfirmar}
        </Button>
      </Botoes>
    </Dialog>
  );
}
