import styled from 'styled-components';
import { colors, genreColors, mobile, radius } from '@/styles/tokens';

// The 404 wears the Mistério genre: the book that disappeared from the shelf.
const mystery = genreColors('Mistério');

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${mystery.background};
`;

export const TopBar = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 40px;

  ${mobile} {
    padding: 12px 20px 0;
  }
`;

export const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 40px 72px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 88px;

  ${mobile} {
    padding: 28px 20px 28px;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: flex-start;
    gap: 28px;
  }
`;

// Two loose cards behind the "404" cover, like the stack on the Home screen.
export const Stack = styled.div`
  position: relative;
  flex: 0 0 320px;
  height: 400px;

  ${mobile} {
    flex: 0 0 auto;
    align-self: center;
    width: 240px;
    height: 300px;
  }
`;

export const LooseCard = styled.div<{ $back?: boolean }>`
  position: absolute;
  left: ${({ $back }) => ($back ? -34 : 120)}px;
  top: ${({ $back }) => ($back ? 70 : 30)}px;
  width: 230px;
  height: 310px;
  border-radius: 22px;
  background: ${colors.white};
  opacity: ${({ $back }) => ($back ? 0.55 : 0.8)};
  transform: rotate(${({ $back }) => ($back ? -16 : 12)}deg);

  ${mobile} {
    left: ${({ $back }) => ($back ? -10 : 86)}px;
    top: ${({ $back }) => ($back ? 50 : 22)}px;
    width: 170px;
    height: 230px;
    border-radius: 18px;
  }
`;

export const MissingCover = styled.div`
  position: absolute;
  left: 40px;
  top: 40px;
  width: 250px;
  height: 340px;
  padding: 22px;
  border-radius: 24px;
  background: ${mystery.cover};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: rotate(-4deg);
  box-shadow: 0 28px 64px rgba(26, 23, 38, 0.22);

  ${mobile} {
    left: 32px;
    top: 30px;
    width: 186px;
    height: 252px;
    padding: 18px;
    border-radius: 20px;
    box-shadow: 0 20px 48px rgba(26, 23, 38, 0.22);
  }
`;

export const CoverTag = styled.span`
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: ${radius.pill};
  background: ${colors.white};
  color: ${colors.ink};
  font-size: 13px;
  font-weight: 700;

  ${mobile} {
    padding: 5px 11px;
    font-size: 12px;
  }
`;

export const CoverTitle = styled.span`
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-size: 96px;
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.04em;
  }

  span {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.85;
  }

  ${mobile} {
    gap: 4px;

    strong {
      font-size: 72px;
    }

    span {
      font-size: 13px;
    }
  }
`;

export const Message = styled.section`
  flex: 1 1 380px;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  ${mobile} {
    flex: 1 1 auto;
    max-width: none;
    gap: 14px;
  }
`;

export const Eyebrow = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${mystery.cover};

  ${mobile} {
    font-size: 14px;
  }
`;

export const Title = styled.h1`
  font-size: 52px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.03em;
  text-wrap: balance;

  ${mobile} {
    font-size: 34px;
    line-height: 1.05;
    letter-spacing: -0.025em;
  }
`;

export const Text = styled.p`
  font-size: 18px;
  line-height: 1.5;
  color: ${colors.inkSoft};

  ${mobile} {
    font-size: 16px;
  }
`;

// On mobile the buttons sit at the bottom of the screen, full width.
export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;

  ${mobile} {
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
    padding-top: 14px;

    > * {
      width: 100%;
    }
  }
`;
