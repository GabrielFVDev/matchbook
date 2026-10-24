import { useState } from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';
import { colors, radius } from '@/styles/tokens';
import { Input } from '@/components/Field';
import { IconEye, IconEyeOff } from '@/components/Icons';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const PasswordField = styled(Input)`
  padding-right: 56px;
`;

const VisibilityToggle = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${radius.field};
  background: transparent;
  color: ${colors.inkSoft};
`;

// Campo de senha com o botão de mostrar e esconder.
export function PasswordInput(props: Omit<ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false);

  return (
    <Wrapper>
      <PasswordField {...props} type={visible ? 'text' : 'password'} />
      <VisibilityToggle
        aria-label={visible ? 'Esconder senha' : 'Mostrar senha'}
        onClick={() => setVisible(!visible)}
      >
        {visible ? <IconEyeOff /> : <IconEye />}
      </VisibilityToggle>
    </Wrapper>
  );
}
