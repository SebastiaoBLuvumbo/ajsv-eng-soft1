import Icone from './Icone.jsx';

/**
 * Caixa de mensagem para o utilizador.
 * tipo: "erro" (mensagens do backend), "sucesso", "info" ou "atencao".
 */
const ESTILOS = {
  erro: { caixa: 'border-red-200 bg-red-50 text-red-800', icone: 'alerta' },
  sucesso: { caixa: 'border-verde/25 bg-verde-claro text-verde-escuro', icone: 'check' },
  info: { caixa: 'border-azul/15 bg-claro text-azul', icone: 'alerta' },
  atencao: { caixa: 'border-orange-200 bg-orange-50 text-orange-800', icone: 'relogio' },
};

export default function Aviso({ tipo = 'info', titulo, children, className = '' }) {
  if (!children && !titulo) return null;
  const estilo = ESTILOS[tipo] ?? ESTILOS.info;
  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`flex gap-3 rounded-xl border px-4 py-3 text-[15px] ${estilo.caixa} ${className}`}
    >
      <Icone nome={estilo.icone} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
