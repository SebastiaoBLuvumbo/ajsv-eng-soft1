import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import CartaoEstatistica from '../../components/CartaoEstatistica.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Icone from '../../components/Icone.jsx';
import Modal from '../../components/Modal.jsx';
import { estiloDoDocumento } from '../../components/LinhaTempoDocumentos.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';
import { formatarData, textoDiasDocumento } from '../../utils/formatar.js';

/** Início do estudante: resumo, alertas dos documentos e convite para mentor (se existir). */
export default function EstudanteInicio() {
  const { utilizador } = useAuth();
  const id = utilizador.id;

  const { dados, erro, aCarregar, recarregar } = useDados(async () => {
    const [bolsas, mentorias, convites] = await Promise.all([
      api.get(`/estudante/${id}/bolsas`),
      api.get(`/estudante/${id}/mentorias`),
      api.get(`/estudante/${id}/convites`),
    ]);
    return { bolsas: bolsas.data, mentorias: mentorias.data, convites: convites.data };
  }, [id]);

  if (aCarregar && !dados) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!dados) return null;

  // ---------- Resumo
  const emCandidatura = dados.bolsas.filter((c) => !c.ganha);
  const alertas = emCandidatura.flatMap((c) =>
    c.documentos
      .filter((d) => d.estado !== 'CONCLUIDO' && d.alerta !== 'OK')
      .map((d) => ({ ...d, bolsaNome: c.bolsaNome, bolsaId: c.bolsaId }))
  ).sort((a, b) => a.diasRestantes - b.diasRestantes);
  const atrasados = alertas.filter((d) => d.alerta === 'ATRASADO').length;
  const emCurso = dados.mentorias.filter((m) => m.estado === 'ACEITE').length;
  const pendentes = dados.mentorias.filter((m) => m.estado === 'PENDENTE').length;
  const convite = dados.convites.find((c) => c.estado === 'PENDENTE');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Olá, {utilizador.nome.split(' ')[0]}!</h2>
        <p className="text-slate-600">Este é o resumo das tuas candidaturas.</p>
      </div>

      {/* Convite para mentor: notificação discreta */}
      {convite && <ConviteMentor convite={convite} onRespondido={recarregar} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <CartaoEstatistica icone="calendario" rotulo="Bolsas seguidas" valor={dados.bolsas.length} />
        <CartaoEstatistica
          icone="alerta"
          rotulo="Documentos atrasados"
          valor={atrasados}
          tom={atrasados ? 'vermelho' : 'verde'}
          detalhe={atrasados ? 'Começa-os o quanto antes' : 'Está tudo em dia'}
        />
        <CartaoEstatistica
          icone="mentoria"
          rotulo="Mentorias em curso"
          valor={emCurso}
          tom="verde"
          detalhe={pendentes ? `${pendentes} à espera de resposta` : undefined}
        />
      </div>

      {/* Alertas */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Alertas</h3>
          {dados.bolsas.length > 0 && (
            <Link to="/area/estudante/bolsas" className="btn-fantasma btn-sm">
              Ver calendários <Icone nome="seta" className="h-4 w-4" />
            </Link>
          )}
        </div>

        {dados.bolsas.length === 0 ? (
          <EstadoVazio
            icone="bolsa"
            titulo="Ainda não segues nenhuma bolsa"
            acao={<Link to="/bolsas" className="btn-primario">Explorar bolsas</Link>}
          >
            Abre uma bolsa e clica em «Quero candidatar-me» para receberes o calendário de documentos.
          </EstadoVazio>
        ) : alertas.length === 0 ? (
          <Aviso tipo="sucesso" titulo="Sem alertas">Todos os teus documentos estão dentro do prazo.</Aviso>
        ) : (
          <ul className="cartao divide-y divide-slate-100">
            {alertas.map((d) => {
              const estilo = estiloDoDocumento(d);
              return (
                <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
                  <span className={`h-3 w-3 shrink-0 rounded-full ${estilo.ponto.split(' ')[0]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{d.nome}</p>
                    <p className="text-sm text-slate-500">{d.bolsaNome} · começar até {formatarData(d.dataLimite)}</p>
                  </div>
                  <span className={`text-sm font-semibold ${estilo.texto}`}>{textoDiasDocumento(d.diasRestantes)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {emCandidatura.some((c) => c.temAlerta) && (
        <Aviso tipo="info" titulo="Precisas de ajuda para recuperar o tempo?">
          Um mentor que já ganhou a bolsa pode ajudar-te.{' '}
          <Link to="/area/estudante/bolsas" className="font-semibold underline">Vê os mentores sugeridos</Link> em cada calendário.
        </Aviso>
      )}
    </div>
  );
}

/** Notificação do convite para ser mentor, com aceitar (descrição + preço) ou recusar. */
function ConviteMentor({ convite, onRespondido }) {
  const { utilizador, atualizar } = useAuth();
  const [aberto, setAberto] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const [aceite, setAceite] = useState(false);

  async function aceitar(e) {
    e.preventDefault();
    setErro('');
    setAEnviar(true);
    try {
      const { data } = await api.post(`/estudante/${utilizador.id}/convites/${convite.id}/aceitar`, {
        descricao: descricao.trim(),
        preco: preco ? Math.round(Number(preco)) : null,
      });
      // O utilizador passa a ter mentorId: o menu lateral mostra "Área de mentor"
      atualizar({ mentorId: data.mentorId, estadoMentor: data.estadoMentor });
      setAberto(false);
      setAceite(data.estadoMentor ?? true);
    } catch (e2) {
      setErro(mensagemErro(e2));
    } finally {
      setAEnviar(false);
    }
  }

  async function recusar() {
    setErro('');
    setAEnviar(true);
    try {
      await api.post(`/estudante/${utilizador.id}/convites/${convite.id}/recusar`);
      onRespondido();
    } catch (e2) {
      setErro(mensagemErro(e2));
      setAEnviar(false);
    }
  }

  if (aceite) {
    return (
      <Aviso tipo="sucesso" titulo="Já és mentor AJSV!">
        Obrigado por ajudares outros estudantes.
        {aceite === 'PENDENTE' && ' O teu perfil fica visível depois de a equipa AJSV o aprovar.'}{' '}
        <Link to="/area/mentor" className="font-semibold underline">Ir para a área de mentor</Link>
      </Aviso>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-dourado/40 bg-dourado-claro/70 px-5 py-4 sm:flex-row sm:items-center">
        <Icone nome="trofeu" className="h-6 w-6 shrink-0 text-dourado-escuro" />
        <p className="flex-1 text-[15px] text-slate-700">
          <strong className="text-azul">Parabéns pela {convite.bolsaNome}!</strong> Convidamos-te a ser mentor e a ajudar outros estudantes.
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-primario btn-sm" onClick={() => setAberto(true)}>Ver convite</button>
          <button type="button" className="btn-fantasma btn-sm" onClick={recusar} disabled={aEnviar}>Recusar</button>
        </div>
      </div>
      {!aberto && <Aviso tipo="erro">{erro}</Aviso>}

      <Modal aberto={aberto} titulo="Convite para mentor" onFechar={() => setAberto(false)}>
        <form onSubmit={aceitar} className="space-y-4">
          <p className="text-slate-600">
            Como ganhaste a <strong className="text-azul">{convite.bolsaNome}</strong>, podes ajudar estudantes que se candidatam a ela.
            O teu perfil de mentor fica ligado a esta conta.
          </p>
          <div>
            <label htmlFor="conv-desc" className="rotulo">Como podes ajudar</label>
            <textarea id="conv-desc" rows={4} className="campo" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex.: Ajudo com a carta de motivação e com a entrevista." />
          </div>
          <div>
            <label htmlFor="conv-preco" className="rotulo">Preço da mentoria (Kz)</label>
            <input id="conv-preco" type="number" min="1" step="1" required className="campo" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="15000" />
          </div>
          <Aviso tipo="erro">{erro}</Aviso>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn-contorno" onClick={() => setAberto(false)}>Agora não</button>
            <button type="submit" className="btn-secundario" disabled={aEnviar}>{aEnviar ? 'A guardar…' : 'Aceitar convite'}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
