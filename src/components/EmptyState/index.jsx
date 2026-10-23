import styled from 'styled-components';
import { cores, celular } from '../../styles/tokens';

const tons = {
  marca: { fundo: cores.fundoMarca, cor: cores.marca },
  erro: { fundo: cores.erroFundo, cor: cores.erro },
  sucesso: { fundo: cores.sucessoFundo, cor: cores.sucesso },
};

const Caixa = styled.div`
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

const Icone = styled.span`
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
export function EmptyState({ icone, tom = 'marca', titulo, descricao, fundo, children, role }) {
  return (
    <Caixa $fundo={fundo} role={role}>
      {icone && <Icone $tom={tom}>{icone}</Icone>}
      <Titulo>{titulo}</Titulo>
      {descricao && <Descricao>{descricao}</Descricao>}
      {children && <Acoes>{children}</Acoes>}
    </Caixa>
  );
}
