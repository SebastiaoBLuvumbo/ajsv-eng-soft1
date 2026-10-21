import axios from 'axios';

/**
 * Cliente HTTP para o backend Spring Boot.
 * Não há JWT: o id do utilizador (ou do mentor) vai diretamente no caminho das rotas.
 */
export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * Extrai a mensagem de erro que o backend devolve no formato { "message": "..." }.
 * Se o servidor não responder, devolve uma mensagem que ajuda a perceber o problema.
 */
export function mensagemErro(erro, alternativa = 'Ocorreu um erro inesperado. Tenta novamente.') {
  if (erro?.response?.data?.message) return erro.response.data.message;
  if (erro?.request && !erro?.response) {
    return 'Não foi possível ligar ao servidor. Confirma que o backend está a correr em http://localhost:8080.';
  }
  return alternativa;
}
