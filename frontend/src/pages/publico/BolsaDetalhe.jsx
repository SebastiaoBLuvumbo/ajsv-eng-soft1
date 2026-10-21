import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import CalendarioBolsa from '../../components/CalendarioBolsa.jsx';
import Carregando from '../../components/Carregando.jsx';
import CartaoMentor from '../../components/CartaoMentor.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import Icone from '../../components/Icone.jsx';
import ModalContratar from '../../components/ModalContratar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';
import { NIVEIS, TIPOS, formatarData, textoPrazo } from '../../utils/formatar.js';

/**
 * Detalhe de uma bolsa com o botão "Quero candidatar-me":
 * - sem sessão → login e depois volta aqui (com ?candidatar=1 para continuar automaticamente)
 * - estudante  → POST /estudante/{id}/bolsas/{bolsaId}/seguir e mostra logo o calendário
 */
export default function BolsaDetalhe() {
  const { id } = useParams();
  const { utilizador } = useAuth();
  const navegar = useNavigate();
  const [parametros, setParametros] = useSearchParams();
  const [calendario, setCalendario] = useState(null);
  const [aSeguir, setASeguir] = useState(false);
  const [erroSeguir, setErroSeguir] = useState('');
  const [mentorEscolhido, setMentorEscolhido] = useState(null);
  const calendarioRef = useRef(null);

  const { dados: bolsa, erro, aCarregar } = useDados(() => api.get(`/bolsas/${id}`).then((r) => r.data), [id]);
  const { dados: mentores } = useDados(() => api.get('/mentores', { params: { bolsaId: id } }).then((r) => r.data), [id]);

  async function candidatar() {
    setErroSeguir('');
    if (!utilizador) {
      navegar('/entrar', { state: { voltarPara: `/bolsas/${id}?candidatar=1` } });
      return;
    }
    if (utilizador.perfil !== 'ESTUDANTE') {
      setErroSeguir('Só as contas de estudante podem seguir bolsas e receber o calendário de documentos.');
      return;
    }
    setASeguir(true);
    try {
      const { data } = await api.post(`/estudante/${utilizador.id}/bolsas/${id}/seguir`);
      setCalendario(data);
      setTimeout(() => calendarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (e) {
      setErroSeguir(mensagemErro(e));
    } finally {
      setASeguir(false);
    }
  }

  // Depois do login, o estudante volta com ?candidatar=1 e seguimos a bolsa automaticamente
  useEffect(() => {
    if (parametros.get('candidatar') === '1' && utilizador && bolsa) {
      setParametros({}, { replace: true });
      candidatar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bolsa, utilizador]);

  if (aCarregar) return <div className="contentor py-16"><Carregando /></div>;
  if (erro) {
    return (
      <div className="contentor py-16">
        <Aviso tipo="erro">{erro}</Aviso>
        <Link to="/bolsas" className="btn-contorno mt-6">Voltar às bolsas</Link>
      </div>
    );
  }
  if (!bolsa) return null;

  const encerrada = bolsa.diasParaPrazo < 0;
  const requisitos = (bolsa.requisitos ?? '').split('\n').map((r) => r.trim()).filter(Boolean);

  return (
    <>
      {/* ---------- Cabeçalho */}
      <section className="bg-azul text-white">
        <div className="contentor py-10">
          <Link to="/bolsas" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white">
            <Icone nome="setaEsquerda" className="h-4 w-4" /> Todas as bolsas
          </Link>
          <div className="mt-4 flex flex-wrap gap-2">
            <Etiqueta cor={bolsa.tipo === 'INTERNA' ? 'verde' : 'azul'}>Bolsa {TIPOS[bolsa.tipo]?.toLowerCase()}</Etiqueta>
            <Etiqueta cor="cinza">{NIVEIS[bolsa.nivel]}</Etiqueta>
            {bolsa.destaque && <Etiqueta cor="dourado">Destaque</Etiqueta>}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{bolsa.nome}</h1>
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-white/80">
            <span>{bolsa.entidade}</span>
            <span className="inline-flex items-center gap-1.5"><Icone nome="globo" className="h-4 w-4" />{bolsa.pais}</span>
            {bolsa.areaEstudo && <span>{bolsa.areaEstudo}</span>}
          </p>
        </div>
      </section>

      <div className="contentor grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ---------- Coluna principal */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold">Sobre a bolsa</h2>
            <p className="mt-3 whitespace-pre-line text-slate-700">{bolsa.descricao || 'Sem descrição.'}</p>
          </section>

          {requisitos.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">Requisitos</h2>
              <ul className="mt-3 space-y-2">
                {requisitos.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde-claro text-verde">
                      <Icone nome="check" className="h-3.5 w-3.5" />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold">Documentos necessários</h2>
            <p className="mt-1 text-slate-600">Tempo médio que cada documento demora a tratar em Angola.</p>
            {bolsa.documentos?.length ? (
              <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {bolsa.documentos.map((d) => (
                  <li key={d.id} className="flex items-start justify-between gap-4 px-4 py-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <Icone nome="documento" className="mt-0.5 h-5 w-5 shrink-0 text-azul" />
                      <div>
                        <p className="font-semibold text-slate-800">{d.nome}</p>
                        {d.descricao && <p className="text-sm text-slate-500">{d.descricao}</p>}
                      </div>
                    </div>
                    <Etiqueta cor="azul" className="mt-0.5">
                      <Icone nome="relogio" className="h-3.5 w-3.5" /> {d.tempoMedioDias} dias
                    </Etiqueta>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-slate-500">Esta bolsa ainda não tem documentos associados.</p>
            )}
          </section>

          {/* Calendário devolvido depois de "Quero candidatar-me" */}
          {calendario && (
            <section ref={calendarioRef} className="scroll-mt-24 space-y-4">
              <Aviso tipo="sucesso" titulo="Estás a seguir esta bolsa!">
                Este é o teu calendário de documentos. Podes atualizar o estado de cada documento na{' '}
                <Link to="/area/estudante/bolsas" className="font-semibold underline">tua área reservada</Link>.
              </Aviso>
              <CalendarioBolsa calendario={calendario} onFalarMentor={(m) => setMentorEscolhido(m)} />
            </section>
          )}

          {/* Mentores que ganharam esta bolsa */}
          <section>
            <h2 className="text-2xl font-semibold">Mentores que ganharam esta bolsa</h2>
            {mentores?.length ? (
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {mentores.map((m) => <CartaoMentor key={m.id} mentor={m} onContratar={setMentorEscolhido} />)}
              </div>
            ) : (
              <p className="mt-3 text-slate-600">
                Ainda não há mentores verificados para esta bolsa.{' '}
                <Link to="/mentores" className="font-semibold text-azul underline">Ver todos os mentores</Link>
              </p>
            )}
          </section>
        </div>

        {/* ---------- Coluna lateral: prazo e candidatura */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="cartao p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Prazo de candidatura</p>
            <p className="mt-1 font-titulo text-2xl font-semibold text-azul">{formatarData(bolsa.prazo)}</p>
            <p className={`mt-1 font-semibold ${encerrada ? 'text-slate-500' : bolsa.diasParaPrazo <= 30 ? 'text-orange-600' : 'text-verde'}`}>
              {textoPrazo(bolsa.diasParaPrazo)}
            </p>

            <button type="button" className="btn-primario mt-6 w-full py-3 text-base" onClick={candidatar} disabled={encerrada || aSeguir}>
              {encerrada ? 'Candidaturas encerradas' : aSeguir ? 'A preparar o calendário…' : 'Quero candidatar-me'}
            </button>
            {!encerrada && (
              <p className="ajuda text-center">Recebes um calendário com a data para começares cada documento.</p>
            )}
            <Aviso tipo="erro" className="mt-4">{erroSeguir}</Aviso>

            {bolsa.linkOficial && (
              <a href={bolsa.linkOficial} target="_blank" rel="noopener noreferrer" className="btn-contorno mt-4 w-full">
                <Icone nome="externo" className="h-4 w-4" /> Site oficial da bolsa
              </a>
            )}
          </div>
        </aside>
      </div>

      <ModalContratar mentor={mentorEscolhido} bolsaId={bolsa.id} onFechar={() => setMentorEscolhido(null)} />
    </>
  );
}
