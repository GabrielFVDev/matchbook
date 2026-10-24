import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, mobile, radius, shadow } from '@/styles/tokens';

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.appBackground};
`;

// The top of the page takes the background color of the demo card's book.
export const Hero = styled.div<{ $background: string }>`
  background: ${({ $background }) => $background};
  transition: background-color 0.5s ease;

  ${mobile} {
    padding-bottom: 48px;
  }
`;

export const TopBar = styled.header`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${mobile} {
    padding: 12px 20px;
    gap: 8px;
  }
`;

export const AccountNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TopLogin = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: ${radius.pill};
  color: ${colors.ink};
  font-size: 15px;
  font-weight: 600;

  ${mobile} {
    padding: 0 16px;
    background: ${colors.white};
    font-size: 14px;
    font-weight: 700;
  }
`;

export const TopSignUp = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 20px;
  border-radius: ${radius.pill};
  background: ${colors.ink};
  color: ${colors.white};
  font-size: 15px;
  font-weight: 700;

  ${mobile} {
    display: none;
  }
`;

export const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px 96px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 64px;

  ${mobile} {
    padding: 20px 20px 0;
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }
`;

export const Intro = styled.div`
  flex: 1 1 460px;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${mobile} {
    flex: 0 0 auto;
    max-width: none;
    gap: 18px;
  }
`;

export const HeroTag = styled.p<{ $color: string }>`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: ${radius.pill};
  background: ${colors.white};
  color: ${({ $color }) => $color};
  font-size: 14px;
  font-weight: 700;
  transition: color 0.5s ease;

  ${mobile} {
    padding: 5px 12px;
    font-size: 13px;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.035em;
  text-wrap: balance;

  ${mobile} {
    font-size: 40px;
    line-height: 1.02;
    letter-spacing: -0.03em;
  }
`;

export const HeroLead = styled.p`
  max-width: 30em;
  font-size: 20px;
  line-height: 1.5;
  color: ${colors.inkSoft};
  text-wrap: pretty;

  ${mobile} {
    font-size: 17px;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;

  ${mobile} {
    flex-direction: column;
    gap: 10px;
    margin-top: 0;
  }
`;

export const HeroNote = styled.p`
  font-size: 15px;
  color: ${colors.inkSoft};

  ${mobile} {
    font-size: 14px;
    text-align: center;
  }
`;

export const Demo = styled.div`
  flex: 0 0 400px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 22px;

  ${mobile} {
    flex: 0 0 auto;
    gap: 18px;
  }
`;

export const DemoLabel = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: 700;

  ${mobile} {
    margin-top: 22px;
  }
`;

export const DemoStack = styled.div`
  position: relative;
`;

export const DemoGhost = styled.div<{
  $opacity: number;
  $transform: string;
  $mobileTransform: string;
}>`
  position: absolute;
  inset: 0;
  border-radius: ${radius.matchCard};
  background: ${colors.white};
  opacity: ${({ $opacity }) => $opacity};
  transform: ${({ $transform }) => $transform};

  ${mobile} {
    border-radius: 26px;
    transform: ${({ $mobileTransform }) => $mobileTransform};
  }
`;

export const DemoCard = styled.article`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 14px;
  border-radius: ${radius.matchCard};
  background: ${colors.white};
  box-shadow: ${shadow.matchCard};

  ${mobile} {
    gap: 12px;
    padding: 12px;
    border-radius: 26px;
    box-shadow: 0 20px 48px rgba(26, 23, 38, 0.2);
  }
`;

export const DemoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 10px 10px;

  ${mobile} {
    gap: 6px;
    padding: 0 6px 6px;
  }
`;

export const DemoAuthor = styled.p`
  font-size: 20px;
  font-weight: 700;

  ${mobile} {
    font-size: 18px;
  }
`;

