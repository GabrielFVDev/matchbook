import { useState } from 'react';
import styled, { css } from 'styled-components';
import { cores, celular, coresDoGenero, nomeDoGenero, raio } from '../../styles/tokens';
import { Tag } from '../Chip';

// Medidas de cada uso da capa: altura, respiro interno e corpo do título,
// primeiro no desktop e depois no celular.
const tamanhos = {
  match: { altura: [340, 260], respiro: [24, 20], titulo: [64, 48] },
  grade: { altura: [250, 200], respiro: [16, 12], titulo: [27, 19] },
  previa: { altura: [320, 320], respiro: [20, 20], titulo: [40, 40] },
  mini: { altura: [148, 148], respiro: [10, 10], titulo: [16, 16] },
};

const Moldura = styled.div`
  position: relative;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: ${({ $tamanho }) => ($tamanho === 'mini' ? '14px' : raio.capa)};
  background: ${({ $capa }) => $capa};
  color: ${cores.branco};
  transition: background-color 0.4s ease;
  ${({ $tamanho }) => {
    const t = tamanhos[$tamanho];
    return css`
      height: ${t.altura[0]}px;
      ${celular} {
        height: ${t.altura[1]}px;
      }
    `;
  }}
  ${({ $tamanho }) =>
    $tamanho === 'mini' &&
    css`
      width: 104px;
    `}
`;

const Gerada = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $soTitulo }) => ($soTitulo ? 'flex-end' : 'space-between')};
  gap: 12px;
  ${({ $tamanho }) => {
    const t = tamanhos[$tamanho];
    return css`
      padding: ${t.respiro[0]}px;
      ${celular} {
        padding: ${t.respiro[1]}px;
      }
    `;
  }}
`;

const Titulo = styled.span`
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
  text-wrap: balance;
  opacity: ${({ $vazio }) => ($vazio ? 0.6 : 1)};
  ${({ $tamanho }) => {
    const t = tamanhos[$tamanho];
    return css`
      font-size: ${t.titulo[0]}px;
      ${celular} {
        font-size: ${t.titulo[1]}px;
      }
    `;
  }}
`;

const Imagem = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Capa do livro: usa a imagem do link quando ela carrega; sem link ou com erro,
// monta uma capa com a cor do gênero e o título.
export function BookCover({ titulo, genero, capaUrl, tamanho = 'grade', tituloVazio, children }) {
  const [urlComErro, setUrlComErro] = useState(null);
  const mostrarImagem = Boolean(capaUrl) && urlComErro !== capaUrl;
  const { capa } = coresDoGenero(genero);
  const nomeGenero = nomeDoGenero(genero) || genero;
  const textoTitulo = titulo || tituloVazio;

  return (
    <Moldura $capa={capa} $tamanho={tamanho}>
      {mostrarImagem ? (
        <Imagem
          src={capaUrl}
          alt={titulo ? `Capa de ${titulo}` : 'Capa do livro'}
          draggable={false}
          onError={() => setUrlComErro(capaUrl)}
        />
      ) : (
        <Gerada
          $tamanho={tamanho}
          $soTitulo={tamanho === 'mini' || !nomeGenero}
          role="img"
          aria-label={titulo ? `Capa de ${titulo}` : 'Capa do livro'}
        >
          {tamanho !== 'mini' && nomeGenero && (
            <Tag
              $pequena={tamanho === 'grade'}
              aria-hidden="true"
              style={children ? { maxWidth: 'calc(100% - 40px)' } : undefined}
            >
              {nomeGenero}
            </Tag>
          )}
          <Titulo $tamanho={tamanho} $vazio={!titulo} aria-hidden="true">
            {textoTitulo}
          </Titulo>
        </Gerada>
      )}
      {children}
    </Moldura>
  );
}
