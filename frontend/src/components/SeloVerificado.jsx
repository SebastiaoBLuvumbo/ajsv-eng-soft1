import Icone from './Icone.jsx';

/** Selo dourado "Mentor verificado". */
export default function SeloVerificado({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-dourado-claro px-2.5 py-0.5 text-xs font-semibold text-dourado-escuro ring-1 ring-inset ring-dourado/40 ${className}`}
    >
      <Icone nome="escudo" className="h-3.5 w-3.5" />
      Mentor verificado
    </span>
  );
}