export const DemoSynopsis = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: ${colors.inkSoft};

  ${mobile} {
    font-size: 14px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const DemoActions = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 36px;
  margin-top: 6px;
`;

export const DemoButton = styled.button.attrs({ type: 'button' })<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $primary }) => ($primary ? colors.ink : colors.inkSoft)};
  font-size: ${({ $primary }) => ($primary ? '15px' : '14px')};
  font-weight: ${({ $primary }) => ($primary ? 800 : 500)};

  ${mobile} {
    gap: 6px;
    font-size: ${({ $primary }) => ($primary ? '15px' : '13px')};
  }
`;

export const DemoCircle = styled.span<{ $primary?: boolean; $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $primary }) => ($primary ? 80 : 56)}px;
  height: ${({ $primary }) => ($primary ? 80 : 56)}px;
  border-radius: ${radius.pill};
  background: ${({ $primary, $color }) => ($primary ? $color : colors.white)};
  color: ${({ $primary }) => ($primary ? colors.white : colors.ink)};
  box-shadow: ${({ $primary }) => ($primary ? shadow.love : shadow.whiteButton)};
  transition: background-color 0.4s ease;

  ${mobile} {
    width: ${({ $primary }) => ($primary ? 76 : 56)}px;
    height: ${({ $primary }) => ($primary ? 76 : 56)}px;
  }
`;

export const DemoFeedback = styled.div`
  min-height: 52px;
  display: flex;
  justify-content: center;

  ${mobile} {
    min-height: 48px;
  }
`;

export const Main = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  flex-direction: column;

  ${mobile} {
    padding: 0 20px;
  }
`;

export const Section = styled.section`
  padding-top: 96px;
  display: flex;
  flex-direction: column;
  gap: 36px;

  ${mobile} {
    padding-top: 56px;
    gap: 20px;
  }
`;

export const SectionHeading = styled.div`
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${mobile} {
    gap: 8px;
  }
`;

export const Eyebrow = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.brand};

  ${mobile} {
    font-size: 14px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 44px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-wrap: balance;

  ${mobile} {
    font-size: 30px;
    line-height: 1.08;
    letter-spacing: -0.025em;
  }
`;

export const SectionText = styled.p`
  font-size: 18px;
  line-height: 1.5;
  color: ${colors.inkSoft};
  text-wrap: pretty;

  ${mobile} {
    font-size: 16px;
  }
`;

// The canvas uses shorter copy on mobile in a few spots: each version shows only at its size.
export const OnDesktop = styled.span`
  ${mobile} {
    display: none;
  }
`;

export const OnMobile = styled.span`
  display: none;

  ${mobile} {
    display: inline;
  }
`;

export const Steps = styled.ol`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 20px;

  ${mobile} {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

export const Step = styled.li`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 32px;
  border-radius: 28px;
  background: ${colors.white};

  ${mobile} {
    flex-direction: row;
    padding: 22px 20px;
    border-radius: 24px;
  }
`;

export const StepNumber = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${radius.pill};
  background: ${colors.ink};
  color: ${colors.white};
  font-size: 17px;
  font-weight: 800;

  ${mobile} {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const StepBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;

  ${mobile} {
    gap: 6px;
  }
`;

export const StepTitle = styled.h3`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.015em;

  ${mobile} {
    font-size: 20px;
    letter-spacing: 0;
  }
`;

export const StepText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.inkSoft};

  ${mobile} {
    font-size: 15px;
  }
`;

// Decoration at the bottom of each step card; mobile leaves it out.
export const StepExtra = styled.div<{ $gap?: number }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ $gap = 6 }) => $gap}px;
  margin-top: auto;
  padding-top: 8px;

  ${mobile} {
    display: none;
  }
`;

export const MiniChip = styled.span<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: ${radius.pill};
  background: ${({ $active }) => ($active ? colors.ink : colors.appBackground)};
  color: ${({ $active }) => ($active ? colors.white : colors.ink)};
  font-size: 13px;
  font-weight: 600;
`;

export const MiniBadge = styled.span`
  padding: 6px 12px;
  border-radius: ${radius.pill};
  background: ${colors.brandBackground};
  color: ${colors.brand};
  font-size: 13px;
  font-weight: 700;
`;

export const MiniChoice = styled.span<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $primary }) => ($primary ? 52 : 40)}px;
  height: ${({ $primary }) => ($primary ? 52 : 40)}px;
  border-radius: ${radius.pill};
  background: ${({ $primary }) => ($primary ? colors.brand : colors.appBackground)};
  color: ${({ $primary }) => ($primary ? colors.white : colors.ink)};
