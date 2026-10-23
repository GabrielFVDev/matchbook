import styled from 'styled-components';
import { cores, celular, sombra } from '../../styles/tokens';
import { Logo } from '../Logo';

const Pagina = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${cores.fundoMarca};
`;

const Topo = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${celular} {
    padding: 12px 20px;
  }
`;

const LinkTopo = styled.p`
  font-size: 15px;
  color: ${cores.tintaSuave};
`;

const Principal = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 40px 64px;
  display: flex;
  flex-wrap: wrap;
  align-items: ${({ $alinhar }) => $alinhar};
  justify-content: center;
  gap: 96px;

  ${celular} {
    padding: 4px 20px 32px;
    gap: 20px;
  }
`;

// Estrutura de login e cadastro: fundo da marca, logo no topo e duas colunas.
export function AuthLayout({ linkTopo, alinhar = 'center', children }) {
  return (
    <Pagina>
      <Topo>
        <Logo para="/" />
        {linkTopo && <LinkTopo>{linkTopo}</LinkTopo>}
      </Topo>
      <Principal $alinhar={alinhar}>{children}</Principal>
    </Pagina>
  );
}

export const AuthSide = styled.div`
  flex: 1 1 380px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;

  ${celular} {
    flex-basis: auto;
    gap: 16px;
  }
`;

export const AuthCard = styled.section`
  flex: 0 1 ${({ $largura = 440 }) => $largura}px;
  min-width: 0;
  padding: 40px;
  border-radius: 28px;
  background: ${cores.branco};
  box-shadow: ${sombra.cartao};
  display: flex;
  flex-direction: column;
  gap: 28px;

  ${celular} {
    flex-basis: 100%;
    padding: 28px 22px;
    border-radius: 26px;
    gap: 22px;
  }
`;

export const AuthHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const AuthEyebrow = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $marca }) => ($marca ? cores.marca : cores.tintaSuave)};
`;

export const AuthTitle = styled.h1`
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;

  ${celular} {
    font-size: 28px;
  }
`;

export const AuthText = styled.p`
  font-size: 16px;
  line-height: 1.45;
  color: ${cores.tintaSuave};

  ${celular} {
    font-size: 15px;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const AuthFooter = styled.p`
  font-size: 15px;
  color: ${cores.tintaSuave};
  text-align: center;
`;
