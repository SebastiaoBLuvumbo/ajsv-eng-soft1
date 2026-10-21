import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { rotaDaArea } from '../utils/formatar.js';
import Icone from './Icone.jsx';

export const LINKS_PUBLICOS = [
  { para: '/', rotulo: 'Home', fim: true },
  { para: '/bolsas', rotulo: 'Bolsas' },
  { para: '/mentores', rotulo: 'Mentores' },
  { para: '/sobre', rotulo: 'Sobre Nós' },
];

/**
 * Menu do topo do site público.
 * No telemóvel abre num botão "Menu". Com sessão, "Entrar" e "Criar conta"
 * dão lugar a "A minha área" e "Sair".
 */
export default function MenuPublico() {
  const { utilizador, sair } = useAuth();
  const [aberto, setAberto] = useState(false);
  const local = useLocation();
  const navegar = useNavigate();

  // Fecha o menu do telemóvel ao mudar de página
  useEffect(() => {
    setAberto(false);
  }, [local.pathname]);

  function terminarSessao() {
    sair();
    navegar('/');
  }

  const classeLink = ({ isActive }) =>
    `rounded-lg px-3 py-2 font-semibold transition-colors ${isActive ? 'bg-claro text-azul' : 'text-slate-600 hover:bg-claro/60 hover:text-azul'}`;

  const botoesSessao = utilizador ? (
    <>
      <Link to={rotaDaArea(utilizador)} className="btn-primario">
        <Icone nome="utilizador" className="h-4 w-4" /> A minha área
      </Link>
      <button type="button" onClick={terminarSessao} className="btn-contorno">
        <Icone nome="sair" className="h-4 w-4" /> Sair
      </button>
    </>
  ) : (
    <>
      <Link to="/entrar" className="btn-contorno">Entrar</Link>
      <Link to="/criar-conta" className="btn-primario">Criar conta</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <nav className="contentor flex h-16 items-center justify-between gap-4" aria-label="Menu principal">
        <Link to="/" className="flex shrink-0 items-center" aria-label="AJSV – página inicial">
          <img src="/logo-marca.png" alt="AJSV" className="h-10 w-auto" />
        </Link>

        {/* Ecrã grande */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS_PUBLICOS.map((l) => (
            <NavLink key={l.para} to={l.para} end={l.fim} className={classeLink}>{l.rotulo}</NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-2 lg:flex">{botoesSessao}</div>

        {/* Telemóvel */}
        <button
          type="button"
          className="btn-contorno btn-sm lg:hidden"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-telemovel"
        >
          <Icone nome={aberto ? 'fechar' : 'menu'} className="h-5 w-5" /> Menu
        </button>
      </nav>

      {aberto && (
        <div id="menu-telemovel" className="border-t border-slate-200 bg-white lg:hidden">
          <div className="contentor flex flex-col gap-1 py-3">
            {LINKS_PUBLICOS.map((l) => (
              <NavLink key={l.para} to={l.para} end={l.fim} className={classeLink}>{l.rotulo}</NavLink>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">{botoesSessao}</div>
          </div>
        </div>
      )}
    </header>
  );
}
