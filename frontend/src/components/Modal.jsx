import { useEffect } from 'react';
import Icone from './Icone.jsx';

/**
 * Janela modal simples. Fecha com a tecla Esc ou clicando fora.
 * `largura` aceita uma classe max-w-* (por omissão max-w-lg).
 */
export default function Modal({ aberto, titulo, onFechar, children, largura = 'max-w-lg' }) {
  useEffect(() => {
    if (!aberto) return undefined;
    const tecla = (e) => e.key === 'Escape' && onFechar();
    document.addEventListener('keydown', tecla);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = '';
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-azul-escuro/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`max-h-[92vh] w-full ${largura} overflow-y-auto rounded-t-2xl bg-white shadow-elevado sm:rounded-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button type="button" onClick={onFechar} className="rounded-lg p-1.5 text-slate-500 hover:bg-claro" aria-label="Fechar">
            <Icone nome="fechar" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
