import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { PERFIS, formatarData } from '../../utils/formatar.js';

/** Dados da conta do estudante (apenas leitura). */
export default function EstudantePerfil() {
  const { utilizador: u } = useAuth();

  const linhas = [
    ['Nome', u.nome],
    ['Email', u.email],
    ['Telefone', u.telefone || '—'],
    ['Perfil', PERFIS[u.perfil]],
    ['Membro desde', formatarData(u.dataRegisto)],
  ];

  return (
    <div className="max-w-2xl space-y-5">
      <div className="cartao overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-r from-azul to-azul-medio px-6 py-6 text-white">
          <Avatar nome={u.nome} tamanho="h-16 w-16 text-xl" />
          <div>
            <p className="font-titulo text-xl font-semibold">{u.nome}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <Etiqueta cor="azul">{PERFIS[u.perfil]}</Etiqueta>
              {u.mentorId && <Etiqueta cor="dourado">Também és mentor</Etiqueta>}
            </div>
          </div>
        </div>
        <dl className="divide-y divide-slate-100">
          {linhas.map(([rotulo, valor]) => (
            <div key={rotulo} className="grid gap-1 px-6 py-3 sm:grid-cols-[160px_1fr]">
              <dt className="text-sm font-semibold text-slate-500">{rotulo}</dt>
              <dd className="text-slate-800">{valor}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-sm text-slate-500">
        Os dados da conta são apenas de leitura.
        {u.mentorId && <> Podes editar o teu perfil de mentor na <Link to="/area/mentor/perfil" className="font-semibold text-azul underline">área de mentor</Link>.</>}
      </p>
    </div>
  );
}
