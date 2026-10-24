import { useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';
import styled from 'styled-components';
import { colors, radius, shadow } from '@/styles/tokens';
import { spring } from '@/styles/motion';
import { IconMinus, IconPlus } from '@/components/Icons';

export const ChoiceLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: ${radius.pill};
  background: ${colors.appBackground};
`;

const OptionButton = styled.button.attrs({ type: 'button' })<{ $active?: boolean }>`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  border-radius: ${radius.pill};
  background: transparent;
  color: ${colors.ink};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};

  span {
    position: relative;
  }
`;

// White background of the chosen option. Slides to the new option.
const Indicator = styled(motion.span)`
  position: absolute !important;
  inset: 0;
  border-radius: ${radius.pill};
  background: ${colors.white};
  box-shadow: ${shadow.active};
`;

// Single choice among a few options (reading level).
interface SegmentedProps {
  id: string;
  label: ReactNode;
  options: readonly string[];
  value: string;
  onChange: (option: string) => void;
}

export function Segmented({ id, label, options, value, onChange }: SegmentedProps) {
  return (
    <Group role="group" aria-labelledby={id}>
      <ChoiceLabel id={id}>{label}</ChoiceLabel>
      <Track>
        {options.map((option) => (
          <OptionButton
            key={option}
            $active={option === value}
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            {option === value && <Indicator layoutId={`${id}Indicator`} transition={spring} />}
            <span>{option}</span>
          </OptionButton>
        ))}
      </Track>
    </Group>
  );
}

const RoundButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: ${radius.pill};
  background: ${colors.white};
  color: ${colors.ink};
  transition:
    transform 0.12s ease,
    opacity 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    opacity: 0.4;
  }
`;

const ValueDisplay = styled.output`
  position: relative;
  min-width: 48px;
  height: 24px;
  overflow: hidden;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  line-height: 24px;

  span {
    position: absolute;
    inset: 0;
  }
`;

const StepperRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

// Counter with minus and plus buttons (books already read).
// The new number comes in from below when it goes up and from above when it goes down.
const rollNumber: Variants = {
  enter: (direction: number) => ({ y: direction * 18, opacity: 0 }),
  idle: { y: 0, opacity: 1, transition: { duration: 0.18 } },
  exit: (direction: number) => ({ y: direction * -18, opacity: 0, transition: { duration: 0.18 } }),
};

interface StepperProps {
  id: string;
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function Stepper({ id, label, value, onChange, min = 0 }: StepperProps) {
  const [direction, setDirection] = useState(1);

  const changeBy = (step: number) => {
    setDirection(step);
    onChange(Math.max(min, value + step));
  };

  return (
    <StepperRow role="group" aria-labelledby={id}>
      <ChoiceLabel id={id}>{label}</ChoiceLabel>
      <Track>
        <RoundButton aria-label="Diminuir" disabled={value <= min} onClick={() => changeBy(-1)}>
          <IconMinus size={18} />
        </RoundButton>
        <ValueDisplay aria-live="polite">
          <AnimatePresence initial={false} custom={direction}>
            <motion.span
              key={value}
              custom={direction}
              variants={rollNumber}
              initial="enter"
              animate="idle"
              exit="exit"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </ValueDisplay>
        <RoundButton aria-label="Aumentar" onClick={() => changeBy(1)}>
          <IconPlus size={18} />
        </RoundButton>
      </Track>
    </StepperRow>
  );
}

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${colors.appBackground};
`;

const SwitchLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const SwitchTrack = styled.button.attrs({ type: 'button', role: 'switch' })<{ $checked: boolean }>`
  flex: 0 0 auto;
  display: flex;
  width: 52px;
  height: 32px;
  padding: 4px;
  border: 0;
  border-radius: ${radius.pill};
  background: ${({ $checked }) => ($checked ? colors.brand : colors.disabled)};
  transition: background-color 0.15s ease;

  span {
    width: 24px;
    height: 24px;
    border-radius: ${radius.pill};
    background: ${colors.white};
    box-shadow: 0 1px 3px rgba(26, 23, 38, 0.25);
    transform: translateX(${({ $checked }) => ($checked ? '20px' : '0')});
    transition: transform 0.15s ease;
  }
`;

// On/off switch (receive recommendations).
interface SwitchProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ id, label, checked, onChange }: SwitchProps) {
  return (
    <SwitchRow>
      <SwitchLabel id={id}>{label}</SwitchLabel>
      <SwitchTrack
        $checked={checked}
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
      >
        <span />
      </SwitchTrack>
    </SwitchRow>
  );
}
