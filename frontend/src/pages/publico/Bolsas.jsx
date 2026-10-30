import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import CarregandoBolsas from '../../components/CarregandoBolsas.jsx';
import CartaoBolsa from '../../components/CartaoBolsa.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Icone from '../../components/Icone.jsx';
import { useDados } from '../../hooks/useDados.js';
import { NIVEIS, TIPOS } from '../../utils/formatar.js';

const CAMPOS = ['q', 'pais', 'area', 'nivel', 'tipo'];

/**
 * Lista de bolsas com filtros. Os filtros ficam no endereço (?q=...&pais=...),
 * por isso a pesquisa da Home chega aqui já aplicada e o link pode ser partilhado.
 */
export default function Bolsas() {
  const [parametros, setParametros] = useSearchParams();
  const filtros = Object.fromEntries(CAMPOS.map((c) => [c, parametros.get(c) ?? '']));
  const [texto, setTexto] = useState(filtros.q);

  // Países e áreas para as listas de filtros
  const { dados: opcoes } = useDados(() => api.get('/bolsas/filtros').then((r) => r.data));

  // Bolsas: voltam a carregar sempre que os filtros mudam
  const chave = parametros.toString();
  const { dados: bolsas, erro, aCarregar, recarregar } = useDados(() => {
    const params = {};
    CAMPOS.forEach((c) => parametros.get(c) && (params[c] = parametros.get(c)));
    return api.get('/bolsas', { params }).then((r) => r.data);
  }, [chave]);

  // A caixa de pesquisa aplica o texto meio segundo depois de o utilizador parar de escrever
  useEffect(() => {
    if (texto === filtros.q) return undefined;
    const t = setTimeout(() => mudarFiltro('q', texto.trim()), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  // Mantém a caixa de pesquisa igual ao endereço (ex.: botão "voltar" do navegador)
  useEffect(() => {
    setTexto(filtros.q);
  }, [filtros.q]);

  function mudarFiltro(campo, valor) {
    const novos = new URLSearchParams(parametros);
    if (valor) novos.set(campo, valor);
    else novos.delete(campo);
    setParametros(novos, { replace: true });
  }

  const temFiltros = CAMPOS.some((c) => filtros[c]);

  return (
    <>
      <section className="bg-claro/70 py-12">
        <div className="contentor">
          <h1 className="text-3xl font-bold sm:text-4xl">Bolsas de estudo</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Bolsas internas e externas com candidaturas abertas. Abre uma bolsa para veres os requisitos,
            os documentos necessários e o tempo que cada um demora em Angola.
          </p>

          {/* ---------- Filtros */}
          <form className="cartao mt-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]" onSubmit={(e) => e.preventDefault()} role="search">
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="f-q" className="rotulo">Pesquisa</label>
              <div className="relative">
                <Icone nome="pesquisa" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="f-q" className="campo pl-10" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Nome, entidade ou país" />
              </div>
            </div>
            <div>
              <label htmlFor="f-pais" className="rotulo">País</label>
              <select id="f-pais" className="campo" value={filtros.pais} onChange={(e) => mudarFiltro('pais', e.target.value)}>
                <option value="">Todos</option>
                {opcoes?.paises?.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-area" className="rotulo">Área</label>
              <select id="f-area" className="campo" value={filtros.area} onChange={(e) => mudarFiltro('area', e.target.value)}>
                <option value="">Todas</option>
                {opcoes?.areas?.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-nivel" className="rotulo">Nível</label>
              <select id="f-nivel" className="campo" value={filtros.nivel} onChange={(e) => mudarFiltro('nivel', e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(NIVEIS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-tipo" className="rotulo">Tipo</label>
              <select id="f-tipo" className="campo" value={filtros.tipo} onChange={(e) => mudarFiltro('tipo', e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(TIPOS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
              </select>
            </div>
          </form>
        </div>
      </section>

      {/* ---------- Resultados */}
      <section className="contentor py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-slate-600">
            {bolsas && !aCarregar && !erro && (
              <><strong className="text-azul">{bolsas.length}</strong> {bolsas.length === 1 ? 'bolsa encontrada' : 'bolsas encontradas'}</>
            )}
          </p>
          {temFiltros && (
            <button type="button" className="btn-fantasma btn-sm" onClick={() => { setTexto(''); setParametros({}, { replace: true }); }}>
              <Icone nome="fechar" className="h-4 w-4" /> Limpar filtros
            </button>
          )}
        </div>

        {!aCarregar && erro && (
          <Aviso tipo="erro" titulo="De momento não conseguimos carregar as bolsas." className="items-center justify-between">
            <p>Tenta novamente dentro de momentos.</p>
            <button type="button" className="btn-perigo mt-3" onClick={recarregar}>Tentar novamente</button>
          </Aviso>
        )}
        {aCarregar && <CarregandoBolsas />}
        {!aCarregar && !erro && bolsas?.length === 0 && (
          <EstadoVazio icone="pesquisa" titulo="Nenhuma bolsa encontrada">
            Experimenta outra pesquisa ou limpa os filtros.
          </EstadoVazio>
        )}
        {!aCarregar && !erro && bolsas?.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bolsas.map((b) => <CartaoBolsa key={b.id} bolsa={b} />)}
          </div>
        )}
      </section>
    </>
  );
}
