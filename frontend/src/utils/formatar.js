/**
 * Funções de formatação e rótulos dos enums do backend.
 * As datas chegam no formato "aaaa-mm-dd" e os valores em Kz são inteiros.
 */

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// "2026-11-30" → "30 nov 2026" (sem passar por Date, para evitar desvios de fuso horário)
export function formatarData(iso) {
  if (!iso) return '—';
  const [a, m, d] = String(iso).split('-');
  return `${Number(d)} ${MESES[Number(m) - 1]} ${a}`;
}

// 150000 → "150.000 Kz"
export function formatarKz(valor) {
  if (valor === null || valor === undefined) return '—';
  const inteiro = Math.round(Number(valor)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${inteiro} Kz`;
}

// Texto para os dias que faltam até ao prazo de uma bolsa
export function textoPrazo(dias) {
  if (dias === null || dias === undefined) return '';
  if (dias < 0) return `Encerrada há ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'dia' : 'dias'}`;
  if (dias === 0) return 'Termina hoje';
  if (dias === 1) return 'Falta 1 dia';
  return `Faltam ${dias} dias`;
}

// Texto para os dias que faltam até à data limite para começar um documento
export function textoDiasDocumento(dias) {
  if (dias < 0) return `Atrasado há ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'dia' : 'dias'}`;
  if (dias === 0) return 'Começa hoje';
  if (dias === 1) return 'Falta 1 dia';
  return `Faltam ${dias} dias`;
}

// Iniciais para o avatar: "Ana Paula Domingos" → "AD"
export function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// Data de hoje + n dias, no formato "aaaa-mm-dd" (usado no calendário de exemplo)
export function dataMaisDias(dias) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + dias);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// ---------------------------------------------------------------- Rótulos dos enums

export const PERFIS = { ESTUDANTE: 'Estudante', MENTOR: 'Mentor', SUPERADMIN: 'SuperAdmin' };
export const TIPOS = { INTERNA: 'Interna', EXTERNA: 'Externa' };
export const NIVEIS = { LICENCIATURA: 'Licenciatura', MESTRADO: 'Mestrado', DOUTORAMENTO: 'Doutoramento' };
export const ESTADOS_DOCUMENTO = { POR_INICIAR: 'Por iniciar', EM_CURSO: 'Em curso', CONCLUIDO: 'Concluído' };

// Cada estado tem um rótulo e uma cor (usada pelo componente Etiqueta)
export const ESTADOS_MENTORIA = {
  PENDENTE: { rotulo: 'Pendente', cor: 'laranja' },
  ACEITE: { rotulo: 'Aceite', cor: 'azul' },
  RECUSADA: { rotulo: 'Recusada', cor: 'vermelho' },
  CONCLUIDA: { rotulo: 'Concluída', cor: 'verde' },
};
export const ESTADOS_MENTOR = {
  PENDENTE: { rotulo: 'Pendente', cor: 'laranja' },
  APROVADO: { rotulo: 'Aprovado', cor: 'verde' },
  REJEITADO: { rotulo: 'Rejeitado', cor: 'vermelho' },
};
export const ESTADOS_CONVITE = {
  PENDENTE: { rotulo: 'Pendente', cor: 'laranja' },
  ACEITE: { rotulo: 'Aceite', cor: 'verde' },
  RECUSADO: { rotulo: 'Recusado', cor: 'cinza' },
};

// ---------------------------------------------------------------- Área reservada

/** Caminho da área reservada de cada perfil. */
export function rotaDaArea(utilizador) {
  if (!utilizador) return '/entrar';
  if (utilizador.perfil === 'SUPERADMIN') return '/area/admin';
  if (utilizador.perfil === 'MENTOR') return '/area/mentor';
  return '/area/estudante';
}

/** Um utilizador pode entrar numa área? Estudantes com mentorId também têm a área de mentor. */
export function podeEntrarNaArea(utilizador, area) {
  if (!utilizador) return false;
  if (area === 'admin') return utilizador.perfil === 'SUPERADMIN';
  if (area === 'estudante') return utilizador.perfil === 'ESTUDANTE';
  if (area === 'mentor') return utilizador.perfil !== 'SUPERADMIN' && !!utilizador.mentorId;
  return false;
}
