import styled from 'styled-components';
import { cores, celular, raio, sombra } from '../../styles/tokens';

export const PageHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PageTitle = styled.h1`
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.03em;

  ${celular} {
    font-size: 30px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 17px;
  color: ${cores.tintaSuave};

  ${celular} {
    font-size: 15px;
  }
`;

export const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 32px;

  ${celular} {
    gap: 16px;
  }
`;

export const FormContainer = styled.form`
  flex: 999 1 560px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${celular} {
    gap: 16px;
  }
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  border-radius: ${raio.cartao};
  background: ${cores.branco};

  ${celular} {
    gap: 16px;
    padding: 22px 18px;
    border-radius: 22px;
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;

  ${celular} {
    font-size: 19px;
  }
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 18px;

  ${celular} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 12px;

    > * {
      grid-column: 1 / -1;
    }

    > [data-meia] {
      grid-column: auto;
    }
  }
`;

export const CounterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: ${cores.tintaSuave};
`;

export const SubmitRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  ${celular} {
    > * {
      flex: 1 1 100%;
    }
  }
`;

export const PreviewAside = styled.aside`
  flex: 1 1 300px;
  max-width: 360px;
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  ${celular} {
    display: none;
  }
`;

export const PreviewLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${cores.tintaSuave};
`;

export const PreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 26px;
  background: ${cores.branco};
  box-shadow: 0 18px 44px rgba(26, 23, 38, 0.1);
`;

export const PreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px 8px;

  p:first-child {
    font-size: 18px;
    font-weight: 700;
    opacity: ${({ $vazio }) => ($vazio ? 0.6 : 1)};
  }

  p:last-child {
    font-size: 13px;
    color: ${cores.tintaSuave};
  }
`;

export const MobilePreview = styled.div`
  display: none;

  ${celular} {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 10px;
    border-radius: 22px;
    background: ${cores.branco};
    box-shadow: ${sombra.leve};
  }
`;

export const MobilePreviewText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  p:first-child {
    font-size: 13px;
    font-weight: 700;
    color: ${cores.tintaSuave};
  }

  p:last-child {
    font-size: 16px;
    font-weight: 700;
    opacity: ${({ $vazio }) => ($vazio ? 0.6 : 1)};
  }
`;
