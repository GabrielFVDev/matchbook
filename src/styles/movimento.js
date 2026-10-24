// Curvas e transições do app. Movimento curto, com propósito: entrar suave, sair rápido.

export const curvaEntrada = [0.22, 1, 0.36, 1];
export const curvaSaida = [0.4, 0, 1, 1];

export const mola = { type: 'spring', stiffness: 380, damping: 32 };
export const molaSuave = { type: 'spring', stiffness: 260, damping: 26 };

// Troca de tela: o conteúdo novo sobe um pouco ao entrar e o antigo some rápido.
export const transicaoTela = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: curvaEntrada } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: curvaSaida } },
};

// Entrada em sequência: cada bloco aparece um pouco depois do anterior.
export const surgir = (ordem = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: curvaEntrada, delay: Math.min(ordem * 0.06, 0.36) },
  },
});

// Cartão principal de login e cadastro: sobe depois do resto da tela.
export const entradaCartao = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: curvaEntrada, delay: 0.1 } },
};

// Avisos: entram com mola e saem rápido. Quem mostra o aviso envolve em AnimatePresence.
export const animacaoAviso = {
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 30 } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15, ease: curvaSaida } },
};
