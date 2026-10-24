import styled from 'styled-components';
import { motion } from 'motion/react';
import { colors, mobile, radius } from '@/styles/tokens';

export const Card = styled(motion.section)<{ $background?: string }>`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 32px;
  border-radius: 28px;
  background: ${({ $background }) => $background || colors.white};

  ${mobile} {
    gap: 18px;
    padding: 24px 20px;
    border-radius: 26px;
  }
`;

export const ProfileHeader = styled(Card)`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;

  ${mobile} {
    flex-direction: column;
    gap: 14px;
    text-align: center;
  }
`;

export const Avatar = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  overflow: hidden;
  border-radius: ${radius.pill};
  background: ${colors.brand};
  color: ${colors.white};
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.02em;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${mobile} {
    width: 88px;
    height: 88px;
    font-size: 32px;
  }
`;

export const ProfileInfo = styled.div`
  flex: 1 1 280px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  h1 {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  p {
    font-size: 16px;
    color: ${colors.inkSoft};
  }

  ${mobile} {
    flex-basis: auto;

    h1 {
      font-size: 28px;
    }

    p {
      font-size: 14px;
    }
  }
`;

export const HeaderStats = styled.dl`
  flex: 0 0 auto;
  display: flex;
  gap: 12px;

  > div {
    min-width: 120px;
    background: ${colors.appBackground};
  }

  ${mobile} {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    text-align: left;
  }
`;

export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(440px, 100%), 1fr));
  gap: 20px;

  ${mobile} {
    gap: 14px;
  }
`;

export const CardHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.015em;
  line-height: 1.15;

  ${mobile} {
    font-size: 20px;
  }
`;

export const CardText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.inkSoft};

  ${mobile} {
    font-size: 15px;
  }
`;

export const CardIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StrategyBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AlgorithmStats = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  ${mobile} {
    gap: 8px;

    > div {
      padding: 12px;
    }
  }
`;

export const InfoList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 24px;

  ${mobile} {
    gap: 16px;
  }
`;

export const InfoItem = styled.div<{ $span?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  ${({ $span }) => $span && 'grid-column: 1 / -1;'}

  dt {
    font-size: 14px;
    color: ${colors.inkSoft};
  }

  dd {
    font-size: 18px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  ${mobile} {
    dt {
      font-size: 13px;
    }

    dd {
      font-size: 16px;
    }
  }
`;

export const Biography = styled.dd`
  font-size: 16px !important;
  font-weight: 400 !important;
  line-height: 1.5;
`;

export const StatusRow = styled.div<{ $enabled?: boolean | null }>`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${colors.appBackground};

  dt {
    font-size: 15px;
    font-weight: 600;
  }

  dd {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 700;
    color: ${({ $enabled }) => ($enabled ? colors.success : colors.inkSoft)};
  }
`;

export const StrategyLabel = styled.p`
  font-size: 14px;
  color: ${colors.inkSoft};
`;

export const StrategyList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StrategyItem = styled.li<{ $current?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 ${({ $current }) => ($current ? 16 : 14)}px;
  border-radius: ${radius.pill};
  background: ${({ $current }) => ($current ? colors.ink : colors.white)};
  color: ${({ $current }) => ($current ? colors.white : colors.inkSoft)};
  font-size: 14px;
  font-weight: ${({ $current }) => ($current ? 700 : 600)};

  ${mobile} {
    min-height: 36px;
    font-size: 13px;
  }
`;

export const ResetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;

  span {
    font-size: 14px;
    color: ${colors.inkSoft};
  }

  ${mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    text-align: center;
  }
`;

export const DangerCard = styled(Card)`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 32px;

  ${mobile} {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }
`;

export const DangerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h2 {
    font-size: 18px;
    font-weight: 800;
  }

  p {
    font-size: 15px;
    color: ${colors.inkSoft};
  }
`;

export const DangerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  ${mobile} {
    flex-direction: column;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  ${mobile} {
    display: contents;
  }
`;

export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const EditButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;

  > * {
    flex: 1;
  }
`;
