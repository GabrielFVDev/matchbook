import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Logo } from '@/components/Logo';
import { ButtonLink } from '@/components/Button';
import { BookCover } from '@/components/BookCover';
import { ToastPill, ToastDetail } from '@/components/Toast';
import { IconArrowRight, IconCheck, IconHeart } from '@/components/Icons';
import {
  Page,
  Hero,
  TopBar,
  AccountNav,
  TopLogin,
  TopSignUp,
  HeroSection,
  Intro,
  HeroTag,
  HeroTitle,
  HeroLead,
  HeroActions,
  HeroNote,
  Demo,
  DemoLabel,
  DemoStack,
  DemoGhost,
  DemoCard,
  DemoInfo,
  DemoAuthor,
  DemoSynopsis,
  DemoActions,
  DemoButton,
  DemoCircle,
  DemoFeedback,
  Main,
  Section,
  SectionHeading,
  Eyebrow,
  SectionTitle,
  SectionText,
  OnDesktop,
  OnMobile,
  Steps,
  Step,
  StepNumber,
  StepBody,
  StepTitle,
  StepText,
  StepExtra,
  MiniChip,
  MiniBadge,
  MiniChoice,
  AlgorithmSection,
  AlgorithmIntro,
  Strategies,
  Strategy,
  StrategyWhen,
  StrategyName,
  StrategyText,
  ShelfSection,
  ShelfCovers,
  ShelfCover,
  ShelfText,
  ShelfHeading,
  ShelfList,
  Closing,
  ClosingText,
  ClosingActions,
  ClosingSignUp,
  ClosingLogin,
  Footer,
  FooterBrand,
  FooterMark,
} from './styles';
import { paths } from '@/app/paths';
import { colors, genreColors } from '@/styles/tokens';
import type { GenreName } from '@/styles/tokens';
import { toastAnimation } from '@/styles/motion';

// The demo card only cycles through these books; it never calls the API.
const demoBooks: { title: string; author: string; genre: GenreName; synopsis: string }[] = [
  {
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasia',
    synopsis:
      'Bilbo Bolseiro só queria sossego, até um mago e treze anões o arrastarem para recuperar um tesouro guardado por um dragão.',
  },
  {
    title: 'Fundação',
    author: 'Isaac Asimov',
    genre: 'Ficção Científica',
    synopsis:
      'O matemático Hari Seldon prevê a queda do Império Galáctico e cria a Fundação para encurtar os séculos de barbárie.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Distopia',
    synopsis:
      'Num Estado que vigia tudo e reescreve o passado, Winston Smith começa a duvidar do Grande Irmão.',
  },
];

type DemoChoice = 'love' | 'next';

// Each text pair is [desktop, mobile]: the canvas shortens some copy on mobile.
const strategies: {
  when: [string, string];
  name: string;
  text: [string, string];
  background: string;
  color: string;
}[] = [
  {
    when: ['No começo', 'No começo'],
    name: 'Padrão',
    text: ['Segue o gosto que você contou no cadastro.', 'Segue o gosto que você contou.'],
    background: colors.white,
    color: colors.inkSoft,
  },
  {
    when: ['Depois de alguns Próximo', 'Alguns Próximo'],
    name: 'Diversificado',
    text: [
      'Mistura gêneros novos com os seus favoritos.',
      'Mistura gêneros novos com os favoritos.',
    ],
    background: genreColors('Distopia').background,
    color: genreColors('Distopia').cover,
  },
  {
    when: ['Depois de muitos Próximo', 'Muitos Próximo'],
    name: 'Exploratório',
    text: [
      'Testa livros bem diferentes para achar o que funciona.',
      'Testa livros bem diferentes.',
    ],
    background: genreColors('Mistério').background,
    color: genreColors('Mistério').cover,
  },
  {
    when: ['Depois de alguns Amei', 'Alguns Amei'],
    name: 'Refinado',
    text: ['Foca no que já sabe que você gosta.', 'Foca no que você já gosta.'],
    background: colors.successBackground,
    color: colors.success,
  },
];

// Mobile shows only the first three covers.
const shelf: { title: string; genre: GenreName }[] = [
  { title: 'Fundação', genre: 'Ficção Científica' },
  { title: '1984', genre: 'Distopia' },
  { title: 'O Hobbit', genre: 'Fantasia' },
  { title: 'Dom Casmurro', genre: 'Romance' },
  { title: 'Morte no Nilo', genre: 'Policial' },
  { title: 'O Nome da Rosa', genre: 'Mistério' },
];

