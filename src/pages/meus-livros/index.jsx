import { useCallback, useEffect, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { BookCover } from "../../components/BookCover";
import { Chip, ChipCount } from "../../components/Chip";
import { ButtonLink, Button } from "../../components/Button";
import { StatGrid, StatTile } from "../../components/StatTile";
import { EmptyState } from "../../components/EmptyState";
import { Toast } from "../../components/Toast";
import { Spinner } from "../../components/Spinner";
import { IconAlert, IconHeart, IconPlus, IconRefresh, IconTrash } from "../../components/Icons";
import {
  PageHeading,
  TitleBlock,
  PageTitle,
  PageSubtitle,
  HeadingActions,
  MobileAddLink,
  FilterContainer,
  BooksGrid,
  BookCard,
  RemoveButton,
  BookInfo,
  BookAuthor,
  BookDetail,
  LoadingContainer
} from './styles.module.jsx';
import { useAuth } from "../../hooks/useAuth";
import { useCurtidos } from "../../contexts/curtidos";
import { recomendacaoService } from "../../apis/services";
import { cores, coresDoGenero, nomeDoGenero } from "../../styles/tokens";

// A API pode devolver o livro direto ou dentro de "livro"; aqui vira um formato só.
const normalizarLivro = (item) => {
  const livro = item.livro || item;
  return {
    id: item.livroId ?? livro.id ?? item.id,
    titulo: livro.titulo,
    autor: livro.autor,
    genero: nomeDoGenero(livro.genero) || livro.genero || 'Outros',
    numeroPaginas: livro.numeroPaginas,
    capaUrl: livro.capaUrl || livro.capa || livro.imagem || livro.imagemUrl,
    dataCurtida: item.dataCurtida || livro.dataCurtida
  };
};

const formatarData = (data) => (data ? new Date(data).toLocaleDateString('pt-BR') : '');

export default function MeusLivrosPage() {
  const { getCurrentUser } = useAuth();
  const { somar } = useCurtidos();
  const [usuario] = useState(() => getCurrentUser());
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [removendo, setRemovendo] = useState(null);
  const [aviso, setAviso] = useState(null);

  const carregarLivrosCurtidos = useCallback(async () => {
    if (!usuario?.id) return;
    setLoading(true);
    setError(null);

    const response = await recomendacaoService.obterLivrosCurtidos(usuario.id);

    if (response.success) {
      const livrosOrdenados = (response.data || [])
        .map(normalizarLivro)
        .sort((a, b) => new Date(b.dataCurtida) - new Date(a.dataCurtida));
      setLivros(livrosOrdenados);
    } else {
      setError(response.error || 'Erro ao carregar seus livros.');
    }
    setLoading(false);
  }, [usuario?.id]);

  useEffect(() => {
    carregarLivrosCurtidos();
  }, [carregarLivrosCurtidos]);

  const fecharAviso = useCallback(() => setAviso(null), []);

  const handleRemoverLivro = async (livro) => {
    const posicao = livros.findIndex((item) => item.id === livro.id);
    setRemovendo(livro.id);

    const response = await recomendacaoService.descurtirLivro(usuario.id, livro.id);

    if (response.success) {
      setLivros((atual) => atual.filter((item) => item.id !== livro.id));
      somar(-1);
      setAviso({ tipo: 'removido', livro, posicao, chave: Date.now() });
    } else {
      setAviso({ tipo: 'erro', mensagem: 'Não deu para remover agora.', chave: Date.now() });
    }
    setRemovendo(null);
  };

  const desfazerRemocao = async () => {
    if (aviso?.tipo !== 'removido') return;
    const { livro, posicao } = aviso;
    setAviso(null);

    const response = await recomendacaoService.curtirLivro(usuario.id, livro.id);

    if (response.success) {
      setLivros((atual) => {
        const lista = [...atual];
        lista.splice(Math.min(posicao, lista.length), 0, livro);
        return lista;
      });
      somar(1);
    } else {
      setAviso({ tipo: 'erro', mensagem: 'Não deu para desfazer.', chave: Date.now() });
    }
  };

  const contagem = livros.reduce((total, livro) => {
    total[livro.genero] = (total[livro.genero] || 0) + 1;
    return total;
  }, {});
  const generos = Object.keys(contagem);
  const filtro = filtroGenero !== 'Todos' && !contagem[filtroGenero] ? 'Todos' : filtroGenero;
  const livrosFiltrados = filtro === 'Todos' ? livros : livros.filter((livro) => livro.genero === filtro);

  const totalPaginas = livros.reduce((total, livro) => total + (Number(livro.numeroPaginas) || 0), 0);
  const generoMaisLido = generos.reduce((maior, genero) => (contagem[genero] > (contagem[maior] || 0) ? genero : maior), null);
  const coresMaisLido = generoMaisLido ? coresDoGenero(generoMaisLido) : null;

  return (
    <AppLayout
      acaoCelular={
        <MobileAddLink to="/adicionar-livro" aria-label="Adicionar livro">
          <IconPlus />
        </MobileAddLink>
      }
    >
      <PageHeading>
        <TitleBlock>
          <PageTitle>Meus livros</PageTitle>
          <PageSubtitle>Os livros que você amou, do mais recente ao mais antigo.</PageSubtitle>
        </TitleBlock>
        <HeadingActions>
          <ButtonLink to="/adicionar-livro" $variante="branco">
            <IconPlus tamanho={17} />
            Adicionar livro
          </ButtonLink>
          <ButtonLink to="/home">
            <IconHeart tamanho={17} />
            Descobrir livros
          </ButtonLink>
        </HeadingActions>
      </PageHeading>

      {loading && (
        <LoadingContainer role="status">
          <Spinner tamanho={36} cor={cores.marca} />
          Carregando seus livros
        </LoadingContainer>
      )}

      {!loading && error && (
        <EmptyState icone={<IconAlert tamanho={28} />} tom="erro" titulo="Não deu para carregar seus livros" descricao="Confira sua conexão e tente de novo.">
          <Button onClick={carregarLivrosCurtidos}>
            <IconRefresh tamanho={16} />
            Tentar de novo
          </Button>
        </EmptyState>
      )}

      {!loading && !error && livros.length === 0 && (
        <EmptyState icone={<IconHeart tamanho={30} />} titulo="Nenhum livro por aqui ainda" descricao="Dê Amei nas recomendações e os livros aparecem aqui.">
          <ButtonLink to="/home">Descobrir livros</ButtonLink>
          <ButtonLink to="/adicionar-livro" $variante="secundario">Adicionar livro</ButtonLink>
        </EmptyState>
      )}

      {!loading && !error && livros.length > 0 && (
        <>
          <StatGrid>
            <StatTile rotulo="Livros curtidos" valor={livros.length} />
            <StatTile rotulo="Páginas no total" valor={totalPaginas.toLocaleString('pt-BR')} />
            <StatTile rotulo="Gêneros diferentes" valor={generos.length} />
            {generoMaisLido && (
              <StatTile rotulo="Gênero mais curtido" valor={generoMaisLido} fundo={coresMaisLido.fundo} cor={coresMaisLido.capa} texto />
            )}
          </StatGrid>

          {generos.length > 1 && (
            <FilterContainer role="group" aria-label="Filtrar por gênero">
              {['Todos', ...generos].map((genero) => {
                const ativo = genero === filtro;
                return (
                  <Chip key={genero} $ativo={ativo} onClick={() => setFiltroGenero(genero)}>
                    {genero}
                    <ChipCount $ativo={ativo}>{genero === 'Todos' ? livros.length : contagem[genero]}</ChipCount>
                  </Chip>
                );
              })}
            </FilterContainer>
          )}

          <BooksGrid>
            {livrosFiltrados.map((livro) => (
              <BookCard key={livro.id}>
                <BookCover titulo={livro.titulo} genero={livro.genero} capaUrl={livro.capaUrl} tamanho="grade">
                  <RemoveButton
                    aria-label={`Remover ${livro.titulo} dos favoritos`}
                    onClick={() => handleRemoverLivro(livro)}
                    disabled={removendo === livro.id}
                  >
                    <span>
                      {removendo === livro.id ? <Spinner tamanho={16} /> : <IconTrash tamanho={17} />}
                    </span>
                  </RemoveButton>
                </BookCover>
                <BookInfo>
                  <BookAuthor>{livro.autor}</BookAuthor>
                  <BookDetail>
                    {[livro.numeroPaginas && `${livro.numeroPaginas} páginas`, livro.dataCurtida && `Curtido em ${formatarData(livro.dataCurtida)}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </BookDetail>
                </BookInfo>
              </BookCard>
            ))}
          </BooksGrid>
        </>
      )}

      {aviso && (
        <Toast
          chave={aviso.chave}
          onFechar={fecharAviso}
          duracao={aviso.tipo === 'removido' ? 6000 : 4000}
          acao={aviso.tipo === 'removido' ? { rotulo: 'Desfazer', onClick: desfazerRemocao } : undefined}
        >
          {aviso.tipo === 'removido' ? (
            <><strong>{aviso.livro.titulo}</strong> saiu dos seus livros.</>
          ) : (
            aviso.mensagem
          )}
        </Toast>
      )}
    </AppLayout>
  );
}
