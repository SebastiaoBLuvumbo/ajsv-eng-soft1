import { useState } from 'react';

const CAMINHO = 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z';

/**
 * Estrelas de avaliação (1 a 5), a dourado.
 * - Só leitura: <Estrelas valor={4.6} total={12} />
 * - Para escolher a nota: <Estrelas valor={nota} onEscolher={setNota} tamanho="h-8 w-8" />
 */
export default function Estrelas({ valor = 0, total, onEscolher, tamanho = 'h-4 w-4', mostrarNumero = true }) {
  const [sobre, setSobre] = useState(0);
  const editavel = typeof onEscolher === 'function';
  const mostrar = sobre || valor || 0;

  if (!editavel && !valor) {
    return <span className="text-sm text-slate-400">Ainda sem avaliações</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex" onMouseLeave={() => setSobre(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          // Preenchimento parcial (ex.: 4.5) através de um gradiente
          const preenchido = Math.max(0, Math.min(1, mostrar - (n - 1)));
          const id = `est-${n}-${Math.round(preenchido * 100)}`;
          const estrela = (
            <svg viewBox="0 0 24 24" className={tamanho} aria-hidden="true">
              <defs>
                <linearGradient id={id}>
                  <stop offset={`${preenchido * 100}%`} stopColor="#D8AA48" />
                  <stop offset={`${preenchido * 100}%`} stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
              <path d={CAMINHO} fill={`url(#${id})`} />
            </svg>
          );
          return editavel ? (
            <button
              key={n}
              type="button"
              onClick={() => onEscolher(n)}
              onMouseEnter={() => setSobre(n)}
              className="rounded p-0.5 transition-transform hover:scale-110"
              aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
            >
              {estrela}
            </button>
          ) : (
            <span key={n}>{estrela}</span>
          );
        })}
      </span>
      {!editavel && mostrarNumero && (
        <span className="text-sm text-slate-600">
          <strong className="font-semibold text-azul">{Number(valor).toFixed(1).replace('.', ',')}</strong>
          {total !== undefined && <span className="text-slate-400"> ({total})</span>}
        </span>
      )}
    </span>
  );
}
