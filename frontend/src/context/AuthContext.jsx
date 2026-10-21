import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Sessão simples (sem JWT): guardamos no localStorage o utilizador devolvido
 * por POST /auth/login ou POST /auth/registo e usamos o seu id nas rotas.
 */
const CHAVE = 'ajsv_utilizador';
const AuthContext = createContext(null);

function lerSessao() {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

function gravarSessao(utilizador) {
  try {
    if (utilizador) localStorage.setItem(CHAVE, JSON.stringify(utilizador));
    else localStorage.removeItem(CHAVE);
  } catch {
    // Sem acesso ao localStorage (modo privado, etc.): a sessão fica só em memória
  }
}

export function AuthProvider({ children }) {
  const [utilizador, setUtilizador] = useState(lerSessao);

  // Inicia a sessão com o utilizador devolvido pelo backend
  const entrar = useCallback((u) => {
    gravarSessao(u);
    setUtilizador(u);
  }, []);

  const sair = useCallback(() => {
    gravarSessao(null);
    setUtilizador(null);
  }, []);

  // Atualiza alguns campos da sessão (ex.: mentorId depois de aceitar um convite)
  const atualizar = useCallback((campos) => {
    setUtilizador((atual) => {
      if (!atual) return atual;
      const novo = { ...atual, ...campos };
      gravarSessao(novo);
      return novo;
    });
  }, []);

  const valor = useMemo(() => ({ utilizador, entrar, sair, atualizar }), [utilizador, entrar, sair, atualizar]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