`;

export const AlgorithmSection = styled.section`
  padding-top: 96px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 48px;

  ${mobile} {
    padding-top: 56px;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
`;

export const AlgorithmIntro = styled.div`
  flex: 1 1 340px;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  ${mobile} {
    flex: 0 0 auto;
    max-width: none;
    gap: 8px;
  }
`;

export const Strategies = styled.ul`
  flex: 1 1 520px;
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: 16px;

  ${mobile} {
    flex: 0 0 auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;

export const Strategy = styled.li<{ $background: string }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-radius: 24px;
  background: ${({ $background }) => $background};

  ${mobile} {
    gap: 6px;
    padding: 18px 16px;
    border-radius: 20px;
  }
`;

export const StrategyWhen = styled.span<{ $color: string }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $color }) => $color};

  ${mobile} {
    font-size: 12px;
  }
`;

export const StrategyName = styled.span`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;

  ${mobile} {
    font-size: 18px;
    letter-spacing: 0;
  }
`;

export const StrategyText = styled.span`
  font-size: 15px;
  line-height: 1.5;
  color: ${colors.inkSoft};

  ${mobile} {
    font-size: 14px;
    line-height: 1.45;
  }
`;

export const ShelfSection = styled.section`
  padding-top: 96px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 56px;

  ${mobile} {
    padding-top: 56px;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
`;

export const ShelfCovers = styled.div`
  flex: 1 1 440px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 20px;
  border-radius: 28px;
  background: ${colors.white};

  ${mobile} {
    flex: 0 0 auto;
    gap: 8px;
    padding: 12px;
    border-radius: 22px;
  }
`;

export const ShelfCover = styled.span<{ $color: string; $desktopOnly?: boolean }>`
  height: 170px;
  display: flex;
  align-items: flex-end;
  padding: 14px;
  border-radius: 16px;
  background: ${({ $color }) => $color};
  color: ${colors.white};
  font-size: 20px;
  font-weight: 800;
  line-height: 1;

  ${mobile} {
    display: ${({ $desktopOnly }) => ($desktopOnly ? 'none' : 'flex')};
    height: 120px;
    padding: 10px;
    border-radius: 12px;
    font-size: 14px;
  }
`;

// On mobile the heading goes above the covers and the list below them.
export const ShelfText = styled.div`
  flex: 1 1 340px;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  ${mobile} {
    display: contents;
  }
`;

export const ShelfHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  ${mobile} {
    order: -1;
    gap: 8px;
  }
`;

export const ShelfList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 17px;
  line-height: 1.45;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
    color: ${colors.success};
  }

  ${mobile} {
    font-size: 16px;
  }
`;

export const Closing = styled.section`
  margin-top: 96px;
  padding: 64px 56px;
  border-radius: 32px;
  background: ${colors.ink};
  color: ${colors.white};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  ${mobile} {
    margin-top: 56px;
    padding: 36px 24px;
    border-radius: 28px;
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }
`;

export const ClosingText = styled.div`
  flex: 1 1 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    font-size: 44px;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  p {
    font-size: 18px;
    line-height: 1.5;
    color: ${colors.inkOnDark};
  }

  ${mobile} {
    flex: 0 0 auto;
    gap: 18px;

    h2 {
      font-size: 30px;
      line-height: 1.08;
      letter-spacing: -0.025em;
    }

    p {
      font-size: 16px;
    }
  }
`;

export const ClosingActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  ${mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }
`;

export const ClosingSignUp = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 0 28px;
  border-radius: ${radius.pill};
  background: ${colors.white};
  color: ${colors.ink};
  font-size: 17px;
  font-weight: 700;
`;

export const ClosingLogin = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 0 20px;
  border-radius: ${radius.pill};
  color: ${colors.white};
  font-size: 16px;
  font-weight: 600;

  ${mobile} {
    min-height: 48px;
    font-size: 15px;
  }
`;

export const Footer = styled.footer`
  padding: 48px 0 56px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  p {
    font-size: 15px;
    color: ${colors.inkSoft};
  }

  ${mobile} {
    padding: 36px 0 44px;
    flex-direction: column;
    gap: 8px;

    p {
      font-size: 14px;
    }
  }
`;

export const FooterBrand = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

export const FooterMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${colors.ink};
  color: ${colors.white};
`;
