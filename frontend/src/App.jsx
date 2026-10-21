import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { rotaDaArea } from './utils/formatar.js';

import LayoutPublico from './layouts/LayoutPublico.jsx';
import LayoutAreaReservada from './layouts/LayoutAreaReservada.jsx';

// Site público
import Home from './pages/publico/Home.jsx';
import Bolsas from './pages/publico/Bolsas.jsx';
import BolsaDetalhe from './pages/publico/BolsaDetalhe.jsx';
import Mentores from './pages/publico/Mentores.jsx';
import SobreNos from './pages/publico/SobreNos.jsx';
import Entrar from './pages/publico/Entrar.jsx';
import CriarConta from './pages/publico/CriarConta.jsx';
import NaoEncontrado from './pages/publico/NaoEncontrado.jsx';

// Área do estudante
import EstudanteInicio from './pages/estudante/EstudanteInicio.jsx';
import EstudanteBolsas from './pages/estudante/EstudanteBolsas.jsx';
import EstudanteMentorias from './pages/estudante/EstudanteMentorias.jsx';
import EstudantePerfil from './pages/estudante/EstudantePerfil.jsx';

// Área do mentor
import MentorInicio from './pages/mentor/MentorInicio.jsx';
import MentorPedidos from './pages/mentor/MentorPedidos.jsx';
import MentorEmCurso from './pages/mentor/MentorEmCurso.jsx';
import MentorHistorico from './pages/mentor/MentorHistorico.jsx';
import MentorPerfil from './pages/mentor/MentorPerfil.jsx';

// Área do SuperAdmin
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminBolsas from './pages/admin/AdminBolsas.jsx';
import AdminDocumentos from './pages/admin/AdminDocumentos.jsx';
import AdminMentores from './pages/admin/AdminMentores.jsx';
import AdminUtilizadores from './pages/admin/AdminUtilizadores.jsx';
import AdminConvites from './pages/admin/AdminConvites.jsx';

/** /area leva cada utilizador à sua própria área (ou ao login). */
function IrParaArea() {
  const { utilizador } = useAuth();
  return <Navigate to={rotaDaArea(utilizador)} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* ---------------- PARTE 1: site público */}
      <Route element={<LayoutPublico />}>
        <Route index element={<Home />} />
        <Route path="bolsas" element={<Bolsas />} />
        <Route path="bolsas/:id" element={<BolsaDetalhe />} />
        <Route path="mentores" element={<Mentores />} />
        <Route path="sobre" element={<SobreNos />} />
        <Route path="entrar" element={<Entrar />} />
        <Route path="criar-conta" element={<CriarConta />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Route>

      {/* ---------------- PARTE 2: área reservada (o layout verifica a sessão e o perfil) */}
      <Route path="area" element={<IrParaArea />} />

      <Route path="area/estudante" element={<LayoutAreaReservada area="estudante" />}>
        <Route index element={<EstudanteInicio />} />
        <Route path="bolsas" element={<EstudanteBolsas />} />
        <Route path="mentorias" element={<EstudanteMentorias />} />
        <Route path="perfil" element={<EstudantePerfil />} />
      </Route>

      <Route path="area/mentor" element={<LayoutAreaReservada area="mentor" />}>
        <Route index element={<MentorInicio />} />
        <Route path="pedidos" element={<MentorPedidos />} />
        <Route path="em-curso" element={<MentorEmCurso />} />
        <Route path="historico" element={<MentorHistorico />} />
        <Route path="perfil" element={<MentorPerfil />} />
      </Route>

      <Route path="area/admin" element={<LayoutAreaReservada area="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="bolsas" element={<AdminBolsas />} />
        <Route path="documentos" element={<AdminDocumentos />} />
        <Route path="mentores" element={<AdminMentores />} />
        <Route path="utilizadores" element={<AdminUtilizadores />} />
        <Route path="convites" element={<AdminConvites />} />
      </Route>
    </Routes>
  );
}
