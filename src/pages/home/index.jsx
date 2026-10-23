import { useCallback, useEffect, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { BookCover } from "../../components/BookCover";
import { Tag } from "../../components/Chip";
import { ButtonLink, Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Spinner } from "../../components/Spinner";
import { ToastPill, ToastDetail } from "../../components/Toast";
import { IconAlert, IconArrowRight, IconBook, IconHeart, IconRefresh } from "../../components/Icons";
import {
  MatchArea,
  Intro,
  Eyebrow,
  Headline,
  Helper,
  Recommendation,
  Stack,
  GhostCard,
  BookCard,
  BookInfo,
  BookAuthor,
  MetaList,
  Synopsis,
  LoadingCard,
  Actions,
  ActionButton,
  ActionCircle,
  FeedbackArea
} from './styles.module.jsx';
import { useAuth } from "../../hooks/useAuth";
import { useCurtidos } from "../../contexts/curtidos";
import { recomendacaoService } from "../../apis/services";
import { cores, coresDoGenero } from "../../styles/tokens";

export default function HomePage() {
  const { getCurrentUser } = useAuth();
  const { somar } = useCurtidos();
  const [usuario] = useState(() => getCurrentUser());
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aviso, setAviso] = useState(null);

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

  const aceitarLivro = async () => {
    if (!currentBook || !usuario?.id || isProcessing) return;
    setIsProcessing(true);

    const responseAceitar = await recomendacaoService.aceitarLivro(usuario.id, currentBook.id);

    if (responseAceitar.success) {
      // Aceitar ensina o algoritmo; curtir guarda o livro em "Meus livros".
      const responseCurtir = await recomendacaoService.curtirLivro(usuario.id, currentBook.id);
      if (responseCurtir.success) {
        somar(1);
      } else {
        console.warn('Livro aceito, mas não foi salvo como curtido:', responseCurtir.error);
      }
      setAviso({
        tipo: 'amei',
        titulo: 'Foi pros seus livros.',
        texto: `“${currentBook.titulo}” está nos favoritos.`
      });
      await carregarProximaRecomendacao();
    } else {
      setAviso({ tipo: 'erro', titulo: 'Não deu para salvar.', texto: 'Tente de novo.' });
    }

    setIsProcessing(false);
  };

  const recusarLivro = async () => {
    if (!currentBook || !usuario?.id || isProcessing) return;
    setIsProcessing(true);

    const response = await recomendacaoService.recusarLivro(usuario.id, currentBook.id);

    if (response.success) {
      const { algoritmoAlterado, sugestao } = response.data || {};
      setAviso({
        tipo: 'proximo',
        titulo: 'Anotado.',
        texto: algoritmoAlterado && sugestao ? sugestao : 'Bora tentar outro.'
      });
      await carregarProximaRecomendacao();
    } else {
      setAviso({ tipo: 'erro', titulo: 'Não deu para registrar.', texto: 'Tente de novo.' });
    }

    setIsProcessing(false);
  };

  const coresLivro = currentBook ? coresDoGenero(currentBook.genero) : null;
  const fundo = coresLivro ? coresLivro.fundo : cores.fundoMarca;
  const destaque = coresLivro ? coresLivro.capa : cores.marca;
  const primeiroNome = usuario?.nome?.trim().split(" ")[0];

  const meta = currentBook
    ? [
        currentBook.numeroPaginas && `${currentBook.numeroPaginas} páginas`,
        currentBook.anoPublicacao,
        currentBook.editora
      ].filter(Boolean)
    : [];

  return (
    <AppLayout fundo={fundo} corDestaque={destaque}>
      <MatchArea>
        <Intro>
          <Eyebrow $cor={destaque}>{primeiroNome ? `Para você, ${primeiroNome}` : 'Para você'}</Eyebrow>
          <Headline>Achei um pra você.</Headline>
          <Helper>Amei guarda o livro nos seus favoritos. Próximo ensina ao Matchbook o que não é a sua.</Helper>
        </Intro>

        <Recommendation aria-label="Recomendação">
          {erro === 'vazio' && (
            <EmptyState
              icone={<IconBook tamanho={28} />}
              titulo="Você viu tudo por enquanto"
              descricao="Adicione um livro ao catálogo ou volte mais tarde."
            >
              <ButtonLink to="/adicionar-livro">Adicionar livro</ButtonLink>
              <ButtonLink to="/meus-livros" $variante="secundario">Ver meus livros</ButtonLink>
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
                <GhostCard aria-hidden="true" $opacidade={0.5} $transform="rotate(-5deg) translate(-18px, 14px)" />
                <GhostCard aria-hidden="true" $opacidade={0.75} $transform="rotate(3.5deg) translate(16px, 6px)" />
                <BookCard aria-busy={loading}>
                  {loading || !currentBook ? (
                    <LoadingCard role="status">
                      <Spinner tamanho={40} cor={destaque} />
                      Buscando um livro pra você
                    </LoadingCard>
                  ) : (
                    <>
                      <BookCover
                        tamanho="match"
                        titulo={currentBook.titulo}
                        genero={currentBook.genero}
                        capaUrl={currentBook.capaUrl || currentBook.capa}
                      />
                      <BookInfo>
                        <BookAuthor>{currentBook.autor}</BookAuthor>
                        {meta.length > 0 && (
                          <MetaList>
                            {meta.map((item) => (
                              <li key={item}>
                                <Tag $fundo={coresLivro.fundo}>{item}</Tag>
                              </li>
                            ))}
                          </MetaList>
                        )}
                        {currentBook.sinopse && <Synopsis>{currentBook.sinopse}</Synopsis>}
                      </BookInfo>
                    </>
                  )}
                </BookCard>
              </Stack>

              <Actions>
                <ActionButton onClick={recusarLivro} disabled={isProcessing || loading}>
                  <ActionCircle $cor={cores.branco}>
                    <IconArrowRight tamanho={24} />
                  </ActionCircle>
                  Próximo
                </ActionButton>
                <ActionButton $principal onClick={aceitarLivro} disabled={isProcessing || loading}>
                  <ActionCircle $principal $cor={destaque}>
                    <IconHeart tamanho={36} />
                  </ActionCircle>
                  Amei
                </ActionButton>
              </Actions>
            </>
          )}

          <FeedbackArea aria-live="polite">
            {aviso && (
              <ToastPill $tom="claro">
                {aviso.tipo === 'amei' && <IconHeart tamanho={18} style={{ color: destaque }} />}
                {aviso.tipo === 'proximo' && <IconArrowRight tamanho={18} />}
                {aviso.tipo === 'erro' && <IconAlert tamanho={18} style={{ color: cores.erro }} />}
                <span>
                  <strong>{aviso.titulo}</strong> <ToastDetail>{aviso.texto}</ToastDetail>
                </span>
              </ToastPill>
            )}
          </FeedbackArea>
        </Recommendation>
      </MatchArea>
    </AppLayout>
  );
}
