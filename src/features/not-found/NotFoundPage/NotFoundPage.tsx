import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button, ButtonLink } from '@/components/Button';
import { IconArrowLeft, IconHome } from '@/components/Icons';
import {
  Page,
  TopBar,
  Main,
  Stack,
  LooseCard,
  MissingCover,
  CoverTag,
  CoverTitle,
  Message,
  Eyebrow,
  Title,
  Text,
  Actions,
} from './styles';
import { hasSession } from '@/lib/session';
import { paths } from '@/app/paths';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // "The start" is Home for whoever is logged in, and the first visit page for everyone else.
  const start = hasSession() ? paths.home : paths.welcome;

  // An address opened directly has nothing to go back to inside the app: go to the start instead.
  const goBack = () => (location.key === 'default' ? navigate(start) : navigate(-1));

  return (
    <Page>
      <TopBar>
        <Logo to={start} />
      </TopBar>
      <Main>
        <Stack aria-hidden="true">
          <LooseCard $back />
          <LooseCard />
          <MissingCover>
            <CoverTag>Mistério</CoverTag>
            <CoverTitle>
              <strong>404</strong>
              <span>O livro que sumiu da estante</span>
            </CoverTitle>
          </MissingCover>
        </Stack>
        <Message aria-labelledby="notFoundTitle">
          <Eyebrow>Página não encontrada</Eyebrow>
          <Title id="notFoundTitle">Essa página saiu da estante.</Title>
          <Text>
            O endereço pode ter mudado ou nunca ter existido. Volte ao início e a gente acha outro
            livro pra você.
          </Text>
          <Actions>
            <ButtonLink to={start} $size="large">
              <IconHome size={18} />
              Voltar ao início
            </ButtonLink>
            <Button $variant="white" $size="large" onClick={goBack}>
              <IconArrowLeft size={18} />
              Página anterior
            </Button>
          </Actions>
        </Message>
      </Main>
    </Page>
  );
}
