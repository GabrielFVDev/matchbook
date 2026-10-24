import { useMotionValue, useTransform } from 'motion/react';
import type { PanInfo, Variants } from 'motion/react';
import { BookCover } from '@/components/BookCover';
import { Tag } from '@/components/Chip';
import { IconArrowRight, IconHeart } from '@/components/Icons';
import { BookCard, BookInfo, BookAuthor, MetaList, Synopsis, Stamp } from './styles';
import { curvaSaida } from '@/styles/motion';
import type { CoresGenero } from '@/styles/tokens';
import type { BookDto } from '@/lib/api/types';

// Distância (px) ou velocidade (px/s) do arraste que conta como decisão.
const LIMITE_DISTANCIA = 120;
const LIMITE_VELOCIDADE = 700;

// Entra subindo da pilha; sai voando para o lado da decisão (1 = direita, -1 = esquerda).
const variantesCarta: Variants = {
  entrar: { opacity: 0, scale: 0.92, y: 24 },
  parado: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
  sair: (direcao: number) => ({
    x: direcao * 560,
    opacity: 0,
    transition: { duration: 0.32, ease: curvaSaida },
  }),
};

export type Escolha = 'amei' | 'proximo';

// O livro da carta. Ela também lê "capaUrl", que o backend nunca manda (ver LikedBookItem em
// src/lib/api/types.ts); a leitura fica até a fase do backend.
export type LivroCarta = BookDto & { capaUrl?: string | null };

interface SwipeCardProps {
  livro: LivroCarta;
  coresLivro: CoresGenero;
  desabilitado?: boolean;
  onDecidir: (escolha: Escolha) => void;
}

// Carta do livro recomendado. Dá para arrastar: direita é Amei, esquerda é Próximo.
export function SwipeCard({ livro, coresLivro, desabilitado, onDecidir }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-14, 14]);
  const opacidadeAmei = useTransform(x, [30, 130], [0, 1]);
  const opacidadeProximo = useTransform(x, [-130, -30], [1, 0]);

  const meta = [
    livro.numeroPaginas && `${livro.numeroPaginas} páginas`,
    livro.anoPublicacao,
    livro.editora,
  ].filter((item): item is string | number => Boolean(item));

  const aoSoltar = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > LIMITE_DISTANCIA || info.velocity.x > LIMITE_VELOCIDADE) onDecidir('amei');
    else if (info.offset.x < -LIMITE_DISTANCIA || info.velocity.x < -LIMITE_VELOCIDADE)
      onDecidir('proximo');
  };

  return (
    <BookCard
      style={{ x, rotate }}
      drag={desabilitado ? false : 'x'}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={aoSoltar}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      variants={variantesCarta}
      initial="entrar"
      animate="parado"
      exit="sair"
    >
      <Stamp
        $lado="esquerda"
        $cor={coresLivro.capa}
        style={{ opacity: opacidadeAmei }}
        aria-hidden="true"
      >
        <IconHeart tamanho={16} />
        Amei
      </Stamp>
      <Stamp $lado="direita" style={{ opacity: opacidadeProximo }} aria-hidden="true">
        Próximo
        <IconArrowRight tamanho={16} />
      </Stamp>
      <BookCover
        tamanho="match"
        titulo={livro.titulo}
        genero={livro.genero}
        capaUrl={livro.capaUrl || livro.capa}
      />
      <BookInfo>
        <BookAuthor>{livro.autor}</BookAuthor>
        {meta.length > 0 && (
          <MetaList>
            {meta.map((item) => (
              <li key={item}>
                <Tag $fundo={coresLivro.fundo}>{item}</Tag>
              </li>
            ))}
          </MetaList>
        )}
        {livro.sinopse && <Synopsis>{livro.sinopse}</Synopsis>}
      </BookInfo>
    </BookCard>
  );
}
