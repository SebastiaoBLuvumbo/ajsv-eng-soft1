package ao.ajsv.bolsas.service;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.model.*;
import ao.ajsv.bolsas.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static ao.ajsv.bolsas.service.Erros.*;

/** Regras do painel do SuperAdmin: estatísticas, bolsas, documentos, mentores, utilizadores e convites. */
@Service
public class AdminService {

    private final BolsaRepository bolsas;
    private final TipoDocumentoRepository tipos;
    private final BolsaDocumentoRepository bolsaDocumentos;
    private final DocumentoEstudanteRepository documentos;
    private final BolsaSeguidaRepository seguidas;
    private final MentorRepository mentores;
    private final MentoriaRepository mentorias;
    private final UtilizadorRepository utilizadores;
    private final ConviteMentorRepository convites;
    private final CalendarioService calendario;

    public AdminService(BolsaRepository bolsas, TipoDocumentoRepository tipos,
                        BolsaDocumentoRepository bolsaDocumentos, DocumentoEstudanteRepository documentos,
                        BolsaSeguidaRepository seguidas, MentorRepository mentores,
                        MentoriaRepository mentorias, UtilizadorRepository utilizadores,
                        ConviteMentorRepository convites, CalendarioService calendario) {
        this.bolsas = bolsas;
        this.tipos = tipos;
        this.bolsaDocumentos = bolsaDocumentos;
        this.documentos = documentos;
        this.seguidas = seguidas;
        this.mentores = mentores;
        this.mentorias = mentorias;
        this.utilizadores = utilizadores;
        this.convites = convites;
        this.calendario = calendario;
    }

    // ---------------------------------------------------------------- Estatísticas

    public EstatisticasResponse estatisticas() {
        List<Mentoria> concluidas = mentorias.findByEstado(EstadoMentoria.CONCLUIDA);
        return new EstatisticasResponse(
                bolsas.count(),
                utilizadores.countByPerfil(Perfil.ESTUDANTE),
                mentores.countByEstado(EstadoMentor.APROVADO),
                mentores.countByEstado(EstadoMentor.PENDENTE),
                mentorias.count(),
                concluidas.size(),
                concluidas.stream().mapToLong(Mentoria::getValor).sum(),
                convites.count());
    }

    // ---------------------------------------------------------------- Bolsas (CRUD)

    /** Todas as bolsas, incluindo as que já fecharam. */
    public List<BolsaResponse> listarBolsas() {
        return bolsas.findAll(Sort.by("prazo")).stream()
                .map(b -> BolsaResponse.from(b, bolsaDocumentos.findByBolsaId(b.getId())))
                .toList();
    }

    @Transactional
    public BolsaResponse criarBolsa(BolsaRequest req) {
        Bolsa b = new Bolsa();
        preencherBolsa(b, req);
        bolsas.save(b);
        guardarDocumentos(b, req.documentosIds());
        return BolsaResponse.from(b, bolsaDocumentos.findByBolsaId(b.getId()));
    }

    @Transactional
    public BolsaResponse editarBolsa(Long id, BolsaRequest req) {
        Bolsa b = bolsas.findById(id).orElseThrow(() -> naoEncontrado("Bolsa não encontrada."));
        preencherBolsa(b, req);
        bolsas.save(b);
        bolsaDocumentos.deleteByBolsaId(id);
        guardarDocumentos(b, req.documentosIds());

        // Se o prazo mudou, recalcula as datas limite dos estudantes que já seguem esta bolsa
        calendario.recalcularPorBolsa(b);
        return BolsaResponse.from(b, bolsaDocumentos.findByBolsaId(id));
    }

    @Transactional
    public void apagarBolsa(Long id) {
        if (!bolsas.existsById(id)) throw naoEncontrado("Bolsa não encontrada.");
        if (seguidas.existsByBolsaId(id) || mentores.existsByBolsaGanhaId(id)
                || mentorias.existsByBolsaId(id) || convites.existsByBolsaId(id))
            throw conflito("Não é possível apagar: há estudantes, mentores ou mentorias ligados a esta bolsa.");
        bolsaDocumentos.deleteByBolsaId(id);
        bolsas.deleteById(id);
    }

    // ---------------------------------------------------------------- Tipos de documento (CRUD)

    public List<TipoDocumentoDTO> listarTipos() {
        return tipos.findAllByOrderByNomeAsc().stream().map(TipoDocumentoDTO::from).toList();
    }

    @Transactional
    public TipoDocumentoDTO criarTipo(TipoDocumentoDTO req) {
        TipoDocumento t = new TipoDocumento();
        preencherTipo(t, req);
        return TipoDocumentoDTO.from(tipos.save(t));
    }

