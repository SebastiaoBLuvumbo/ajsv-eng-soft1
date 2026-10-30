import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import Estrelas from './Estrelas.jsx';
import Etiqueta from './Etiqueta.jsx';
import Icone from './Icone.jsx';
import LinhaTempoDocumentos from './LinhaTempoDocumentos.jsx';
import { formatarData, formatarKz, textoPrazo } from '../utils/formatar.js';

/**
 * Calendário completo de uma bolsa seguida (objeto Calendario do backend):
 * cabeçalho com o progresso, linha do tempo dos documentos e, quando "temAlerta" é true,
 * uma caixa de alerta com os mentores sugeridos.
 *
 * No telemóvel (e em ecrãs médios) a caixa de alerta aparece ANTES da linha do tempo; em ecrãs largos fica à direita.
 */
export default function CalendarioBolsa({
  calendario,
  editavel = false,
  onMudarEstado,
  aMudar,
  onFalarMentor, // se não existir, "Falar com o mentor" leva à página de mentores
  acoes, // botões extra no cabeçalho (ex.: "Ganhei esta bolsa")
  exemplo = false,
}) {
  const c = calendario;
  const total = c.documentos?.length ?? 0;
  const progresso = total ? Math.round((c.concluidos / total) * 100) : 0;
  const atrasados = c.documentos.filter((d) => d.estado !== 'CONCLUIDO' && d.alerta === 'ATRASADO').length;
  const proximos = c.documentos.filter((d) => d.estado !== 'CONCLUIDO' && d.alerta === 'PROXIMO').length;

  return (
    <section className="cartao overflow-hidden">
      {/* ---------- Cabeçalho */}
      <header className="border-b border-slate-100 bg-gradient-to-r from-claro/70 to-white px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {exemplo ? (
                <h3 className="text-lg font-semibold">{c.bolsaNome}</h3>
              ) : (
                <Link to={`/bolsas/${c.bolsaId}`} className="text-lg font-semibold text-azul hover:underline">
                  <h3>{c.bolsaNome}</h3>
                </Link>
              )}
              {c.ganha && (
                <Etiqueta cor="dourado">
                  <Icone nome="trofeu" className="h-3.5 w-3.5" /> Bolsa ganha
                </Etiqueta>
              )}
            </div>
            <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5"><Icone nome="globo" className="h-4 w-4" />{c.pais}</span>
              <span className="inline-flex items-center gap-1.5">
                <Icone nome="calendario" className="h-4 w-4" />Prazo: {formatarData(c.prazo)} · {textoPrazo(c.diasParaPrazo)}
              </span>
            </p>
          </div>
          {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
        </div>

        {/* Barra de progresso dos documentos */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-azul">{c.concluidos} de {total} documentos concluídos</span>
            <span className="text-slate-500">{progresso}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-verde transition-all" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      </header>

      {/* ---------- Corpo: alerta + linha do tempo */}
      <div className={`grid gap-5 p-5 ${c.temAlerta ? 'xl:grid-cols-[minmax(0,1fr)_300px]' : ''}`}>
        {c.temAlerta && (
          <aside className="xl:order-2">
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 xl:sticky xl:top-24">
              <div className="flex items-start gap-2 text-orange-800">
                <Icone nome="alerta" className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Atenção aos prazos!</p>
                  <p className="text-sm">
                    {atrasados > 0 && <>{atrasados} {atrasados === 1 ? 'documento atrasado' : 'documentos atrasados'}</>}
                    {atrasados > 0 && proximos > 0 && ' e '}
                    {proximos > 0 && <>{proximos} {proximos === 1 ? 'documento' : 'documentos'} a começar em breve</>}
                    . Um mentor que já ganhou esta bolsa pode ajudar-te a recuperar o tempo.
                  </p>
                </div>
              </div>

              {c.mentoresSugeridos?.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {c.mentoresSugeridos.map((m) => (
                    <li key={m.id} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Avatar nome={m.nome} fotoUrl={m.fotoUrl} tamanho="h-10 w-10 text-sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-azul">{m.nome}</p>
                          <Estrelas valor={m.avaliacaoMedia} total={m.totalAvaliacoes} tamanho="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="leading-tight">
  <span className="block text-base font-semibold text-verde">{formatarKz(m.preco)}</span>
  <span className="block text-xs text-slate-500">por sessão</span>
</span>
                        {onFalarMentor ? (
                          <button type="button" className="btn-secundario btn-sm" onClick={() => onFalarMentor(m, c.bolsaId)}>
                            <Icone nome="mensagem" className="h-4 w-4" /> Falar com o mentor
                          </button>
                        ) : (
                          <Link to="/mentores" className="btn-secundario btn-sm">
                            <Icone nome="mensagem" className="h-4 w-4" /> Falar com o mentor
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}

        <div className="xl:order-1">
          {total === 0 ? (
            <p className="text-slate-500">Esta bolsa não tem documentos associados.</p>
          ) : (
            <LinhaTempoDocumentos
              documentos={c.documentos}
              prazo={c.prazo}
              diasParaPrazo={c.diasParaPrazo}
              editavel={editavel && !c.ganha}
              onMudarEstado={onMudarEstado}
              aMudar={aMudar}
            />
          )}
        </div>
      </div>
    </section>
  );
}
