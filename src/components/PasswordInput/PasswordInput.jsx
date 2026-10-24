import { useState } from 'react';
import styled from 'styled-components';
import { cores, raio } from '@/styles/tokens';
import { Input } from '@/components/Field';
import { IconEye, IconEyeOff } from '@/components/Icons';

const Caixa = styled.div`
  position: relative;
  display: flex;
`;

const CampoSenha = styled(Input)`
  padding-right: 56px;
`;

const Mostrar = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${raio.campo};
  background: transparent;
  color: ${cores.tintaSuave};
`;

// Campo de senha com o botão de mostrar e esconder.
export function PasswordInput(props) {
  const [visivel, setVisivel] = useState(false);

  return (
    <Caixa>
      <CampoSenha {...props} type={visivel ? 'text' : 'password'} />
      <Mostrar
        aria-label={visivel ? 'Esconder senha' : 'Mostrar senha'}
        onClick={() => setVisivel(!visivel)}
      >
        {visivel ? <IconEyeOff /> : <IconEye />}
      </Mostrar>
    </Caixa>
  );
}
