import styled from 'styled-components';
import { cores, celular, raio } from '../../../styles/tokens';
import { AuthSide } from '../../../components/AuthLayout';

export const CadastroSide = styled(AuthSide)`
  padding-top: 24px;

  ${celular} {
    padding-top: 0;
  }
`;

export const SideTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${celular} {
    display: none;
  }
`;

export const SideHeadline = styled.p`
  font-size: 40px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.025em;
  text-wrap: balance;
`;

export const StepList = styled.ol`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${celular} {
    display: none;
  }
`;

export const StepItem = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const StepNumber = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${raio.pilula};
  background: ${({ $estado }) =>
    $estado === 'atual' ? cores.tinta : $estado === 'feito' ? cores.sucesso : cores.branco};
  color: ${({ $estado }) => ($estado === 'proximo' ? cores.tintaSuave : cores.branco)};
  font-size: 17px;
  font-weight: 800;
`;

export const StepText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 18px;
    font-weight: 700;
    color: ${({ $apagado }) => ($apagado ? cores.tintaSuave : cores.tinta)};
  }

  span {
    font-size: 15px;
    color: ${cores.tintaSuave};
  }
`;

export const StepPills = styled.ol`
  display: none;

  ${celular} {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
  }
`;

export const StepPill = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: ${raio.pilula};
  background: ${({ $atual }) => ($atual ? cores.tinta : cores.branco)};
  color: ${({ $atual }) => ($atual ? cores.branco : cores.tintaSuave)};
  font-size: 14px;
  font-weight: ${({ $atual }) => ($atual ? 700 : 600)};

  svg {
    color: ${cores.sucesso};
  }
`;

export const PillNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${raio.pilula};
  background: ${({ $atual }) => ($atual ? cores.branco : cores.fundoApp)};
  color: ${cores.tinta};
  font-size: 12px;
  font-weight: 800;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;

  > :last-child {
    flex: 1;
  }

  ${celular} {
    flex-direction: column-reverse;
  }
`;
