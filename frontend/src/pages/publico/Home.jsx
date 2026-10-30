import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import CalendarioBolsa from '../../components/CalendarioBolsa.jsx';
import CarregandoBolsas from '../../components/CarregandoBolsas.jsx';
import { EsqueletoCartao } from '../../components/Carregando.jsx';
import CartaoBolsa from '../../components/CartaoBolsa.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Icone from '../../components/Icone.jsx';
import { useDados } from '../../hooks/useDados.js';
import { dataMaisDias } from '../../utils/formatar.js';

/**
 * Calendário de EXEMPLO para a Home, calculado a partir da data de hoje.
 * Segue as mesmas regras do backend: data limite = prazo − tempo médio;
 * ATRASADO se já passou, PROXIMO se faltam 14 dias ou menos, OK nos restantes.
 */
function calendarioExemplo() {
  const diasPrazo = 60;
  const documentos = [
    { id: 1, nome: 'Certificado de habilitações legalizado', tempoMedioDias: 70, estado: 'POR_INICIAR' },
    { id: 2, nome: 'Passaporte', tempoMedioDias: 50, estado: 'EM_CURSO' },
    { id: 3, nome: 'Registo criminal', tempoMedioDias: 30, estado: 'CONCLUIDO' },
    { id: 4, nome: 'Atestado médico', tempoMedioDias: 15, estado: 'POR_INICIAR' },
  ].map((d) => {
    const diasRestantes = diasPrazo - d.tempoMedioDias;
    let alerta = 'OK';
    if (d.estado !== 'CONCLUIDO' && diasRestantes < 0) alerta = 'ATRASADO';
    else if (d.estado !== 'CONCLUIDO' && diasRestantes <= 14) alerta = 'PROXIMO';
    return { ...d, diasRestantes, dataLimite: dataMaisDias(diasRestantes), alerta };
  });

  return {
    bolsaId: 0,
    bolsaNome: 'Bolsa de Mestrado (exemplo)',
    pais: 'Portugal',
    prazo: dataMaisDias(diasPrazo),
    diasParaPrazo: diasPrazo,
    ganha: false,
    documentos,
    concluidos: documentos.filter((d) => d.estado === 'CONCLUIDO').length,
    temAlerta: true,
    mentoresSugeridos: [
      { id: 'ex1', nome: 'Mentora de exemplo', avaliacaoMedia: 4.8, totalAvaliacoes: 12, preco: 15000 },
    ],
  };
}

const PASSOS = [
  { icone: 'bolsa', titulo: 'Escolhe a bolsa', texto: 'Pesquisa por país, área e nível e encontra a bolsa certa para ti.', ligacao: '/bolsas', acao: 'Ver bolsas' },
  { icone: 'calendario', titulo: 'Segue o calendário', texto: 'Dizemos-te quando começar cada documento, com base no tempo médio em Angola.', ligacao: '/criar-conta', acao: 'Criar conta' },
  { icone: 'mentoria', titulo: 'Pede ajuda a um mentor', texto: 'Fala com quem já ganhou a mesma bolsa e prepara a candidatura com confiança.', ligacao: '/mentores', acao: 'Conhecer os mentores' },
];

const ESTILO_ALERTA = {
  ATRASADO: { caixa: 'border-red-200 bg-red-50', ponto: 'bg-red-500', texto: 'text-red-700' },
  PROXIMO: { caixa: 'border-orange-200 bg-orange-50', ponto: 'bg-orange-400', texto: 'text-orange-700' },
  OK: { caixa: 'border-slate-200 bg-slate-50', ponto: 'bg-azul', texto: 'text-slate-600' },
};

