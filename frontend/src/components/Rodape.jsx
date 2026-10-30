import { Link } from 'react-router-dom';
import { LINKS_PUBLICOS } from './MenuPublico.jsx';

// TROCAR pelos contactos reais da AJSV (estes são exemplos)
const CONTACTOS = {
  email: 'contacto@ajsv.ao',
  whatsappRotulo: '+244 900 000 000',
  whatsappLigacao: 'https://wa.me/244900000000',
};

// Área clicável maior e hover consistente em todos os links do rodapé
const LIGACAO = 'inline-block py-1 transition hover:text-white hover:underline';

/** Rodapé do site público. */
export default function Rodape() {
  return (
    <footer className="mt-8 bg-azul text-white/80">
      <div className="contentor grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div>
          <span className="inline-block rounded-xl bg-white px-3 py-2">
            <img src="/logo-marca.png" alt="AJSV" className="h-10 w-auto" />
          </span>
          <p className="mt-4 font-titulo text-lg font-semibold text-dourado">Mais oportunidades. Um futuro melhor.</p>
          <p className="mt-2 max-w-sm text-[15px]">
            Bolsas de estudo e mentorias com quem já lá chegou, para estudantes angolanos.
          </p>
        </div>

        <div>
          <p className="font-titulo font-semibold text-white">Navegação</p>
          <ul className="mt-3 space-y-0.5 text-[15px]">
            {LINKS_PUBLICOS.map((l) => (
              <li key={l.para}><Link to={l.para} className={LIGACAO}>{l.rotulo}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-titulo font-semibold text-white">Conta</p>
          <ul className="mt-3 space-y-0.5 text-[15px]">
            <li><Link to="/entrar" className={LIGACAO}>Entrar</Link></li>
            <li><Link to="/criar-conta" className={LIGACAO}>Criar conta</Link></li>
            <li><Link to="/criar-conta?perfil=MENTOR" className={LIGACAO}>Quero ser mentor</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-titulo font-semibold text-white">Contacto</p>
          <ul className="mt-3 space-y-0.5 text-[15px]">
            <li>
              <a href={`mailto:${CONTACTOS.email}`} className={`${LIGACAO} break-words`}>{CONTACTOS.email}</a>
            </li>
            <li>
              <a href={CONTACTOS.whatsappLigacao} target="_blank" rel="noopener noreferrer" className={LIGACAO}>
                WhatsApp: {CONTACTOS.whatsappRotulo}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="contentor flex flex-col gap-1 py-5 text-sm sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} AJSV – Bolsas & Mentorias</p>
          <p className="text-white/60">Projeto académico. Os dados são de demonstração.</p>
        </div>
      </div>
    </footer>
  );
}