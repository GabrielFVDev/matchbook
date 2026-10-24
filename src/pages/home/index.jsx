import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppLayout } from '../../components/AppLayout';
import { ButtonLink, Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { ToastPill, ToastDetail } from '../../components/Toast';
import {
  IconAlert,
  IconArrowRight,
  IconBook,
  IconHeart,
  IconRefresh,
} from '../../components/Icons';
import { SwipeCard } from './SwipeCard';
import {
  MatchArea,
  Intro,
  Eyebrow,
  Headline,
  Helper,
  Recommendation,
  Stack,
  GhostCard,
  LoadingCard,
  Actions,
  ActionButton,
  ActionCircle,
  HeartBeat,
  FeedbackArea,
  Hint,
} from './styles.module.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useCurtidos } from '../../contexts/curtidos';
import { recomendacaoService } from '../../apis/services';
import { cores, coresDoGenero } from '../../styles/tokens';
import { animacaoAviso, surgir } from '../../styles/movimento';

const TEMPO_AVISO = 3500;

export default function HomePage() {
  const { getCurrentUser } = useAuth();
  const { somar } = useCurtidos();
  const [usuario] = useState(() => getCurrentUser());
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aviso, setAviso] = useState(null);
  // Lado para onde a carta sai: 1 é direita (Amei), -1 é esquerda (Próximo).
  const [direcao, setDirecao] = useState(1);
  const [batidas, setBatidas] = useState(0);
  const [decisoes, setDecisoes] = useState(0);

  const carregarProximaRecomendacao = useCallback(async () => {
    if (!usuario?.id) return;

    setLoading(true);
    setErro(null);

    const response = await recomendacaoService.obterRecomendacaoAdaptativa(usuario.id);

    if (response.success && response.data?.length > 0) {
      // A API devolve uma lista; mostramos o primeiro livro dela.
      setCurrentBook(response.data[0]);
    } else {
      setCurrentBook(null);
      setErro(response.success ? 'vazio' : 'falha');
    }
    setLoading(false);
  }, [usuario?.id]);

  useEffect(() => {
    carregarProximaRecomendacao();
  }, [carregarProximaRecomendacao]);

  // O aviso some sozinho; um aviso novo reinicia a contagem.
  useEffect(() => {
    if (!aviso) return undefined;
    const timer = setTimeout(() => setAviso(null), TEMPO_AVISO);
    return () => clearTimeout(timer);
  }, [aviso]);

  // A carta sai na hora; se a API falhar, ela volta para a pilha.
  const decidir = async (escolha) => {
    if (!currentBook || !usuario?.id || isProcessing) return;
    const livro = currentBook;
    const amei = escolha === 'amei';

    setDirecao(amei ? 1 : -1);
    setDecisoes((n) => n + 1);
    if (amei) setBatidas((n) => n + 1);
    setIsProcessing(true);
    setCurrentBook(null);

    if (amei) {
      const responseAceitar = await recomendacaoService.aceitarLivro(usuario.id, livro.id);
      if (responseAceitar.success) {
        // Aceitar ensina o algoritmo; curtir guarda o livro em "Meus livros".
        const responseCurtir = await recomendacaoService.curtirLivro(usuario.id, livro.id);
        if (responseCurtir.success) {
          somar(1);
        } else {
          console.warn('Livro aceito, mas não foi salvo como curtido:', responseCurtir.error);
        }
        setAviso({
          tipo: 'amei',
          titulo: 'Foi pros seus livros.',
          texto: `“${livro.titulo}” está nos favoritos.`,
          chave: Date.now(),
        });
        await carregarProximaRecomendacao();
      } else {
        setCurrentBook(livro);
        setAviso({
          tipo: 'erro',
          titulo: 'Não deu para salvar.',
          texto: 'Tente de novo.',
          chave: Date.now(),
        });
      }
    } else {
      const response = await recomendacaoService.recusarLivro(usuario.id, livro.id);
      if (response.success) {
        const { algoritmoAlterado, sugestao } = response.data || {};
        setAviso({
          tipo: 'proximo',
          titulo: 'Anotado.',
          texto: algoritmoAlterado && sugestao ? sugestao : 'Bora tentar outro.',
          chave: Date.now(),
        });
        await carregarProximaRecomendacao();
      } else {
        setCurrentBook(livro);
        setAviso({
          tipo: 'erro',
          titulo: 'Não deu para registrar.',
          texto: 'Tente de novo.',
          chave: Date.now(),
        });
      }
    }

    setIsProcessing(false);
  };

  // Setas do teclado: direita é Amei, esquerda é Próximo.
  const decidirRef = useRef(decidir);
  useEffect(() => {
    decidirRef.current = decidir;
  });

  useEffect(() => {
    const aoTeclar = (evento) => {
      if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
      if (evento.target.closest?.('input, textarea, select, [role="dialog"]')) return;
      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        decidirRef.current('amei');
      } else if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        decidirRef.current('proximo');
      }
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);

  const coresLivro = currentBook ? coresDoGenero(currentBook.genero) : null;
  const fundo = coresLivro ? coresLivro.fundo : cores.fundoMarca;
  const destaque = coresLivro ? coresLivro.capa : cores.marca;
  const primeiroNome = usuario?.nome?.trim().split(' ')[0];
  const semCarta = !currentBook || loading;

  return (
    <AppLayout fundo={fundo} corDestaque={destaque}>
      <MatchArea>
        <Intro>
          <Eyebrow $cor={destaque} {...surgir(0)}>
            {primeiroNome ? `Para você, ${primeiroNome}` : 'Para você'}
          </Eyebrow>
          <Headline {...surgir(1)}>Achei um pra você.</Headline>
          <Helper {...surgir(2)}>
            Amei guarda o livro nos seus favoritos. Próximo ensina ao Matchbook o que não é a sua.
          </Helper>
        </Intro>

        <Recommendation aria-label="Recomendação">
          {erro === 'vazio' && (
            <EmptyState
              icone={<IconBook tamanho={28} />}
              titulo="Você viu tudo por enquanto"
              descricao="Adicione um livro ao catálogo ou volte mais tarde."
            >
              <ButtonLink to="/adicionar-livro">Adicionar livro</ButtonLink>
              <ButtonLink to="/meus-livros" $variante="secundario">
                Ver meus livros
              </ButtonLink>
            </EmptyState>
          )}

          {erro === 'falha' && (
            <EmptyState
              icone={<IconAlert tamanho={28} />}
              tom="erro"
              titulo="Não deu para buscar um livro"
              descricao="Confira sua conexão e tente de novo."
            >
              <Button onClick={carregarProximaRecomendacao}>
                <IconRefresh tamanho={16} />
                Tentar de novo
              </Button>
            </EmptyState>
          )}

          {!erro && (
            <>
              <Stack>
                <GhostCard
                  aria-hidden="true"
                  $opacidade={0.5}
                  $transform="rotate(-5deg) translate(-18px, 14px)"
                />
                <GhostCard
                  aria-hidden="true"
                  $opacidade={0.75}
                  $transform="rotate(3.5deg) translate(16px, 6px)"
                />
                <AnimatePresence mode="wait" custom={direcao} initial={false}>
                  {semCarta ? (
                    <LoadingCard
                      key="carregando"
                      role="status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.2 } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      <Spinner tamanho={40} cor={destaque} />
                      Buscando um livro pra você
                    </LoadingCard>
                  ) : (
                    <SwipeCard
                      key={currentBook.id}
                      livro={currentBook}
                      coresLivro={coresLivro}
                      desabilitado={isProcessing}
                      onDecidir={decidir}
                    />
                  )}
                </AnimatePresence>
              </Stack>

              <Actions>
                <ActionButton
                  onClick={() => decidir('proximo')}
                  disabled={isProcessing || semCarta}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ActionCircle $cor={cores.branco}>
                    <IconArrowRight tamanho={24} />
                  </ActionCircle>
                  Próximo
                </ActionButton>
                <ActionButton
                  $principal
                  onClick={() => decidir('amei')}
                  disabled={isProcessing || semCarta}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ActionCircle $principal $cor={destaque}>
                    <HeartBeat
                      key={batidas}
                      initial={batidas ? { scale: 1.5 } : false}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                    >
                      <IconHeart tamanho={36} />
                    </HeartBeat>
                  </ActionCircle>
                  Amei
                </ActionButton>
              </Actions>
            </>
          )}

          <FeedbackArea aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {aviso ? (
                <ToastPill key={aviso.chave} $tom="claro" {...animacaoAviso}>
                  {aviso.tipo === 'amei' && <IconHeart tamanho={18} style={{ color: destaque }} />}
                  {aviso.tipo === 'proximo' && <IconArrowRight tamanho={18} />}
                  {aviso.tipo === 'erro' && (
                    <IconAlert tamanho={18} style={{ color: cores.erro }} />
                  )}
                  <span>
                    <strong>{aviso.titulo}</strong> <ToastDetail>{aviso.texto}</ToastDetail>
                  </span>
                </ToastPill>
              ) : (
                !erro &&
                decisoes === 0 && (
                  <Hint
                    key="dica"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>Dica: arraste a carta ou use as setas ← e → do teclado.</span>
                    <span>Dica: arraste a carta para os lados.</span>
                  </Hint>
                )
              )}
            </AnimatePresence>
          </FeedbackArea>
        </Recommendation>
      </MatchArea>
    </AppLayout>
  );
}
