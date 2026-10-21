import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import CartaoEstatistica from '../../components/CartaoEstatistica.jsx';
import Estrelas from '../../components/Estrelas.jsx';
import Icone from '../../components/Icone.jsx';
import SeloVerificado from '../../components/SeloVerificado.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';
import { formatarKz } from '../../utils/formatar.js';
import AvisoEstadoMentor from './AvisoEstadoMentor.jsx';

/** Início do mentor: ganhos, mentorias concluídas, pedidos por responder e avaliação média. */
export default function MentorInicio() {
  const { utilizador, atualizar } = useAuth();
  const mentorId = utilizador.mentorId;

  const { dados, erro, aCarregar } = useDados(async () => {
    const [ganhos, perfil] = await Promise.all([
      api.get(`/mentor/${mentorId}/ganhos`),
      api.get(`/mentor/${mentorId}/perfil`),
    ]);
    return { ganhos: ganhos.data, perfil: perfil.data };
  }, [mentorId]);

  // Mantém o estado do mentor da sessão atualizado (pode ter sido aprovado entretanto)
  useEffect(() => {
    if (dados && dados.perfil.estado !== utilizador.estadoMentor) atualizar({ estadoMentor: dados.perfil.estado });
  }, [dados, utilizador.estadoMentor, atualizar]);

  if (aCarregar && !dados) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!dados) return null;

  const { ganhos, perfil } = dados;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold">Olá, {utilizador.nome.split(' ')[0]}!</h2>
        {perfil.verificado && <SeloVerificado />}
      </div>

      <AvisoEstadoMentor estado={perfil.estado} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CartaoEstatistica icone="dinheiro" rotulo="Total ganho" valor={formatarKz(ganhos.totalGanho)} tom="verde" />
        <CartaoEstatistica icone="check" rotulo="Mentorias concluídas" valor={ganhos.mentoriasConcluidas} />
        <CartaoEstatistica
          icone="caixa"
          rotulo="Pedidos por responder"
          valor={ganhos.mentoriasPendentes}
          tom={ganhos.mentoriasPendentes ? 'laranja' : 'azul'}
          detalhe={`${ganhos.mentoriasEmCurso} em curso`}
        />
        <CartaoEstatistica
          icone="estrela"
          rotulo="Avaliação média"
          valor={ganhos.avaliacaoMedia ? ganhos.avaliacaoMedia.toFixed(1).replace('.', ',') : '—'}
          tom="dourado"
          detalhe={`${perfil.totalAvaliacoes ?? 0} ${perfil.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}`}
        />
      </div>

      {ganhos.mentoriasPendentes > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl bg-azul p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <Icone nome="caixa" className="h-6 w-6 text-dourado" />
            Tens {ganhos.mentoriasPendentes} {ganhos.mentoriasPendentes === 1 ? 'pedido' : 'pedidos'} à espera de resposta.
          </p>
          <Link to="/area/mentor/pedidos" className="btn-dourado">Responder agora</Link>
        </div>
      )}

      {/* Resumo do perfil público */}
      <section className="cartao p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">O teu perfil público</h3>
          <Link to="/area/mentor/perfil" className="btn-fantasma btn-sm">
            <Icone nome="editar" className="h-4 w-4" /> Editar
          </Link>
        </div>
        <dl className="mt-3 grid gap-3 text-[15px] sm:grid-cols-3">
          <div>
            <dt className="text-sm text-slate-500">Bolsa ganha</dt>
            <dd className="font-semibold text-azul">{perfil.bolsaGanhaNome ?? '—'}{perfil.anoBolsa ? ` (${perfil.anoBolsa})` : ''}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Preço</dt>
            <dd className="font-semibold text-verde">{formatarKz(perfil.preco)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Avaliação</dt>
            <dd><Estrelas valor={perfil.avaliacaoMedia} total={perfil.totalAvaliacoes} /></dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