const Pair = ({ texts: [desktop, mobile] }: { texts: [string, string] }) =>
  desktop === mobile ? (
    desktop
  ) : (
    <>
      <OnDesktop>{desktop}</OnDesktop>
      <OnMobile>{mobile}</OnMobile>
    </>
  );

export default function WelcomePage() {
  const [demo, setDemo] = useState<{ index: number; answers: number; last: DemoChoice | null }>({
    index: 0,
    answers: 0,
    last: null,
  });
  const book = demoBooks[demo.index % demoBooks.length];
  const bookColors = genreColors(book.genre);

  const answer = (choice: DemoChoice) =>
    setDemo((current) => ({
      index: current.index + 1,
      answers: current.answers + 1,
      last: choice,
    }));

  const notice =
    demo.last === 'love'
      ? { title: 'Gostou?', text: 'Crie sua conta para guardar os livros que você amar.' }
      : demo.last === 'next'
        ? {
            title: 'Anotado.',
            text:
              demo.answers >= 2
                ? 'Com conta, cada resposta ensina o Matchbook.'
                : 'Bora tentar outro.',
          }
        : { title: 'É assim que funciona.', text: 'Toque em Amei ou Próximo.' };

  return (
    <Page>
      <Hero $background={bookColors.background}>
        <TopBar>
          <Logo to={paths.welcome} />
          <AccountNav aria-label="Conta">
            <TopLogin to={paths.login}>Entrar</TopLogin>
            <TopSignUp to={paths.signUp}>Criar conta</TopSignUp>
          </AccountNav>
        </TopBar>

        <HeroSection aria-labelledby="welcomeTitle">
          <Intro>
            <HeroTag $color={bookColors.cover}>Recomendação de livros, um de cada vez</HeroTag>
            <HeroTitle id="welcomeTitle">
              Seu próximo livro favorito, um match de cada vez.
            </HeroTitle>
            <HeroLead>
              Diga Amei ou Próximo. O Matchbook aprende com cada resposta e acerta mais a cada
              livro.
            </HeroLead>
            <HeroActions>
              <ButtonLink to={paths.signUp} $size="large">
                Criar conta
                <IconArrowRight size={18} />
              </ButtonLink>
              <ButtonLink to={paths.login} $variant="white" $size="large">
                Já tenho conta
              </ButtonLink>
            </HeroActions>
            <HeroNote>Leva um minuto: seus dados e o que você gosta de ler.</HeroNote>
          </Intro>

          <Demo>
            <DemoLabel>Experimente aqui</DemoLabel>
            <DemoStack>
              <DemoGhost
                aria-hidden="true"
                $opacity={0.5}
                $transform="rotate(-5deg) translate(-18px, 14px)"
                $mobileTransform="rotate(-4deg) translate(-8px, 10px)"
              />
              <DemoGhost
                aria-hidden="true"
                $opacity={0.75}
                $transform="rotate(3.5deg) translate(16px, 6px)"
                $mobileTransform="rotate(3deg) translate(8px, 5px)"
              />
              <DemoCard>
                <BookCover size="demo" title={book.title} genre={book.genre} />
                <DemoInfo>
                  <DemoAuthor>{book.author}</DemoAuthor>
                  <DemoSynopsis>{book.synopsis}</DemoSynopsis>
                </DemoInfo>
              </DemoCard>
            </DemoStack>
            <DemoActions>
              <DemoButton onClick={() => answer('next')}>
                <DemoCircle>
                  <IconArrowRight size={22} />
                </DemoCircle>
                Próximo
              </DemoButton>
              <DemoButton $primary onClick={() => answer('love')}>
                <DemoCircle $primary $color={bookColors.cover}>
                  <IconHeart size={32} />
                </DemoCircle>
                Amei
              </DemoButton>
            </DemoActions>
            <DemoFeedback aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <ToastPill key={demo.answers} $tone="light" {...toastAnimation}>
                  <IconHeart size={18} style={{ color: bookColors.cover }} />
                  <span>
                    <strong>{notice.title}</strong> <ToastDetail>{notice.text}</ToastDetail>
                  </span>
                </ToastPill>
              </AnimatePresence>
            </DemoFeedback>
          </Demo>
        </HeroSection>
      </Hero>

      <Main>
        <Section aria-labelledby="howTitle">
          <SectionHeading>
            <Eyebrow>Como funciona</Eyebrow>
            <SectionTitle id="howTitle">Três passos e você recebe o primeiro livro.</SectionTitle>
          </SectionHeading>
          <Steps>
            <Step>
              <StepNumber>1</StepNumber>
              <StepBody>
                <StepTitle>Conte seu gosto</StepTitle>
                <StepText>
                  Gênero favorito, autor preferido e quanto você lê. Tudo opcional, e dá para mudar
                  depois.
                </StepText>
                <StepExtra aria-hidden="true">
                  <MiniChip $active>Fantasia</MiniChip>
                  <MiniChip>Romance</MiniChip>
                  <MiniChip>Policial</MiniChip>
                </StepExtra>
              </StepBody>
            </Step>
            <Step>
              <StepNumber>2</StepNumber>
              <StepBody>
                <StepTitle>Amei ou Próximo</StepTitle>
                <StepText>
                  Um livro por vez. Amei guarda nos seus livros; Próximo mostra outro, sem culpa.
                </StepText>
                <StepExtra aria-hidden="true" $gap={12}>
                  <MiniChoice>
                    <IconArrowRight size={18} />
                  </MiniChoice>
                  <MiniChoice $primary>
                    <IconHeart size={22} />
                  </MiniChoice>
                </StepExtra>
              </StepBody>
            </Step>
            <Step>
              <StepNumber>3</StepNumber>
              <StepBody>
                <StepTitle>O Matchbook aprende</StepTitle>
                <StepText>
                  Cada resposta ajusta as próximas recomendações. Quanto mais você usa, mais ele
                  acerta.
                </StepText>
                <StepExtra aria-hidden="true">
                  <MiniBadge>Aprendendo seu gosto</MiniBadge>
                </StepExtra>
              </StepBody>
            </Step>
          </Steps>
        </Section>

        <AlgorithmSection aria-labelledby="algorithmTitle">
          <AlgorithmIntro>
            <Eyebrow>O algoritmo</Eyebrow>
            <SectionTitle id="algorithmTitle">Ele muda de ideia quando você muda.</SectionTitle>
            <SectionText>
              Se você pula muitos livros, ele troca de estratégia. Se ama vários, foca no que já
              sabe que você gosta.
              <OnDesktop> No seu perfil você vê em qual estratégia ele está.</OnDesktop>
            </SectionText>
          </AlgorithmIntro>
          <Strategies>
            {strategies.map((strategy) => (
              <Strategy key={strategy.name} $background={strategy.background}>
                <StrategyWhen $color={strategy.color}>
                  <Pair texts={strategy.when} />
                </StrategyWhen>
                <StrategyName>{strategy.name}</StrategyName>
                <StrategyText>
                  <Pair texts={strategy.text} />
                </StrategyText>
              </Strategy>
            ))}
          </Strategies>
        </AlgorithmSection>

        <ShelfSection aria-labelledby="shelfTitle">
          <ShelfCovers aria-hidden="true">
            {shelf.map((cover, index) => (
              <ShelfCover
                key={cover.title}
                $color={genreColors(cover.genre).cover}
                $desktopOnly={index >= 3}
              >
                {cover.title}
              </ShelfCover>
            ))}
          </ShelfCovers>
          <ShelfText>
            <ShelfHeading>
              <Eyebrow>Sua estante</Eyebrow>
              <SectionTitle id="shelfTitle">Tudo o que você amar fica guardado.</SectionTitle>
            </ShelfHeading>
            <ShelfList>
              <li>
                <IconCheck size={20} />
                Meus livros reúne cada Amei, com filtro por gênero.
              </li>
              <li>
                <IconCheck size={20} />
                Faltou um livro? Adicione ao catálogo e ele já entra na sua estante.
              </li>
              <li>
                <IconCheck size={20} />
                Páginas somadas e o gênero que você mais curte, num relance.
              </li>
            </ShelfList>
          </ShelfText>
        </ShelfSection>

        <Closing aria-labelledby="closingTitle">
          <ClosingText>
            <h2 id="closingTitle">Pronto para o primeiro match?</h2>
            <p>Crie sua conta e receba a primeira recomendação logo em seguida.</p>
          </ClosingText>
          <ClosingActions>
            <ClosingSignUp to={paths.signUp}>Criar conta</ClosingSignUp>
            <ClosingLogin to={paths.login}>Já tenho conta</ClosingLogin>
          </ClosingActions>
        </Closing>

        <Footer>
          <FooterBrand>
            <FooterMark>
              <IconHeart size={14} />
            </FooterMark>
            matchbook
          </FooterBrand>
          <p>Feito para quem ama ler.</p>
        </Footer>
      </Main>
    </Page>
  );
}
