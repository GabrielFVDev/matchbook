import { Children, cloneElement, isValidElement } from 'react';
import styled, { css } from 'styled-components';
import { cores, raio } from '../../styles/tokens';
import { IconAlert, IconCheck, IconChevronDown } from '../Icons';

export const Label = styled.label`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
`;

export const LabelTag = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${cores.tintaSuave};
`;

const estiloEntrada = css`
  width: 100%;
  min-width: 0;
  border: 0;
  border-radius: ${raio.campo};
  background: ${({ $erro }) => ($erro ? cores.erroFundo : cores.fundoApp)};
  color: ${cores.tinta};
  font-size: 16px;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: none;
    background: ${cores.branco};
    box-shadow: 0 0 0 3px ${cores.marca};
  }

  &:disabled {
    color: ${cores.tintaSuave};
    opacity: 0.7;
  }
`;

export const Input = styled.input`
  ${estiloEntrada}
  height: 52px;
  padding: 0 16px;
`;

export const TextArea = styled.textarea`
  ${estiloEntrada}
  min-height: 112px;
  padding: 14px 16px;
  line-height: 1.5;
  resize: vertical;
`;

const SelectWrap = styled.div`
  position: relative;
  display: flex;

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

const SelectBase = styled.select`
  ${estiloEntrada}
  height: 52px;
  padding: 0 44px 0 16px;
  appearance: none;
  cursor: pointer;
`;

export const Select = ({ children, ...props }) => (
  <SelectWrap>
    <SelectBase {...props}>{children}</SelectBase>
    <IconChevronDown tamanho={18} />
  </SelectWrap>
);

const Mensagem = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: ${({ $tom }) => ($tom === 'ajuda' ? 400 : 600)};
  line-height: 1.4;
  color: ${({ $tom }) =>
    $tom === 'erro' ? cores.erro : $tom === 'sucesso' ? cores.sucesso : cores.tintaSuave};

  svg {
    flex: 0 0 auto;
  }
`;

const Grupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  ${({ $span }) =>
    $span &&
    css`
      grid-column: 1 / -1;
    `}
`;

// Campo com rótulo, marcação de opcional ou obrigatório e uma mensagem embaixo.
// Liga sozinho aria-describedby e aria-invalid no controle filho.
export function Field({ id, label, tag, help, error, success, span, children, ...resto }) {
  const mensagemId = `${id}Mensagem`;
  const temMensagem = Boolean(error || success || help);

  const controle = Children.map(children, (filho) =>
    isValidElement(filho)
      ? cloneElement(filho, {
          id,
          $erro: Boolean(error),
          'aria-invalid': error ? true : undefined,
          'aria-describedby': temMensagem ? mensagemId : undefined,
        })
      : filho,
  );

  return (
    <Grupo $span={span} {...resto}>
      <Label htmlFor={id}>
        {label}
        {tag && <LabelTag>{tag}</LabelTag>}
      </Label>
      {controle}
      {error ? (
        <Mensagem id={mensagemId} $tom="erro">
          <IconAlert tamanho={16} />
          {error}
        </Mensagem>
      ) : success ? (
        <Mensagem id={mensagemId} $tom="sucesso">
          <IconCheck tamanho={16} />
          {success}
        </Mensagem>
      ) : help ? (
        <Mensagem id={mensagemId} $tom="ajuda">
          {help}
        </Mensagem>
      ) : null}
    </Grupo>
  );
}

// Erro do formulário inteiro, mostrado perto do botão de enviar.
export const FormAlert = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  border-radius: ${raio.campo};
  background: ${cores.erroFundo};
  color: ${cores.erro};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
  }
`;
