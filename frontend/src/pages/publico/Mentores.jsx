import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import CartaoMentor from '../../components/CartaoMentor.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Icone from '../../components/Icone.jsx';
import ModalContratar from '../../components/ModalContratar.jsx';
import { useDados } from '../../hooks/useDados.js';

/** Passos da secção "Como funciona a mentoria". */
const PASSOS = [
  { icone: 'escudo', titulo: 'Mentores verificados', texto: 'Todos os mentores já ganharam uma bolsa e foram verificados pela equipa AJSV.' },
  { icone: 'mensagem', titulo: 'Envias o pedido', texto: 'Escolhes o mentor, descreves em que precisas de ajuda e envias o pedido.' },
  { icone: 'check', titulo: 'O mentor responde', texto: 'O mentor aceita ou recusa o pedido.' },
  { icone: 'dinheiro', titulo: 'Só pagas se aceitar', texto: 'O valor em Kz só é cobrado depois de o mentor aceitar.' },
  { icone: 'documento', titulo: 'A mentoria acontece', texto: 'Carta de motivação, CV, preparação para a entrevista e documentos.' },
  { icone: 'estrela', titulo: 'Avalias o mentor', texto: 'No fim, dás de 1 a 5 estrelas para ajudar outros estudantes a escolher.' },
];

export default function Mentores() {
  const [parametros, setParametros] = useSearchParams();
  const bolsaId = parametros.get('bolsaId') ?? '';
  const [mentorEscolhido, setMentorEscolhido] = useState(null);

  const { dados: bolsas } = useDados(() => api.get('/bolsas', { params: { todas: true } }).then((r) => r.data));
  const { dados: mentores, erro, aCarregar } = useDados(
    () => api.get('/mentores', { params: bolsaId ? { bolsaId } : {} }).then((r) => r.data),
    [bolsaId]
  );

  function filtrar(valor) {
    setParametros(valor ? { bolsaId: valor } : {}, { replace: true });
  }

  return (
    <>
      {/* ---------- Cabeçalho */}
      <section className="bg-gradient-to-br from-verde to-verde-escuro text-white">
        <div className="contentor py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-dourado">Mentorias</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-white sm:text-4xl">
            Aprende com quem já ganhou a bolsa que queres
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Mentores angolanos verificados ajudam-te a preparar uma candidatura forte, do primeiro documento à entrevista.
          </p>
          <a href="#lista-mentores" className="btn-dourado mt-8 px-6 py-3 text-base">
            Ver mentores <Icone nome="seta" className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ---------- a) Como funciona a mentoria */}
      <section className="contentor py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Como funciona a mentoria</h2>
          <p className="mt-3 text-slate-600">Simples, seguro e com pagamento só depois de o mentor aceitar.</p>
        </div>

        <ol className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="cartao flex gap-4 p-5">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-azul font-titulo font-semibold text-white">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Icone nome={p.icone} className="h-5 w-5 text-verde" /> {p.titulo}
                </h3>
                <p className="mt-1 text-[15px] text-slate-600">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Queres ser mentor? */}
        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-dourado/40 bg-dourado-claro p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-dourado text-white">
              <Icone nome="trofeu" className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-xl font-semibold">Queres ser mentor?</h3>
              <p className="text-slate-700">Se já ganhaste uma bolsa, ajuda outros estudantes e recebe por cada mentoria.</p>
            </div>
          </div>
          <Link to="/criar-conta?perfil=MENTOR" className="btn-primario shrink-0">Registar-me como mentor</Link>
        </div>
      </section>

      {/* ---------- b) Lista de mentores verificados */}
      <section id="lista-mentores" className="scroll-mt-20 bg-claro/60 py-16">
        <div className="contentor">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Mentores verificados</h2>
              <p className="mt-2 text-slate-600">Filtra pela bolsa que o mentor ganhou.</p>
            </div>
            <div className="w-full sm:w-80">
              <label htmlFor="filtro-bolsa" className="rotulo">Bolsa ganha</label>
              <select id="filtro-bolsa" className="campo" value={bolsaId} onChange={(e) => filtrar(e.target.value)}>
                <option value="">Todas as bolsas</option>
                {bolsas?.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <Aviso tipo="erro">{erro}</Aviso>
            {aCarregar && <Carregando />}
            {!aCarregar && mentores?.length === 0 && (
              <EstadoVazio icone="mentoria" titulo="Ainda não há mentores para esta bolsa">
                Experimenta escolher outra bolsa ou ver todos os mentores.
              </EstadoVazio>
            )}
            {!aCarregar && mentores?.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {mentores.map((m) => <CartaoMentor key={m.id} mentor={m} onContratar={setMentorEscolhido} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <ModalContratar mentor={mentorEscolhido} onFechar={() => setMentorEscolhido(null)} />
    </>
  );
}
