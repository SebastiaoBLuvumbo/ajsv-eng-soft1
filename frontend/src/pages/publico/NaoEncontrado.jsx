import { Link } from 'react-router-dom';

/** Página para endereços que não existem. */
export default function NaoEncontrado() {
  return (
    <section className="contentor flex flex-col items-center py-24 text-center">
      <p className="font-titulo text-7xl font-bold text-claro">404</p>
      <h1 className="mt-4 text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-slate-600">O endereço que procuras não existe ou mudou de lugar.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primario">Ir para a Home</Link>
        <Link to="/bolsas" className="btn-contorno">Ver bolsas</Link>
      </div>
    </section>
  );
}