/** Entrada em cascata: os elementos aparecem a subir, um a seguir ao outro. */
function useEntrada() {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return {
    classe: `transition duration-500 ease-out motion-reduce:transition-none ${
      entrou ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`,
    atraso: (ms) => ({ transitionDelay: `${ms}ms` }),
  };
}
export default function Home() {
  const navegar = useNavigate();
  const entrada = useEntrada();
  const [pesquisa, setPesquisa] = useState('');
  const exemplo = useMemo(calendarioExemplo, []);
  const { dados: destaques, erro, aCarregar, recarregar } = useDados(() => api.get('/bolsas/destaque').then((r) => r.data));

  const progresso = Math.round((exemplo.concluidos / exemplo.documentos.length) * 100);
const mentorExemplo = exemplo.mentoresSugeridos[0];
  const { dados: destaques, erro, aCarregar, recarregar } = useDados(() => api.get('/bolsas/destaque').then((r) => r.data));
  function pesquisar(e) {
    e.preventDefault();
    const q = pesquisa.trim();
    navegar(q ? `/bolsas?q=${encodeURIComponent(q)}` : '/bolsas');
  }

  return (
    <>
      {/* ---------------- Apresentação */}
      <section className="relative overflow-hidden bg-azul text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-verde/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-dourado/20 blur-3xl" aria-hidden="true" />

        <div className="contentor relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-dourado">
              <Icone nome="estrela" className="h-4 w-4" /> Mais oportunidades. Um futuro melhor.
            </p>
         <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-5xl">
              Não percas uma bolsa por causa de um documento atrasado.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Encontra bolsas de estudo, recebe um calendário com as datas de cada documento
              e conta com mentores angolanos que já ganharam a bolsa que queres.
            </p>

            {/* Barra de pesquisa → página de bolsas com a pesquisa aplicada */}
            <form onSubmit={pesquisar} className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-elevado sm:flex-row" role="search">
              <label htmlFor="pesquisa-home" className="sr-only">Pesquisar bolsas</label>
              <div className="flex flex-1 items-center gap-2 px-3">
                <Icone nome="pesquisa" className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  id="pesquisa-home"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  placeholder="Ex.: Chevening, Alemanha, Erasmus…"
                  className="w-full py-2.5 text-[16px] text-slate-800 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-secundario">Procurar bolsas</button>
            </form>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5"><Icone nome="check" className="h-4 w-4 text-dourado" />Gratuito para estudantes</span>
              <span className="inline-flex items-center gap-1.5"><Icone nome="escudo" className="h-4 w-4 text-dourado" />Mentores verificados</span>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
  <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-elevado" aria-hidden="true">
    <p className="text-xs font-semibold uppercase tracking-widest text-verde">Exemplo do teu calendário</p>
    <h3 className="mt-2 text-lg font-semibold text-azul">{exemplo.bolsaNome}</h3>
    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
      <Icone nome="globo" className="h-4 w-4 text-verde" />
      {exemplo.pais} · Faltam {exemplo.diasParaPrazo} dias
    </p>

    <div className="mt-4">
      <div className="flex justify-between text-xs font-medium text-azul">
        <span>{exemplo.concluidos} de {exemplo.documentos.length} documentos concluídos</span>
        <span>{progresso}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-claro">
        <div className="h-full rounded-full bg-verde" style={{ width: `${progresso}%` }} />
      </div>
    </div>

    <ul className="mt-5 space-y-3">
      {exemplo.documentos.slice(0, 2).map((d) => {
        const est = ESTILO_ALERTA[d.alerta] ?? ESTILO_ALERTA.OK;
        return (
          <li key={d.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${est.caixa}`}>
            <span className={`h-3 w-3 shrink-0 rounded-full ${est.ponto}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-azul">{d.nome}</p>
              <p className={`text-xs font-medium ${est.texto}`}>
                {d.diasRestantes < 0 ? `Atrasado há ${Math.abs(d.diasRestantes)} dias` : `Faltam ${d.diasRestantes} dias`}
              </p>
            </div>
          </li>
        );
      })}
    </ul>

    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-azul text-xs font-semibold text-white">ME</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-azul">{mentorExemplo.nome}</p>
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <Icone nome="estrela" className="h-3 w-3 text-dourado" />
          {mentorExemplo.avaliacaoMedia.toFixed(1).replace('.', ',')} · Pode ajudar-te com este prazo
        </p>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* ---------------- Exemplo visual do calendário de documentos (o diferencial) */}
      <section className="contentor py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-verde">O nosso diferencial</p>
            <h2 className="mt-2 text-3xl font-bold">Calendário de documentos</h2>
            <p className="mt-4 text-slate-600">
              Em Angola, tratar um passaporte ou legalizar um certificado pode demorar semanas.
              Quando segues uma bolsa, calculamos a data limite para começares cada documento:
            </p>
            <p className="mt-4 rounded-xl bg-claro px-4 py-3 font-titulo font-semibold text-azul">
              <span className="text-verde-escuro">data para começar</span>
              <span className="text-slate-500"> = </span>
              <span className="text-azul">prazo da bolsa</span>
              <span className="text-slate-500"> − </span>
              <span className="text-azul">tempo médio do documento</span>
            </p>
            <p className="mt-4 rounded-xl bg-claro px-4 py-3 font-titulo text-azul">
  <span className="font-semibold text-verde-escuro">data para começar</span>{' '}
  <span className="text-slate-500">=</span>{' '}
  <span className="font-semibold">prazo da bolsa</span>{' '}
  <span className="text-slate-500">−</span>{' '}
  <span className="font-semibold">tempo médio do documento</span>
</p>
            <ul className="mt-6 space-y-3 text-[15px]">
              <li className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-red-500" />Atrasado: já devias ter começado</li>
              <li className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-orange-400" />Próximo: começa nos próximos 14 dias</li>
              <li className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-azul" />Dentro do prazo</li>
              <li className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-verde" />Concluído</li>
              <li className="flex items-center gap-3"><Icone nome="bandeira" className="h-4 w-4 text-dourado-escuro" />Prazo final da bolsa</li>
              <li className="flex items-center gap-3">
  <span className="flex h-3 w-3 items-center justify-center"><Icone nome="trofeu" className="h-4 w-4 shrink-0 text-dourado" /></span>
  Prazo final da bolsa
</li>
            </ul>
            <p className="mt-6 text-sm text-slate-500">Exemplo com datas calculadas a partir de hoje.</p>
          </div>
          <CalendarioBolsa calendario={exemplo} exemplo />
        </div>
      </section>

      {/* ---------------- Como funciona */}
      <section className="contentor pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Como funciona</h2>
          <p className="mt-3 text-slate-600">Três passos para chegares ao prazo final com tudo pronto.</p>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="cartao relative flex flex-col items-start p-5">
              <span aria-hidden="true" className="absolute right-5 top-4 font-titulo text-5xl font-bold text-azul/30">{i + 1}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-verde text-white">
                <Icone nome={p.icone} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-semibold">{p.titulo}</h3>
              <p className="mt-2 text-slate-600">{p.texto}</p>
              {i === 0 && (
                <Link to="/bolsas" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-azul hover:underline">
                  Ver bolsas <Icone nome="seta" className="h-4 w-4" />
                </Link>
              )}
            </li>
          ))}
      {PASSOS.map((p, i) => (
  <li
    key={p.titulo}
    className="cartao relative flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-elevado motion-reduce:transition-none motion-reduce:hover:translate-y-0"
  >
    <span className="absolute right-5 top-4 font-titulo text-5xl font-bold text-azul/20" aria-hidden="true">{i + 1}</span>
    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-verde text-white">
      <Icone nome={p.icone} className="h-6 w-6" />
    </span>
    <h3 className="mt-4 text-xl font-semibold">{p.titulo}</h3>
    <p className="mt-2 text-slate-600">{p.texto}</p>
    <div className="mt-auto pt-5">
      <Link to={p.ligacao} className="inline-flex items-center gap-1.5 text-sm font-semibold text-verde hover:underline">
        {p.acao} <Icone nome="seta" className="h-4 w-4" />
      </Link>
    </div>
  </li>
))}
        </ol>
      </section>

      {/* ---------------- Bolsas em destaque */}
      <section className="bg-claro/80 py-16">
        <div className="contentor">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Bolsas em destaque</h2>
              <p className="mt-2 text-slate-600">Candidaturas abertas escolhidas pela equipa AJSV.</p>
            </div>
            <Link to="/bolsas" className="btn-contorno">
              Ver todas as bolsas <Icone nome="seta" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            {aCarregar && <CarregandoBolsas />}
            {!aCarregar && erro && (
              <Aviso tipo="erro" titulo="De momento não conseguimos carregar as bolsas." className="items-center justify-between">
                <p>Tenta novamente dentro de momentos.</p>
                <button type="button" className="btn-perigo mt-3" onClick={recarregar}>Tentar novamente</button>
              </Aviso>
            )}
            {!erro && destaques && destaques.length === 0 && <p className="text-slate-500">Não há bolsas em destaque neste momento.</p>}
            {!erro && destaques && destaques.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {destaques.map((b) => <CartaoBolsa key={b.id} bolsa={b} />)}
              </div>
            )}
          </div>
  {aCarregar && (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="A carregar bolsas">
      {[1, 2, 3].map((n) => <EsqueletoCartao key={n} />)}
    </div>
  )}

  {erro && !aCarregar && (
    <Aviso
      tipo="erro"
      titulo="Não conseguimos carregar as bolsas."
      acao={<button type="button" onClick={recarregar} className="btn-contorno">Tentar novamente</button>}
    >
      {erro}
    </Aviso>
  )}

  {destaques && destaques.length === 0 && (
    <EstadoVazio icone="bolsa" titulo="Ainda não há bolsas em destaque">
      Volta em breve, estamos a preparar novas candidaturas.
    </EstadoVazio>
  )}

  {destaques && destaques.length > 0 && (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {destaques.map((b) => <CartaoBolsa key={b.id} bolsa={b} />)}
    </div>
  )}
</div>
        </div>
      </section>

      {/* ---------------- Chamada para os mentores */}
     <section className="contentor pb-10 pt-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-verde to-verde-escuro p-8 text-white sm:p-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-white">Fala com quem já ganhou a bolsa</h2>
            <p className="mt-3 max-w-xl text-white/85">
              Os nossos mentores já passaram pelo mesmo processo e foram verificados pela equipa AJSV.
              Ajudam-te com a carta de motivação, o CV, a entrevista e os documentos.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link to="/mentores" className="btn-dourado px-6 py-3 text-base">
              Conhecer os mentores <Icone nome="seta" className="h-4 w-4" />
            </Link>
            <Link
  to="/criar-conta?perfil=MENTOR"
  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-white underline decoration-white/45 underline-offset-4 transition hover:decoration-white"
>
  Ganhaste uma bolsa? Torna-te mentor <Icone nome="seta" className="h-4 w-4" />
</Link>
          </div>
        </div>
      </section>
    </>
  );
}
