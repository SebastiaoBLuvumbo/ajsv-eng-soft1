import { api } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import { useDados } from '../../hooks/useDados.js';
import { ESTADOS_CONVITE, formatarData } from '../../utils/formatar.js';

/**
 * Convites para mentor enviados aos estudantes que marcaram uma bolsa como ganha,
 * e a resposta de cada estudante.
 */
export default function AdminConvites() {
  const { dados: convites, erro, aCarregar } = useDados(() => api.get('/admin/convites').then((r) => r.data));

  if (aCarregar && !convites) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!convites) return null;

  return (
    <div className="space-y-5">
      <p className="text-slate-600">
        Quando um estudante marca uma bolsa como ganha, recebe um convite para ser mentor.
      </p>

      {convites.length === 0 ? (
        <EstadoVazio icone="convite" titulo="Ainda não foram enviados convites" />
      ) : (
        <div className="cartao overflow-x-auto">
          <table className="tabela min-w-[640px]">
            <thead>
              <tr>
                <th>Estudante</th>
                <th>Bolsa ganha</th>
                <th>Enviado em</th>
                <th>Resposta</th>
              </tr>
            </thead>
            <tbody>
              {convites.map((c) => {
                const estado = ESTADOS_CONVITE[c.estado] ?? { rotulo: c.estado, cor: 'cinza' };
                return (
                  <tr key={c.id}>
                    <td className="font-semibold text-azul">{c.estudanteNome}</td>
                    <td>{c.bolsaNome}</td>
                    <td className="whitespace-nowrap">{formatarData(c.dataEnvio)}</td>
                    <td><Etiqueta cor={estado.cor}>{estado.rotulo}</Etiqueta></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
