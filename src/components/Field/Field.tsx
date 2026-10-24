import { Children, cloneElement, isValidElement } from 'react';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { colors, radius } from '@/styles/tokens';
import { IconAlert, IconCheck, IconChevronDown } from '@/components/Icons';

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
  color: ${colors.inkSoft};
`;

interface InputStyleProps {
  $invalid?: boolean;
}

const inputStyle = css<InputStyleProps>`
  width: 100%;
  min-width: 0;
  border: 0;
  border-radius: ${radius.field};
  background: ${({ $invalid }) => ($invalid ? colors.errorBackground : colors.appBackground)};
  color: ${colors.ink};
  font-size: 16px;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: none;
    background: ${colors.white};
    box-shadow: 0 0 0 3px ${colors.brand};
  }

  &:disabled {
    color: ${colors.inkSoft};
    opacity: 0.7;
  }
`;

export const Input = styled.input<InputStyleProps>`
  ${inputStyle}
  height: 52px;
  padding: 0 16px;
`;

export const TextArea = styled.textarea<InputStyleProps>`
  ${inputStyle}
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

const SelectBase = styled.select<InputStyleProps>`
  ${inputStyle}
  height: 52px;
  padding: 0 44px 0 16px;
  appearance: none;
  cursor: pointer;
`;

export const Select = ({ children, ...props }: ComponentProps<typeof SelectBase>) => (
  <SelectWrap>
    <SelectBase {...props}>{children}</SelectBase>
    <IconChevronDown size={18} />
  </SelectWrap>
);

const Message = styled.p<{ $tone: 'error' | 'success' | 'help' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: ${({ $tone }) => ($tone === 'help' ? 400 : 600)};
  line-height: 1.4;
  color: ${({ $tone }) =>
    $tone === 'error' ? colors.error : $tone === 'success' ? colors.success : colors.inkSoft};

  svg {
    flex: 0 0 auto;
  }
`;

const Group = styled.div<{ $span?: boolean }>`
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

// What Field puts on the child control (Input, Select, TextArea, PasswordInput).
interface InjectedControlProps {
  id?: string;
  $invalid?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  id: string;
  label: ReactNode;
  tag?: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  success?: ReactNode;
  span?: boolean;
  children: ReactNode;
}

// Field with a label, an optional or required tag and a message below.
// Wires aria-describedby and aria-invalid on the child control by itself.
export function Field({
  id,
  label,
  tag,
  help,
  error,
  success,
  span,
  children,
  ...rest
}: FieldProps) {
  const messageId = `${id}Message`;
  const hasMessage = Boolean(error || success || help);

  const control = Children.map(children, (child) =>
    isValidElement<InjectedControlProps>(child)
      ? cloneElement(child, {
          id,
          $invalid: Boolean(error),
          'aria-invalid': error ? true : undefined,
          'aria-describedby': hasMessage ? messageId : undefined,
        })
      : child,
  );

  return (
    <Group $span={span} {...rest}>
      <Label htmlFor={id}>
        {label}
        {tag && <LabelTag>{tag}</LabelTag>}
      </Label>
      {control}
      {error ? (
        <Message id={messageId} $tone="error">
          <IconAlert size={16} />
          {error}
        </Message>
      ) : success ? (
        <Message id={messageId} $tone="success">
          <IconCheck size={16} />
          {success}
        </Message>
      ) : help ? (
        <Message id={messageId} $tone="help">
          {help}
        </Message>
      ) : null}
    </Group>
  );
}

// Error of the whole form, shown near the submit button.
export const FormAlert = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  border-radius: ${radius.field};
  background: ${colors.errorBackground};
  color: ${colors.error};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
  }
`;
