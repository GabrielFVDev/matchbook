import { useMotionValue, useTransform } from "motion/react";
import { BookCover } from "../../components/BookCover";
import { Tag } from "../../components/Chip";
import { IconArrowRight, IconHeart } from "../../components/Icons";
import { BookCard, BookInfo, BookAuthor, MetaList, Synopsis, Stamp } from "./styles.module.jsx";
import { curvaSaida } from "../../styles/movimento";

// Distância (px) ou velocidade (px/s) do arraste que conta como decisão.
const LIMITE_DISTANCIA = 120;
const LIMITE_VELOCIDADE = 700;

// Entra subindo da pilha; sai voando para o lado da decisão (1 = direita, -1 = esquerda).
const variantesCarta = {
  entrar: { opacity: 0, scale: 0.92, y: 24 },
  parado: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
  sair: (direcao) => ({ x: direcao * 560, opacity: 0, transition: { duration: 0.32, ease: curvaSaida } }),
};

// Carta do livro recomendado. Dá para arrastar: direita é Amei, esquerda é Próximo.
export function SwipeCard({ livro, coresLivro, desabilitado, onDecidir }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-14, 14]);
  const opacidadeAmei = useTransform(x, [30, 130], [0, 1]);
  const opacidadeProximo = useTransform(x, [-130, -30], [1, 0]);

  const meta = [
    livro.numeroPaginas && `${livro.numeroPaginas} páginas`,
    livro.anoPublicacao,
    livro.editora
  ].filter(Boolean);

  const aoSoltar = (_, info) => {
    if (info.offset.x > LIMITE_DISTANCIA || info.velocity.x > LIMITE_VELOCIDADE) onDecidir("amei");
    else if (info.offset.x < -LIMITE_DISTANCIA || info.velocity.x < -LIMITE_VELOCIDADE) onDecidir("proximo");
  };

  return (
    <BookCard
      style={{ x, rotate }}
      drag={desabilitado ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={aoSoltar}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      variants={variantesCarta}
      initial="entrar"
      animate="parado"
      exit="sair"
    >
      <Stamp $lado="esquerda" $cor={coresLivro.capa} style={{ opacity: opacidadeAmei }} aria-hidden="true">
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
