import styled from 'styled-components';
import { cores, raio, sombra } from '../../styles/tokens';
import { IconMinus, IconPlus } from '../Icons';

export const ChoiceLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
`;

const Grupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const Trilho = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: ${raio.pilula};
  background: ${cores.fundoApp};
`;

const Opcao = styled.button.attrs({ type: 'button' })`
  flex: 1 1 0;
  min-width: 0;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  border-radius: ${raio.pilula};
  background: ${({ $ativo }) => ($ativo ? cores.branco : 'transparent')};
  box-shadow: ${({ $ativo }) => ($ativo ? sombra.ativo : 'none')};
  color: ${cores.tinta};
  font-size: 14px;
  font-weight: ${({ $ativo }) => ($ativo ? 700 : 500)};
`;

// Escolha única entre poucas opções (nível de leitura).
export function Segmented({ id, label, opcoes, valor, onChange }) {
  return (
    <Grupo role="group" aria-labelledby={id}>
      <ChoiceLabel id={id}>{label}</ChoiceLabel>
      <Trilho>
        {opcoes.map((opcao) => (
          <Opcao key={opcao} $ativo={opcao === valor} aria-pressed={opcao === valor} onClick={() => onChange(opcao)}>
            {opcao}
          </Opcao>
        ))}
      </Trilho>
    </Grupo>
  );
}

const BotaoRedondo = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  color: ${cores.tinta};
`;

const Valor = styled.output`
  min-width: 48px;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
`;

const LinhaContador = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

// Contador com botões de menos e mais (livros já lidos).
export function Stepper({ id, label, valor, onChange, minimo = 0 }) {
  return (
    <LinhaContador role="group" aria-labelledby={id}>
      <ChoiceLabel id={id}>{label}</ChoiceLabel>
      <Trilho>
        <BotaoRedondo aria-label="Diminuir" disabled={valor <= minimo} onClick={() => onChange(Math.max(minimo, valor - 1))}>
          <IconMinus tamanho={18} />
        </BotaoRedondo>
        <Valor aria-live="polite">{valor}</Valor>
        <BotaoRedondo aria-label="Aumentar" onClick={() => onChange(valor + 1)}>
          <IconPlus tamanho={18} />
        </BotaoRedondo>
      </Trilho>
    </LinhaContador>
  );
}

const LinhaInterruptor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${cores.fundoApp};
`;

const TextoInterruptor = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const Trilha = styled.button.attrs({ type: 'button', role: 'switch' })`
  flex: 0 0 auto;
  display: flex;
  width: 52px;
  height: 32px;
  padding: 4px;
  border: 0;
  border-radius: ${raio.pilula};
  background: ${({ $ligado }) => ($ligado ? cores.marca : cores.desligado)};
  transition: background-color 0.15s ease;

  span {
    width: 24px;
    height: 24px;
    border-radius: ${raio.pilula};
    background: ${cores.branco};
    box-shadow: 0 1px 3px rgba(26, 23, 38, 0.25);
    transform: translateX(${({ $ligado }) => ($ligado ? '20px' : '0')});
    transition: transform 0.15s ease;
  }
`;

// Interruptor liga e desliga (receber recomendações).
export function Switch({ id, label, ligado, onChange }) {
  return (
    <LinhaInterruptor>
      <TextoInterruptor id={id}>{label}</TextoInterruptor>
      <Trilha $ligado={ligado} aria-checked={ligado} aria-labelledby={id} onClick={() => onChange(!ligado)}>
        <span />
      </Trilha>
    </LinhaInterruptor>
  );
}