    @Transactional
    public TipoDocumentoDTO editarTipo(Long id, TipoDocumentoDTO req) {
        TipoDocumento t = tipos.findById(id).orElseThrow(() -> naoEncontrado("Documento não encontrado."));
        preencherTipo(t, req);
        tipos.save(t);

        // O tempo médio mudou: recalcula as datas limite que usam este documento
        calendario.recalcularPorTipo(t);
        return TipoDocumentoDTO.from(t);
    }

    @Transactional
    public void apagarTipo(Long id) {
        if (!tipos.existsById(id)) throw naoEncontrado("Documento não encontrado.");
        if (bolsaDocumentos.existsByTipoDocumentoId(id) || documentos.existsByTipoDocumentoId(id))
            throw conflito("Não é possível apagar: este documento é exigido por uma ou mais bolsas.");
        tipos.deleteById(id);
    }

    // ---------------------------------------------------------------- Mentores

    /** estado (opcional): PENDENTE, APROVADO ou REJEITADO */
    public List<MentorResponse> listarMentores(EstadoMentor estado) {
        List<Mentor> lista = estado == null ? mentores.findAll(Sort.by("id")) : mentores.findByEstado(estado);
        return lista.stream().map(MentorResponse::from).toList();
    }

    /** Aprovar ou rejeitar um mentor. */
    @Transactional
    public MentorResponse mudarEstadoMentor(Long id, EstadoMentor estado) {
        Mentor m = mentores.findById(id).orElseThrow(() -> naoEncontrado("Mentor não encontrado."));
        m.setEstado(estado);
        mentores.save(m);
        return MentorResponse.from(m);
    }

    // ---------------------------------------------------------------- Utilizadores

    public List<UtilizadorResponse> listarUtilizadores() {
        return utilizadores.findAll(Sort.by("id")).stream()
                .map(u -> UtilizadorResponse.from(u, mentores.findByUtilizadorId(u.getId()).orElse(null)))
                .toList();
    }

    @Transactional
    public UtilizadorResponse ativarDesativar(Long id, AtivoRequest req) {
        Utilizador u = utilizadores.findById(id).orElseThrow(() -> naoEncontrado("Utilizador não encontrado."));
        if (u.getPerfil() == Perfil.SUPERADMIN) throw pedidoInvalido("Não é possível desativar um SuperAdmin.");
        u.setAtivo(req.ativo());
        utilizadores.save(u);
        return UtilizadorResponse.from(u, mentores.findByUtilizadorId(id).orElse(null));
    }

    // ---------------------------------------------------------------- Convites

    public List<ConviteResponse> listarConvites() {
        return convites.findAllByOrderByIdDesc().stream().map(ConviteResponse::from).toList();
    }

    // ---------------------------------------------------------------- Auxiliares

    private void preencherBolsa(Bolsa b, BolsaRequest req) {
        if (vazio(req.nome()) || vazio(req.pais()) || req.tipo() == null || req.nivel() == null || req.prazo() == null)
            throw pedidoInvalido("Preenche o nome, o país, o tipo, o nível e o prazo.");
        b.setNome(req.nome().trim());
        b.setEntidade(req.entidade());
        b.setPais(req.pais().trim());
        b.setTipo(req.tipo());
        b.setAreaEstudo(req.areaEstudo());
        b.setNivel(req.nivel());
        b.setDescricao(req.descricao());
        b.setRequisitos(req.requisitos());
        b.setPrazo(req.prazo());
        b.setLinkOficial(req.linkOficial());
        b.setDestaque(req.destaque());
    }

    private void guardarDocumentos(Bolsa b, List<Long> ids) {
        if (ids == null) return;
        for (Long tipoId : ids.stream().distinct().toList()) {
            TipoDocumento t = tipos.findById(tipoId)
                    .orElseThrow(() -> pedidoInvalido("Documento com id " + tipoId + " não existe."));
            BolsaDocumento bd = new BolsaDocumento();
            bd.setBolsa(b);
            bd.setTipoDocumento(t);
            bolsaDocumentos.save(bd);
        }
    }

    private void preencherTipo(TipoDocumento t, TipoDocumentoDTO req) {
        if (vazio(req.nome())) throw pedidoInvalido("Indica o nome do documento.");
        if (req.tempoMedioDias() == null || req.tempoMedioDias() < 1)
            throw pedidoInvalido("O tempo médio tem de ser de pelo menos 1 dia.");
        t.setNome(req.nome().trim());
        t.setTempoMedioDias(req.tempoMedioDias());
        t.setDescricao(req.descricao());
    }
}
