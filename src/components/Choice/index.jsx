import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styled from 'styled-components';
import { cores, raio, sombra } from '../../styles/tokens';
import { mola } from '../../styles/movimento';
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
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: ${raio.pilula};
  background: ${cores.fundoApp};
`;

const Opcao = styled.button.attrs({ type: 'button' })`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  border-radius: ${raio.pilula};
  background: transparent;
  color: ${cores.tinta};
  font-size: 14px;
  font-weight: ${({ $ativo }) => ($ativo ? 700 : 500)};

  span {
    position: relative;
  }
`;

// Fundo branco da opção escolhida. Desliza até a opção nova.
const Marcador = styled(motion.span)`
  position: absolute !important;
  inset: 0;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  box-shadow: ${sombra.ativo};
`;

// Escolha única entre poucas opções (nível de leitura).
export function Segmented({ id, label, opcoes, valor, onChange }) {
  return (
    <Grupo role="group" aria-labelledby={id}>
      <ChoiceLabel id={id}>{label}</ChoiceLabel>
      <Trilho>
        {opcoes.map((opcao) => (
          <Opcao key={opcao} $ativo={opcao === valor} aria-pressed={opcao === valor} onClick={() => onChange(opcao)}>
            {opcao === valor && <Marcador layoutId={`${id}Marcador`} transition={mola} />}
            <span>{opcao}</span>
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
  transition: transform 0.12s ease, opacity 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    opacity: 0.4;
  }
`;

const Valor = styled.output`
  position: relative;
  min-width: 48px;
  height: 24px;
  overflow: hidden;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  line-height: 24px;

  span {
    position: absolute;
    inset: 0;
  }
`;

const LinhaContador = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

// Contador com botões de menos e mais (livros já lidos).
// O número novo entra por baixo quando sobe e por cima quando desce.
const rolarNumero = {
  entrar: (direcao) => ({ y: direcao * 18, opacity: 0 }),
  parado: { y: 0, opacity: 1, transition: { duration: 0.18 } },
  sair: (direcao) => ({ y: direcao * -18, opacity: 0, transition: { duration: 0.18 } }),
};

export function Stepper({ id, label, valor, onChange, minimo = 0 }) {
  const [direcao, setDirecao] = useState(1);

  const mudar = (passo) => {
    setDirecao(passo);
    onChange(Math.max(minimo, valor + passo));
  };

  return (
    <LinhaContador role="group" aria-labelledby={id}>
      <ChoiceLabel id={id}>{label}</ChoiceLabel>
      <Trilho>
        <BotaoRedondo aria-label="Diminuir" disabled={valor <= minimo} onClick={() => mudar(-1)}>
          <IconMinus tamanho={18} />
        </BotaoRedondo>
        <Valor aria-live="polite">
          <AnimatePresence initial={false} custom={direcao}>
            <motion.span
              key={valor}
              custom={direcao}
              variants={rolarNumero}
              initial="entrar"
              animate="parado"
              exit="sair"
            >
              {valor}
            </motion.span>
          </AnimatePresence>
        </Valor>
        <BotaoRedondo aria-label="Aumentar" onClick={() => mudar(1)}>
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
