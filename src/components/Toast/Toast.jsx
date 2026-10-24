import { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'motion/react';
import { cores, celular, raio, sombra } from '@/styles/tokens';
import { animacaoAviso } from '@/styles/motion';

const Area = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 24px;
  z-index: 40;
  display: flex;
  justify-content: center;
  pointer-events: none;

  ${celular} {
    bottom: 96px;
  }
`;

export const ToastPill = styled(motion.div)`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 460px;
  border-radius: ${raio.pilula};
  font-size: 15px;
  line-height: 1.35;

  ${({ $tom }) =>
    $tom === 'escuro'
      ? css`
          padding: 6px 6px 6px 20px;
          background: ${cores.tinta};
          color: ${cores.branco};
          box-shadow: ${sombra.aviso};
        `
      : css`
          padding: 12px 18px;
          background: ${cores.branco};
          color: ${cores.tinta};
          box-shadow: ${sombra.botaoBranco};
        `}

  svg {
    flex: 0 0 auto;
  }

  strong {
    font-weight: 800;
  }

  ${celular} {
    font-size: 14px;
  }
`;

export const ToastDetail = styled.span`
  color: ${cores.tintaSuave};
`;

const Acao = styled.button.attrs({ type: 'button' })`
  flex: 0 0 auto;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  color: ${cores.tinta};
  font-size: 15px;
  font-weight: 700;
`;

// Aviso rápido no rodapé, sem travar a tela. Some sozinho depois de "duracao".
// Para animar a saída, renderize dentro de <AnimatePresence> com uma key por aviso.
export function Toast({ children, icone, acao, tom = 'escuro', duracao = 4000, onFechar, chave }) {
  const fecharRef = useRef(onFechar);

  useEffect(() => {
    fecharRef.current = onFechar;
  }, [onFechar]);

  // "chave" reinicia a contagem quando chega um aviso novo.
  useEffect(() => {
    if (!duracao) return undefined;
    const timer = setTimeout(() => fecharRef.current?.(), duracao);
    return () => clearTimeout(timer);
  }, [duracao, chave]);

  return (
    <Area>
      <ToastPill role="status" $tom={tom} {...animacaoAviso}>
        {icone}
        <span>{children}</span>
        {acao && <Acao onClick={acao.onClick}>{acao.rotulo}</Acao>}
      </ToastPill>
    </Area>
  );
}
