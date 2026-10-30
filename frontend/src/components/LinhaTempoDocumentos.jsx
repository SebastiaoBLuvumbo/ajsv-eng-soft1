import Icone from './Icone.jsx';
import { ESTADOS_DOCUMENTO, formatarData, textoDiasDocumento, textoPrazo } from '../utils/formatar.js';

/**
 * FUNCIONALIDADE PRINCIPAL – linha do tempo vertical do "Calendário de documentos".
 *
 * Cada documento mostra a data limite para começar (prazo da bolsa − tempo médio em Angola),
 * o tempo médio, os dias que faltam e o estado. A linha termina no prazo final (dourado).
 *
 * As cores seguem o campo "alerta" calculado pelo backend:
 *   ATRASADO → vermelho · PROXIMO → laranja · OK → azul · documento concluído → verde e riscado
 *
 * Com `editavel`, cada documento tem uma lista para mudar o estado (área do estudante).
 */
const ESTILO_ALERTA = {
  ATRASADO: { ponto: 'bg-red-500 ring-red-100', marcador: 'bg-red-500', caixa: 'border-red-200 bg-red-50/60', badge: 'border-red-200 bg-red-50 text-red-700' },
  PROXIMO: { ponto: 'bg-orange-400 ring-orange-100', marcador: 'bg-orange-500', caixa: 'border-orange-200 bg-orange-50/60', badge: 'border-orange-200 bg-orange-50 text-orange-800' },
  OK: { ponto: 'bg-azul ring-claro', marcador: 'bg-azul', caixa: 'border-slate-200 bg-white', badge: 'border-azul/15 bg-claro/60 text-azul' },
  CONCLUIDO: { ponto: 'bg-verde ring-verde-claro', marcador: 'bg-verde', caixa: 'border-verde/20 bg-verde-claro/50', badge: 'border-verde/20 bg-verde-claro text-verde' },
};

export function estiloDoDocumento(doc) {
  if (doc.estado === 'CONCLUIDO') return ESTILO_ALERTA.CONCLUIDO;
  return ESTILO_ALERTA[doc.alerta] ?? ESTILO_ALERTA.OK;
}

function textoEstadoDocumento(doc) {
  if (doc.estado === 'CONCLUIDO') return 'Concluído';
  if (doc.alerta === 'ATRASADO') return textoDiasDocumento(doc.diasRestantes);
  if (doc.alerta === 'PROXIMO') {
    if (doc.diasRestantes === 0) return 'Começa hoje';
    if (doc.diasRestantes === 1) return 'Começa amanhã';
    return `Começa em breve · faltam ${doc.diasRestantes} dias`;
  }
  return `Dentro do prazo · ${textoDiasDocumento(doc.diasRestantes).toLowerCase()}`;
}

export default function LinhaTempoDocumentos({ documentos = [], prazo, diasParaPrazo, editavel = false, onMudarEstado, aMudar }) {
  return (
    <ol className="relative">
      {/* Linha vertical que liga todos os pontos */}
      <span className="absolute bottom-6 left-[11px] top-3 w-0.5 bg-gradient-to-b from-azul/25 via-azul/20 to-dourado" aria-hidden="true" />

      {documentos.map((doc) => {
        const estilo = estiloDoDocumento(doc);
        const concluido = doc.estado === 'CONCLUIDO';
        return (
          <li key={doc.id} className="relative pb-4 pl-10">
            {/* Ponto colorido na linha */}
            <span className={`absolute left-0 top-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ${estilo.ponto}`}>
              {concluido && <Icone nome="check" className="h-3.5 w-3.5 text-white" />}
            </span>

            <div className={`rounded-xl border p-4 ${estilo.caixa}`}>
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <p className={`font-semibold text-slate-800 ${concluido ? 'text-slate-500 line-through decoration-verde/70' : ''}`}>
                    {doc.nome}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Icone nome="calendario" className="h-4 w-4 text-slate-400" />
                      <span>Começar até <strong className="font-bold text-slate-900">{formatarData(doc.dataLimite)}</strong></span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icone nome="relogio" className="h-4 w-4 text-slate-400" />
                      <span>Demora em média <strong className="font-bold text-slate-900">{doc.tempoMedioDias} {doc.tempoMedioDias === 1 ? 'dia' : 'dias'}</strong></span>
                    </span>
                  </p>
                </div>

                <div className="max-w-full">
                  <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-semibold ${estilo.badge}`}>
                    <span className={`h-2 w-2 shrink-0 rounded-full ${estilo.marcador}`} aria-hidden="true" />
                    <span>{textoEstadoDocumento(doc)}</span>
                  </span>
                </div>
              </div>

              {/* Estado do documento: lista na área do estudante, etiqueta no resto */}
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-slate-500">Estado:</span>
                {editavel ? (
                  <select
                    value={doc.estado}
                    disabled={aMudar === doc.id}
                    onChange={(e) => onMudarEstado?.(doc, e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-azul focus:border-azul focus:outline-none"
                    aria-label={`Estado de ${doc.nome}`}
                  >
                    {Object.entries(ESTADOS_DOCUMENTO).map(([valor, rotulo]) => (
                      <option key={valor} value={valor}>{rotulo}</option>
                    ))}
                  </select>
                ) : (
                  <span className="font-medium text-slate-700">{ESTADOS_DOCUMENTO[doc.estado]}</span>
                )}
              </div>
            </div>
          </li>
        );
      })}

      {/* Fim da linha: prazo final da bolsa, a dourado */}
      <li className="relative pl-10">
        <span className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-dourado ring-4 ring-dourado-claro">
          <Icone nome="bandeira" className="h-3.5 w-3.5 text-white" />
        </span>
        <div className="rounded-xl border border-dourado/40 bg-dourado-claro px-4 py-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-dourado-escuro">Prazo final da candidatura</p>
          <p className="font-titulo text-lg font-semibold text-azul">
            {formatarData(prazo)}
            {diasParaPrazo !== undefined && (
              <span className="ml-2 text-sm font-normal text-slate-600">· {textoPrazo(diasParaPrazo)}</span>
            )}
          </p>
        </div>
      </li>
    </ol>
  );
}
