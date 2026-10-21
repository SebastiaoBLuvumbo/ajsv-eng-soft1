import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Icone from '../../components/Icone.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { rotaDaArea } from '../../utils/formatar.js';

/** Contas de demonstração (todas com a senha 123456). */
const CONTAS_DEMO = [
  { perfil: 'Estudante', email: 'ana@ajsv.ao', icone: 'bolsa' },
  { perfil: 'Mentor', email: 'helena@ajsv.ao', icone: 'escudo' },
  { perfil: 'SuperAdmin', email: 'admin@ajsv.ao', icone: 'grafico' },
];

/**
 * Login (POST /auth/login). Depois de entrar, cada utilizador vai diretamente para a sua área.
 * Se veio de uma página que pediu login (ex.: "Quero candidatar-me"), volta a essa página.
 */
export default function Entrar() {
  const { utilizador, entrar } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();
  const voltarPara = local.state?.voltarPara;
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [aEntrar, setAEntrar] = useState(false);

  // Já tem sessão: segue para a sua área
  if (utilizador && !aEntrar) return <Navigate to={rotaDaArea(utilizador)} replace />;

  async function submeter(e) {
    e.preventDefault();
    setErro('');
    setAEntrar(true);
    try {
      const { data } = await api.post('/auth/login', { email: email.trim(), senha });
      entrar(data);
      navegar(destinoDepoisDoLogin(data, voltarPara), { replace: true });
    } catch (e2) {
      setErro(mensagemErro(e2));
      setAEntrar(false);
    }
  }

  function preencher(conta) {
    setEmail(conta.email);
    setSenha('123456');
    setErro('');
  }

  return (
    <section className="contentor grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <img src="/logo.png" alt="AJSV – Bolsas & Mentorias" className="w-full max-w-sm" />
        <h1 className="mt-8 text-4xl font-bold">Bem-vindo de volta</h1>
        <p className="mt-3 max-w-md text-lg text-slate-600">
          Entra para acompanhar o calendário das tuas bolsas, falar com mentores ou gerir a plataforma.
        </p>
      </div>

      <div className="cartao mx-auto w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Entrar</h2>
        <p className="mt-1 text-slate-600">
          Ainda não tens conta? <Link to="/criar-conta" className="font-semibold text-verde hover:underline">Criar conta</Link>
        </p>

        {voltarPara && (
          <Aviso tipo="info" className="mt-5">Entra na tua conta para continuar.</Aviso>
        )}

        <form onSubmit={submeter} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="rotulo">Email</label>
            <input id="email" type="email" autoComplete="email" required className="campo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="o.teu@email.ao" />
          </div>
          <div>
            <label htmlFor="senha" className="rotulo">Senha</label>
            <input id="senha" type="password" autoComplete="current-password" required className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>

          <Aviso tipo="erro">{erro}</Aviso>

          <button type="submit" className="btn-primario w-full py-3 text-base" disabled={aEntrar}>
            {aEntrar ? 'A entrar…' : 'Entrar'}
          </button>
        </form>

        {/* Atalhos para as contas de demonstração */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-sm font-semibold text-azul">Contas de demonstração</p>
          <p className="text-sm text-slate-500">Clica para preencher. Senha: 123456</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {CONTAS_DEMO.map((c) => (
              <button
                key={c.email}
                type="button"
                onClick={() => preencher(c)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm transition ${
                  email === c.email ? 'border-azul bg-claro' : 'border-slate-200 hover:border-azul/40 hover:bg-claro/50'
                }`}
              >
                <Icone nome={c.icone} className="h-5 w-5 text-verde" />
                <span className="font-semibold text-azul">{c.perfil}</span>
                <span className="text-xs text-slate-500">{c.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Para onde ir depois do login: a página que pediu o login (se fizer sentido) ou a própria área. */
function destinoDepoisDoLogin(utilizador, voltarPara) {
  if (!voltarPara) return rotaDaArea(utilizador);
  // Uma página da área reservada só serve se for da área deste utilizador
  if (voltarPara.startsWith('/area') && !voltarPara.startsWith(rotaDaArea(utilizador))) return rotaDaArea(utilizador);
  return voltarPara;
}
