import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MenuPublico from '../components/MenuPublico.jsx';
import Rodape from '../components/Rodape.jsx';

/** Layout do site público: menu no topo, conteúdo da página e rodapé. */
export default function LayoutPublico() {
  const { pathname } = useLocation();

  // Ao mudar de página, volta ao topo
  // (com chavetas: no Chrome recente o scrollTo devolve uma Promise e o useEffect não pode devolver nada)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <MenuPublico />
      <main className="flex-1">
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}
