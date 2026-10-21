import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PERFIS } from '../utils/formatar.js';
import Avatar from './Avatar.jsx';
import Icone from './Icone.jsx';

/**
 * Opções do menu lateral de cada área.
 * `contador` indica qual dos contadores do layout aparece como número ao lado da opção.
 */
export const MENUS = {
  estudante: [
    { para: '/area/estudante', rotulo: 'Início', icone: 'inicio', fim: true },
    { para: '/area/estudante/bolsas', rotulo: 'As minhas bolsas', icone: 'calendario' },
    { para: '/area/estudante/mentorias', rotulo: 'Mentorias', icone: 'mentoria' },
    { para: '/area/estudante/perfil', rotulo: 'Perfil', icone: 'utilizador' },
  ],
  mentor: [
    { para: '/area/mentor', rotulo: 'Início', icone: 'inicio', fim: true },
    { para: '/area/mentor/pedidos', rotulo: 'Pedidos', icone: 'caixa', contador: 'pedidos' },
    { para: '/area/mentor/em-curso', rotulo: 'Em curso', icone: 'mensagem' },
    { para: '/area/mentor/historico', rotulo: 'Histórico', icone: 'historico' },
    { para: '/area/mentor/perfil', rotulo: 'Perfil', icone: 'utilizador' },
  ],
  admin: [
    { para: '/area/admin', rotulo: 'Dashboard', icone: 'grafico', fim: true },
    { para: '/area/admin/bolsas', rotulo: 'Bolsas', icone: 'bolsa' },
    { para: '/area/admin/documentos', rotulo: 'Documentos', icone: 'documento' },
    { para: '/area/admin/mentores', rotulo: 'Mentores', icone: 'escudo', contador: 'mentoresPendentes' },
    { para: '/area/admin/utilizadores', rotulo: 'Utilizadores', icone: 'mentoria' },
    { para: '/area/admin/convites', rotulo: 'Convites', icone: 'convite' },
  ],
};

const NOMES_AREA = { estudante: 'Área do estudante', mentor: 'Área do mentor', admin: 'Administração' };

/** Título da página atual, a partir das opções do menu. */
export function tituloDaPagina(area, caminho) {
  const limpo = caminho.replace(/\/+$/, '');
  const item = MENUS[area].find((i) => i.para === limpo) ?? MENUS[area].find((i) => !i.fim && limpo.startsWith(i.para));
  return item?.rotulo ?? NOMES_AREA[area];
}

export default function MenuLateral({ area, contadores = {}, onNavegar }) {
  const { utilizador } = useAuth();

  const classeLink = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold transition-colors ${
      isActive ? 'bg-white text-azul shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;

  // Um estudante que aceitou o convite (tem mentorId) pode alternar entre as duas áreas
  const temAreaMentor = utilizador?.perfil === 'ESTUDANTE' && utilizador?.mentorId;

  return (
    <div className="flex h-full flex-col bg-azul text-white">
      {/* Logotipo */}
      <div className="px-5 pb-4 pt-5">
        <Link to="/" onClick={onNavegar} className="inline-block rounded-xl bg-white px-3 py-2" aria-label="Ir para o site">
          <img src="/logo-marca.png" alt="AJSV" className="h-9 w-auto" />
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-dourado">{NOMES_AREA[area]}</p>
      </div>

      {/* Utilizador e perfil */}
      <div className="mx-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
        <Avatar nome={utilizador?.nome} tamanho="h-10 w-10 text-sm" />
        <div className="min-w-0">
          <p className="truncate font-semibold">{utilizador?.nome}</p>
          <p className="text-sm text-white/70">
            {PERFIS[utilizador?.perfil]}
            {utilizador?.perfil === 'ESTUDANTE' && utilizador?.mentorId && ' · Mentor'}
          </p>
        </div>
      </div>

      {/* Opções */}
      <nav className="mt-5 flex-1 space-y-1 overflow-y-auto px-4" aria-label="Menu da área reservada">
        {MENUS[area].map((item) => {
          const numero = item.contador ? contadores[item.contador] : 0;
          return (
            <NavLink key={item.para} to={item.para} end={item.fim} className={classeLink} onClick={onNavegar}>
              <Icone nome={item.icone} className="h-5 w-5" />
              <span className="flex-1">{item.rotulo}</span>
              {numero > 0 && (
                <span className="min-w-[1.5rem] rounded-full bg-dourado px-1.5 text-center text-xs font-bold leading-6 text-azul-escuro">
                  {numero}
                </span>
              )}
            </NavLink>
          );
        })}

        {temAreaMentor && (
          <div className="mt-4 border-t border-white/10 pt-4">
            {area === 'estudante' ? (
              <NavLink to="/area/mentor" className={classeLink} onClick={onNavegar}>
                <Icone nome="escudo" className="h-5 w-5" /> Área de mentor
              </NavLink>
            ) : (
              <NavLink to="/area/estudante" className={classeLink} onClick={onNavegar}>
                <Icone nome="bolsa" className="h-5 w-5" /> Área de estudante
              </NavLink>
            )}
          </div>
        )}
      </nav>

      <p className="px-5 py-4 text-xs text-white/50">Mais oportunidades. Um futuro melhor.</p>
    </div>
  );
}
