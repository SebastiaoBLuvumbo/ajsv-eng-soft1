import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Icone from '../components/Icone.jsx';
import MenuLateral, { tituloDaPagina } from '../components/MenuLateral.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { podeEntrarNaArea, rotaDaArea } from '../utils/formatar.js';

/**
 * Layout da área reservada (backoffice): menu lateral à esquerda e barra superior.
 *
 * Proteção das rotas:
 *  - sem sessão → vai para o login (e volta aqui depois)
 *  - página de outro perfil → volta à sua própria área
 *
 * As páginas filhas recebem, via useOutletContext(), a função `recarregarContadores`
 * para atualizar os números do menu lateral (ex.: mentores pendentes).
 */
export default function LayoutAreaReservada({ area }) {
  const { utilizador, sair } = useAuth();
  const local = useLocation();
  const navegar = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [contadores, setContadores] = useState({});
  const autorizado = podeEntrarNaArea(utilizador, area);

  // Números que aparecem no menu lateral
  const recarregarContadores = useCallback(async () => {
    if (!autorizado) return;
    try {
      if (area === 'admin') {
        const { data } = await api.get('/admin/estatisticas');
        setContadores({ mentoresPendentes: data.mentoresPendentes });
      } else if (area === 'mentor') {
        const { data } = await api.get(`/mentor/${utilizador.mentorId}/ganhos`);
        setContadores({ pedidos: data.mentoriasPendentes });
      }
    } catch {
      // Os contadores são apenas informativos: se falharem, a página continua a funcionar
    }
  }, [area, autorizado, utilizador?.mentorId]);

  useEffect(() => {
    recarregarContadores();
  }, [recarregarContadores]);

  // Fecha o menu do telemóvel e volta ao topo ao mudar de página
  useEffect(() => {
    setMenuAberto(false);
    window.scrollTo(0, 0);
  }, [local.pathname]);

  if (!utilizador) {
    return <Navigate to="/entrar" replace state={{ voltarPara: local.pathname }} />;
  }
  if (!autorizado) {
    return <Navigate to={rotaDaArea(utilizador)} replace />;
  }

  function terminarSessao() {
    sair();
    navegar('/');
  }

  return (
    <div className="min-h-screen bg-fundo">
      {/* Menu lateral fixo (ecrã grande) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <MenuLateral area={area} contadores={contadores} />
      </aside>

      {/* Menu lateral por cima do conteúdo (telemóvel) */}
      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-azul-escuro/60" onClick={() => setMenuAberto(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-elevado">
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/80 hover:bg-white/10"
              aria-label="Fechar menu"
            >
              <Icone nome="fechar" />
            </button>
            <MenuLateral area={area} contadores={contadores} onNavegar={() => setMenuAberto(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Barra superior */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="rounded-lg p-2 text-azul hover:bg-claro lg:hidden"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
            >
              <Icone nome="menu" className="h-6 w-6" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-lg font-semibold sm:text-xl">{tituloDaPagina(area, local.pathname)}</h1>
            <Link to="/" className="btn-fantasma btn-sm hidden sm:inline-flex">
              <Icone nome="externo" className="h-4 w-4" /> Ver o site
            </Link>
            <Link to="/" className="rounded-lg p-2 text-azul hover:bg-claro sm:hidden" aria-label="Ver o site">
              <Icone nome="externo" className="h-5 w-5" />
            </Link>
            <button type="button" onClick={terminarSessao} className="btn-contorno btn-sm">
              <Icone nome="sair" className="h-4 w-4" /> Sair
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet context={{ recarregarContadores }} />
        </main>
      </div>
    </div>
  );
}
