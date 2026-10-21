import { useState } from 'react';
import { iniciais } from '../utils/formatar.js';

/** Foto do utilizador ou, se não houver (ou falhar), as iniciais do nome. */
export default function Avatar({ nome, fotoUrl, tamanho = 'h-12 w-12 text-base' }) {
  const [falhou, setFalhou] = useState(false);

  if (fotoUrl && !falhou) {
    return (
      <img
        src={fotoUrl}
        alt={nome}
        onError={() => setFalhou(true)}
        className={`${tamanho} shrink-0 rounded-full object-cover ring-2 ring-white`}
      />
    );
  }
  return (
    <span
      className={`${tamanho} inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-azul to-verde font-titulo font-semibold text-white ring-2 ring-white`}
      aria-label={nome}
    >
      {iniciais(nome)}
    </span>
  );
}
