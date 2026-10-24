import type { AriaRole, ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { cores, celular } from '@/styles/tokens';
import { curvaEntrada } from '@/styles/motion';

const tons = {
  marca: { fundo: cores.fundoMarca, cor: cores.marca },
  erro: { fundo: cores.erroFundo, cor: cores.erro },
  sucesso: { fundo: cores.sucessoFundo, cor: cores.sucesso },
};

type Tom = keyof typeof tons;

const Caixa = styled(motion.div)<{ $fundo?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 64px 24px;
  border-radius: 28px;
  background: ${({ $fundo }) => $fundo || cores.branco};
  text-align: center;

  ${celular} {
    padding: 44px 20px;
    border-radius: 24px;
  }
`;

const Icone = styled(motion.span)<{ $tom: Tom }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: ${({ $tom }) => tons[$tom].fundo};
  color: ${({ $tom }) => tons[$tom].cor};
`;

const Titulo = styled.p`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;

  ${celular} {
    font-size: 22px;
  }
`;

const Descricao = styled.p`
  max-width: 420px;
  font-size: 16px;
  line-height: 1.5;
  color: ${cores.tintaSuave};
`;

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
`;

// Bloco para tela vazia, erro ou sucesso: ícone, título, texto e ações.
interface EmptyStateProps {
  icone?: ReactNode;
  tom?: Tom;
  titulo: ReactNode;
  descricao?: ReactNode;
  fundo?: string;
  children?: ReactNode;
  role?: AriaRole;
}

export function EmptyState({
  icone,
  tom = 'marca',
  titulo,
  descricao,
  fundo,
  children,
  role,
}: EmptyStateProps) {
  return (
    <Caixa
      $fundo={fundo}
      role={role}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: curvaEntrada }}
    >
      {icone && (
        <Icone
          $tom={tom}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.1 }}
        >
          {icone}
        </Icone>
      )}
      <Titulo>{titulo}</Titulo>
      {descricao && <Descricao>{descricao}</Descricao>}
      {children && <Acoes>{children}</Acoes>}
    </Caixa>
  );
}
