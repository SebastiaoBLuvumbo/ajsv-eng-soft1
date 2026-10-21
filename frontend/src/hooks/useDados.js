import { useCallback, useEffect, useState } from 'react';
import { mensagemErro } from '../api.js';

/**
 * Carrega dados do backend e controla os estados "a carregar" e "erro".
 * `carregar` é uma função que devolve uma Promise com os dados.
 * `dependencias` indica quando voltar a carregar (como no useEffect).
 */
export function useDados(carregar, dependencias = []) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [aCarregar, setACarregar] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recarregar = useCallback(async () => {
    setACarregar(true);
    setErro('');
    try {
      setDados(await carregar());
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setACarregar(false);
    }
  }, dependencias);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { dados, setDados, erro, aCarregar, recarregar };
}
