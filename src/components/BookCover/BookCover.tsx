import { useState } from 'react';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { colors, mobile, genreColors, genreName, radius } from '@/styles/tokens';
import { Tag } from '@/components/Chip';

// Medidas de cada uso da capa: altura, respiro interno e corpo do título,
// primeiro no desktop e depois no celular.
const sizes = {
  match: { height: [340, 260], padding: [24, 20], titleSize: [64, 48] },
  grid: { height: [250, 200], padding: [16, 12], titleSize: [27, 19] },
  preview: { height: [320, 320], padding: [20, 20], titleSize: [40, 40] },
  mini: { height: [148, 148], padding: [10, 10], titleSize: [16, 16] },
};

type CoverSize = keyof typeof sizes;

const Frame = styled.div<{ $cover: string; $size: CoverSize }>`
  position: relative;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: ${({ $size }) => ($size === 'mini' ? '14px' : radius.cover)};
  background: ${({ $cover }) => $cover};
  color: ${colors.white};
  transition: background-color 0.4s ease;
  ${({ $size }) => {
    const t = sizes[$size];
    return css`
      height: ${t.height[0]}px;
      ${mobile} {
        height: ${t.height[1]}px;
      }
    `;
  }}
  ${({ $size }) =>
    $size === 'mini' &&
    css`
      width: 104px;
    `}
`;

const Generated = styled.div<{ $titleOnly?: boolean; $size: CoverSize }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $titleOnly }) => ($titleOnly ? 'flex-end' : 'space-between')};
  gap: 12px;
  ${({ $size }) => {
    const t = sizes[$size];
    return css`
      padding: ${t.padding[0]}px;
      ${mobile} {
        padding: ${t.padding[1]}px;
      }
    `;
  }}
`;

const Title = styled.span<{ $empty?: boolean; $size: CoverSize }>`
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
  text-wrap: balance;
  opacity: ${({ $empty }) => ($empty ? 0.6 : 1)};
  ${({ $size }) => {
    const t = sizes[$size];
    return css`
      font-size: ${t.titleSize[0]}px;
      ${mobile} {
        font-size: ${t.titleSize[1]}px;
      }
    `;
  }}
`;

const CoverImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Capa do livro: usa a imagem do link quando ela carrega; sem link ou com erro,
// monta uma capa com a cor do gênero e o título.
interface BookCoverProps {
  title?: string | null;
  genre?: string | null;
  coverUrl?: string | null;
  size?: CoverSize;
  placeholderTitle?: string;
  children?: ReactNode;
}

export function BookCover({
  title,
  genre,
  coverUrl,
  size = 'grid',
  placeholderTitle,
  children,
}: BookCoverProps) {
  const [failedUrl, setFailedUrl] = useState<string | null | undefined>(null);
  const showImage = Boolean(coverUrl) && failedUrl !== coverUrl;
  const { cover } = genreColors(genre);
  const genreLabel = genreName(genre) || genre;
  const titleText = title || placeholderTitle;

  return (
    <Frame $cover={cover} $size={size}>
      {showImage ? (
        <CoverImage
          src={coverUrl ?? undefined}
          alt={title ? `Capa de ${title}` : 'Capa do livro'}
          draggable={false}
          onError={() => setFailedUrl(coverUrl)}
        />
      ) : (
        <Generated
          $size={size}
          $titleOnly={size === 'mini' || !genreLabel}
          role="img"
          aria-label={title ? `Capa de ${title}` : 'Capa do livro'}
        >
          {size !== 'mini' && genreLabel && (
            <Tag
              $small={size === 'grid'}
              aria-hidden="true"
              style={children ? { maxWidth: 'calc(100% - 40px)' } : undefined}
            >
              {genreLabel}
            </Tag>
          )}
          <Title $size={size} $empty={!title} aria-hidden="true">
            {titleText}
          </Title>
        </Generated>
      )}
      {children}
    </Frame>
  );
}
