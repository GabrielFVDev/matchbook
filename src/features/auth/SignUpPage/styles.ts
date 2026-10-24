import styled from 'styled-components';
import { motion } from 'motion/react';
import { colors, mobile, radius } from '@/styles/tokens';
import { AuthSide } from '@/layouts/AuthLayout';

export const SignUpSide = styled(AuthSide)`
  padding-top: 24px;

  ${mobile} {
    padding-top: 0;
  }
`;

export const SideTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${mobile} {
    display: none;
  }
`;

export const SideHeadline = styled.p`
  font-size: 40px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.025em;
  text-wrap: balance;
`;

export const StepList = styled.ol`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${mobile} {
    display: none;
  }
`;

export const StepItem = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export type StepState = 'current' | 'done' | 'next';

export const StepNumber = styled.span<{ $state: StepState }>`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${radius.pill};
  background: ${({ $state }) =>
    $state === 'current' ? colors.ink : $state === 'done' ? colors.success : colors.white};
  color: ${({ $state }) => ($state === 'next' ? colors.inkSoft : colors.white)};
  font-size: 17px;
  font-weight: 800;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
`;

export const StepText = styled.span<{ $dimmed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 18px;
    font-weight: 700;
    color: ${({ $dimmed }) => ($dimmed ? colors.inkSoft : colors.ink)};
  }

  span {
    font-size: 15px;
    color: ${colors.inkSoft};
  }
`;

export const StepPills = styled.ol`
  display: none;

  ${mobile} {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
  }
`;

export const StepPill = styled.li<{ $current?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: ${radius.pill};
  background: ${({ $current }) => ($current ? colors.ink : colors.white)};
  color: ${({ $current }) => ($current ? colors.white : colors.inkSoft)};
  font-size: 14px;
  font-weight: ${({ $current }) => ($current ? 700 : 600)};
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  svg {
    color: ${colors.success};
  }
`;

export const PillNumber = styled.span<{ $current?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${radius.pill};
  background: ${({ $current }) => ($current ? colors.white : colors.appBackground)};
  color: ${colors.ink};
  font-size: 12px;
  font-weight: 800;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;

  > :last-child {
    flex: 1;
  }

  ${mobile} {
    flex-direction: column-reverse;
  }
`;

export const StepContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 28px;

  ${mobile} {
    gap: 22px;
  }
`;
