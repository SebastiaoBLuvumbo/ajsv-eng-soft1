import Avatar from '../../components/Avatar.jsx';
import Icone from '../../components/Icone.jsx';

/*
 * Equipa que desenvolveu o projeto.
 * Substitui os marcadores pelo nome e pela função de cada elemento.
 */
const EQUIPA = [
  { nome: '[Nome 1]', funcao: '[Função]' },
  { nome: '[Nome 2]', funcao: '[Função]' },
  { nome: '[Nome 3]', funcao: '[Função]' },
  { nome: '[Nome 4]', funcao: '[Função]' },
];

/*
 * Links úteis: apenas endereços oficiais.
 * Se precisares de acrescentar um link sem teres a certeza do endereço, usa o marcador [LINK].
 */
const LINKS_UTEIS = [
  { nome: 'INAGBE', descricao: 'Instituto Nacional de Gestão de Bolsas de Estudo – entidade angolana responsável pelas bolsas internas e externas.', url: 'https://inagbe.gov.ao', destaque: true },
  { nome: 'Chevening', descricao: 'Bolsas de mestrado do Governo do Reino Unido.', url: 'https://www.chevening.org' },
  { nome: 'DAAD', descricao: 'Serviço Alemão de Intercâmbio Académico.', url: 'https://www.daad.de' },
  { nome: 'Erasmus+', descricao: 'Programa da União Europeia, incluindo os mestrados Erasmus Mundus.', url: 'https://erasmus-plus.ec.europa.eu' },
  { nome: 'Campus China (CSC)', descricao: 'Bolsas do Governo Chinês, geridas pelo China Scholarship Council.', url: 'https://www.campuschina.org' },
  { nome: 'Türkiye Bursları', descricao: 'Bolsas do Governo da Turquia.', url: 'https://www.turkiyeburslari.gov.tr' },
  { nome: 'Fulbright', descricao: 'Programa de bolsas do Governo dos Estados Unidos para estudantes estrangeiros.', url: 'https://foreign.fulbrightonline.org' },
];

const VALORES = [
  { titulo: 'Transparência', texto: 'Informação clara sobre prazos, requisitos e preços.' },
  { titulo: 'Confiança', texto: 'Mentores verificados que já ganharam a bolsa.' },
  { titulo: 'Inclusão', texto: 'Oportunidades acessíveis a estudantes de todas as províncias.' },
  { titulo: 'Partilha', texto: 'Quem já lá chegou ajuda quem está a começar.' },
];

export default function SobreNos() {
  return (
    <>
      {/* ---------- O que é a AJSV */}
      <section className="bg-azul text-white">
        <div className="contentor grid items-center gap-10 py-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-dourado">Sobre nós</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Mais oportunidades. Um futuro melhor.</h1>
            <p className="mt-5 text-lg text-white/85">
              A AJSV – Bolsas & Mentorias é uma plataforma para estudantes angolanos que reúne bolsas de estudo
              num só lugar e liga os estudantes a mentores que já ganharam essas bolsas.
            </p>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="rounded-[2rem] bg-white p-6 shadow-elevado">
              <img src="/logo.png" alt="AJSV – Bolsas & Mentorias" className="h-auto w-full max-w-xs" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- O problema */}
      <section className="contentor py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">O problema que resolvemos</h2>
            <p className="mt-4 text-slate-700">
              Muitos estudantes angolanos perdem bolsas não por falta de mérito, mas porque um documento não ficou
              pronto a tempo. Um passaporte, um registo criminal ou a legalização de um certificado podem demorar
              semanas, e a informação sobre as bolsas está espalhada por muitos sites.
            </p>
            <p className="mt-4 text-slate-700">
              A AJSV calcula, para cada bolsa, quando deves começar cada documento, avisa-te quando estás atrasado
              e sugere mentores que já passaram pelo mesmo processo.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="cartao p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-azul text-white"><Icone nome="seta" /></span>
              <h3 className="mt-4 text-xl font-semibold">Missão</h3>
              <p className="mt-2 text-slate-600">Ajudar cada estudante angolano a candidatar-se a bolsas a tempo e com qualidade.</p>
            </div>
            <div className="cartao p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-verde text-white"><Icone nome="olho" /></span>
              <h3 className="mt-4 text-xl font-semibold">Visão</h3>
              <p className="mt-2 text-slate-600">Ser a referência em Angola para quem procura estudar com uma bolsa, cá dentro ou lá fora.</p>
            </div>
            <div className="cartao p-6 sm:col-span-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dourado text-white"><Icone nome="estrela" /></span>
              <h3 className="mt-4 text-xl font-semibold">Valores</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {VALORES.map((v) => (
                  <li key={v.titulo}>
                    <p className="font-semibold text-azul">{v.titulo}</p>
                    <p className="text-[15px] text-slate-600">{v.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Equipa e contexto académico */}
      <section className="bg-claro/60 py-16">
        <div className="contentor">
          <h2 className="text-3xl font-bold">A equipa</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Projeto desenvolvido no âmbito da disciplina de <strong className="text-azul">Engenharia de Software</strong>,
            no 3.º ano da licenciatura em <strong className="text-azul">Engenharia Informática</strong> do ISPTEC.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EQUIPA.map((p, i) => (
              <div key={i} className="cartao p-6 text-center">
                <div className="flex justify-center">
                  <Avatar nome={p.nome.replace(/[[\]]/g, '')} tamanho="h-20 w-20 text-2xl" />
                </div>
                <p className="mt-4 font-titulo text-lg font-semibold text-azul">{p.nome}</p>
                <p className="text-slate-600">{p.funcao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Links úteis */}
      <section className="contentor py-16">
        <h2 className="text-3xl font-bold">Links úteis</h2>
        <p className="mt-2 text-slate-600">Sites oficiais da entidade angolana responsável pelas bolsas e de programas internacionais.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS_UTEIS.map((l) => (
            <a
              key={l.nome}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`cartao group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-elevado ${l.destaque ? 'border-verde/40 ring-1 ring-verde/20' : ''}`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-titulo text-lg font-semibold text-azul group-hover:underline">{l.nome}</span>
                <Icone nome="externo" className="h-4 w-4 text-slate-400" />
              </span>
              <span className="mt-1 text-[15px] text-slate-600">{l.descricao}</span>
              <span className="mt-3 truncate text-sm text-verde">{l.url.replace('https://', '')}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- Contactos (fictícios) */}
      <section className="contentor">
        <div className="cartao grid gap-6 p-6 sm:p-8 md:grid-cols-3">
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold">Contactos</h2>
            <p className="text-sm text-slate-500">Contactos fictícios, apenas para demonstração.</p>
          </div>
          <p className="flex items-center gap-3"><Icone nome="email" className="h-5 w-5 text-verde" />geral@ajsv.ao</p>
          <p className="flex items-center gap-3"><Icone nome="telefone" className="h-5 w-5 text-verde" />+244 923 000 000</p>
          <p className="flex items-center gap-3"><Icone nome="globo" className="h-5 w-5 text-verde" />Luanda, Angola</p>
        </div>
      </section>
    </>
  );
}
