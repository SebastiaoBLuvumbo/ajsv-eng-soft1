import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Icone from '../../components/Icone.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';
import { rotaDaArea } from '../../utils/formatar.js';

const OPCOES_PERFIL = [
  { perfil: 'ESTUDANTE', titulo: 'Quero candidatar-me a bolsas', texto: 'Recebe o calendário de documentos e contrata mentorias.', icone: 'bolsa' },
  { perfil: 'MENTOR', titulo: 'Quero ser mentor', texto: 'Já ganhaste uma bolsa? Ajuda outros estudantes e recebe por isso.', icone: 'escudo' },
];

const VAZIO = { nome: '', email: '', telefone: '', senha: '', bolsaGanhaId: '', anoBolsa: '', provaBolsa: '', descricao: '', preco: '' };

/**
 * Registo (POST /auth/registo). Depois do registo, entra automaticamente e vai para a sua área.
 * ?perfil=MENTOR abre logo com o cartão "Quero ser mentor" escolhido.
 */
export default function CriarConta() {
  const [parametros] = useSearchParams();
  const { entrar } = useAuth();
  const navegar = useNavigate();
  const [perfil, setPerfil] = useState(parametros.get('perfil') === 'MENTOR' ? 'MENTOR' : 'ESTUDANTE');
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);

  // Bolsas para o mentor indicar a que ganhou (inclui as já encerradas)
  const { dados: bolsas } = useDados(() => api.get('/bolsas', { params: { todas: true } }).then((r) => r.data));

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const eMentor = perfil === 'MENTOR';
  const anoAtual = new Date().getFullYear();

  async function submeter(e) {
    e.preventDefault();
    setErro('');

    // Validações simples antes de enviar (o backend volta a validar)
    if (form.senha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    if (eMentor && (!form.preco || Number(form.preco) <= 0)) return setErro('Indica o preço da tua mentoria em Kz.');

    const corpo = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone.trim(),
      senha: form.senha,
      perfil,
      bolsaGanhaId: eMentor && form.bolsaGanhaId ? Number(form.bolsaGanhaId) : null,
      anoBolsa: eMentor && form.anoBolsa ? Number(form.anoBolsa) : null,
      descricao: eMentor ? form.descricao.trim() : null,
      preco: eMentor ? Math.round(Number(form.preco)) : null,
      provaBolsa: eMentor ? form.provaBolsa.trim() : null,
    };

    setAEnviar(true);
    try {
      const { data } = await api.post('/auth/registo', corpo);
      entrar(data);
      navegar(rotaDaArea(data), { replace: true });
    } catch (e2) {
      setErro(mensagemErro(e2));
      setAEnviar(false);
    }
  }

  return (
    <section className="contentor py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Criar conta</h1>
        <p className="mt-2 text-slate-600">
          Já tens conta? <Link to="/entrar" className="font-semibold text-verde hover:underline">Entrar</Link>
        </p>

        {/* ---------- Escolha do perfil */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Tipo de conta">
          {OPCOES_PERFIL.map((o) => {
            const ativo = perfil === o.perfil;
            return (
              <button
                key={o.perfil}
                type="button"
                role="radio"
                aria-checked={ativo}
                onClick={() => setPerfil(o.perfil)}
                className={`relative flex items-start gap-4 rounded-2xl border-2 bg-white p-5 text-left transition ${
                  ativo ? 'border-azul shadow-cartao' : 'border-slate-200 hover:border-azul/40'
                }`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ativo ? 'bg-azul text-white' : 'bg-claro text-azul'}`}>
                  <Icone nome={o.icone} className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-titulo text-lg font-semibold text-azul">{o.titulo}</span>
                  <span className="mt-1 block text-[15px] text-slate-600">{o.texto}</span>
                </span>
                {ativo && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-verde text-white">
                    <Icone nome="check" className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ---------- Formulário */}
        <form onSubmit={submeter} className="cartao mt-6 space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="rotulo">Nome completo</label>
              <input id="nome" required className="campo" value={form.nome} onChange={mudar('nome')} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="email" className="rotulo">Email</label>
              <input id="email" type="email" required className="campo" value={form.email} onChange={mudar('email')} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="telefone" className="rotulo">Telefone</label>
              <input id="telefone" type="tel" className="campo" value={form.telefone} onChange={mudar('telefone')} placeholder="923 000 000" autoComplete="tel" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="senha" className="rotulo">Senha</label>
              <input id="senha" type="password" required minLength={6} className="campo" value={form.senha} onChange={mudar('senha')} autoComplete="new-password" />
              <p className="ajuda">Mínimo de 6 caracteres.</p>
            </div>
          </div>

          {/* Campos extra para o mentor */}
          {eMentor && (
            <fieldset className="space-y-5 rounded-2xl border border-dourado/40 bg-dourado-claro/40 p-5">
              <legend className="px-2 font-titulo font-semibold text-azul">Dados de mentor</legend>

              <Aviso tipo="atencao">
                O teu perfil de mentor só fica visível para os estudantes depois de a equipa AJSV aprovar a prova da bolsa.
              </Aviso>

              <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label htmlFor="bolsa" className="rotulo">Bolsa que ganhaste</label>
                  <select id="bolsa" className="campo" value={form.bolsaGanhaId} onChange={mudar('bolsaGanhaId')}>
                    <option value="">Não está na lista</option>
                    {bolsas?.map((b) => <option key={b.id} value={b.id}>{b.nome} ({b.pais})</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ano" className="rotulo">Ano</label>
                  <input id="ano" type="number" min="1990" max={anoAtual} className="campo" value={form.anoBolsa} onChange={mudar('anoBolsa')} placeholder={String(anoAtual - 1)} />
                </div>
              </div>

              <div>
                <label htmlFor="prova" className="rotulo">Prova da bolsa</label>
                <input id="prova" className="campo" value={form.provaBolsa} onChange={mudar('provaBolsa')} placeholder="Link para a carta de atribuição ou descrição da prova" />
                <p className="ajuda">
                  {form.bolsaGanhaId ? 'A equipa AJSV usa esta prova para verificar o teu perfil.' : 'Se a tua bolsa não está na lista, indica aqui o nome da bolsa e a prova.'}
                </p>
              </div>

              <div>
                <label htmlFor="descricao" className="rotulo">Como podes ajudar</label>
                <textarea id="descricao" rows={4} className="campo" value={form.descricao} onChange={mudar('descricao')} placeholder="Ex.: Ajudo com a carta de motivação, o CV e a preparação para a entrevista." />
              </div>

              <div className="sm:w-1/2">
                <label htmlFor="preco" className="rotulo">Preço da mentoria (Kz)</label>
                <input id="preco" type="number" min="1" step="1" required className="campo" value={form.preco} onChange={mudar('preco')} placeholder="15000" />
              </div>
            </fieldset>
          )}

          <Aviso tipo="erro">{erro}</Aviso>

          <button type="submit" className="btn-primario w-full py-3 text-base" disabled={aEnviar}>
            {aEnviar ? 'A criar conta…' : eMentor ? 'Criar conta de mentor' : 'Criar conta de estudante'}
          </button>
        </form>
      </div>
    </section>
  );
}
