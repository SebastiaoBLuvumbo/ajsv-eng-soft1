/**
 * Ícones simples em SVG (traço de 1.8px), para não depender de bibliotecas externas.
 * Uso: <Icone nome="calendario" className="h-5 w-5" />
 */
const CAMINHOS = {
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  fechar: <path d="M6 6l12 12M18 6L6 18" />,
  pesquisa: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>),
  calendario: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  relogio: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  check: <path d="M5 13l4 4L19 7" />,
  inicio: <path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6" />,
  bolsa: <path d="M2 9l10-5 10 5-10 5-10-5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />,
  mentoria: (<><circle cx="9" cy="8" r="4" /><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" /><circle cx="17.5" cy="7" r="2.8" /><path d="M22 19c0-2.4-1.6-4.4-4-5" /></>),
  utilizador: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>),
  sair: <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 16l4-4-4-4M20 12H9" />,
  externo: <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4" />,
  grafico: <path d="M3 20h18M6 20v-7M11 20V5M16 20v-10M21 20V9" />,
  documento: (<><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>),
  caixa: <path d="M3 13l3-8h12l3 8M3 13v6h18v-6M3 13h5l1 3h6l1-3h5" />,
  historico: <path d="M3 12a9 9 0 103-6.7L3 8M3 3v5h5M12 7v5l3 2" />,
  alerta: <path d="M12 3l10 18H2L12 3zM12 10v4M12 17.5v.5" />,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  setaEsquerda: <path d="M19 12H5M11 6l-6 6 6 6" />,
  mais: <path d="M12 5v14M5 12h14" />,
  editar: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
  lixo: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  escudo: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5" />,
  dinheiro: (<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 9v.01M18 15v.01" /></>),
  email: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  telefone: (<><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>),
  globo: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>),
  trofeu: <path d="M8 4h8v5a4 4 0 01-8 0V4zM8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M8 20h8M10 17h4" />,
  ligacao: <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />,
  convite: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6M17 3l2 2" /></>),
  estrela: <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z" />,
  mensagem: <path d="M4 5h16v11H9l-5 4V5z" />,
  olho: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
};

export default function Icone({ nome, className = 'h-5 w-5', titulo }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={titulo ? undefined : true}
      role={titulo ? 'img' : undefined}
    >
      {titulo && <title>{titulo}</title>}
      {CAMINHOS[nome] ?? CAMINHOS.alerta}
    </svg>
  );
}
