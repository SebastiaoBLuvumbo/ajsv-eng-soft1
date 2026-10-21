import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import CartaoEstatistica from '../../components/CartaoEstatistica.jsx';
import Icone from '../../components/Icone.jsx';
import { useDados } from '../../hooks/useDados.js';
import { formatarKz } from '../../utils/formatar.js';

/** Dashboard do SuperAdmin, com o valor movimentado em destaque. */
export default function AdminDashboard() {
  const { dados: e, erro, aCarregar } = useDados(() => api.get('/admin/estatisticas').then((r) => r.data));

  if (aCarregar && !e) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!e) return null;

  const taxaConclusao = e.totalMentorias ? Math.round((e.mentoriasConcluidas / e.totalMentorias) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Valor movimentado em destaque */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-azul to-azul-medio p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-dourado/20 blur-2xl" aria-hidden="true" />
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-dourado">
          <Icone nome="dinheiro" className="h-5 w-5" /> Valor movimentado em mentorias
        </p>
        <p className="mt-2 font-titulo text-4xl font-bold sm:text-5xl">{formatarKz(e.valorMovimentado)}</p>
        <p className="mt-2 text-white/75">
          {e.mentoriasConcluidas} de {e.totalMentorias} mentorias concluídas ({taxaConclusao}%)
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CartaoEstatistica icone="bolsa" rotulo="Bolsas" valor={e.totalBolsas} />
        <CartaoEstatistica icone="utilizador" rotulo="Estudantes" valor={e.totalEstudantes} tom="verde" />
        <CartaoEstatistica icone="escudo" rotulo="Mentores" valor={e.totalMentores} tom="dourado" />
        <CartaoEstatistica
          icone="relogio"
          rotulo="Mentores por aprovar"
          valor={e.mentoresPendentes}
          tom={e.mentoresPendentes ? 'laranja' : 'azul'}
        />
        <CartaoEstatistica icone="mentoria" rotulo="Mentorias" valor={e.totalMentorias} detalhe={`${e.mentoriasConcluidas} concluídas`} />
        <CartaoEstatistica icone="convite" rotulo="Convites enviados" valor={e.convitesEnviados} tom="verde" />
      </div>

      {e.mentoresPendentes > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-orange-800">
            <Icone nome="alerta" className="h-6 w-6" />
            {e.mentoresPendentes} {e.mentoresPendentes === 1 ? 'mentor está' : 'mentores estão'} à espera de aprovação.
          </p>
          <Link to="/area/admin/mentores" className="btn-primario">Rever mentores</Link>
        </div>
      )}
    </div>
  );
}
