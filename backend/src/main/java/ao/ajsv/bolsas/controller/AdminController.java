package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.model.*;
import ao.ajsv.bolsas.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ao.ajsv.bolsas.controller.Erros.*;

/**
 * Rotas do painel do SuperAdmin.
 * Nota: para manter o projeto simples não há JWT. Numa versão real estas rotas seriam protegidas com Spring Security.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BolsaRepository bolsas;
    private final TipoDocumentoRepository tipos;
    private final BolsaDocumentoRepository bolsaDocumentos;
    private final DocumentoEstudanteRepository documentos;
    private final BolsaSeguidaRepository seguidas;
    private final MentorRepository mentores;
    private final MentoriaRepository mentorias;
    private final UtilizadorRepository utilizadores;
    private final ConviteMentorRepository convites;

    public AdminController(BolsaRepository bolsas, TipoDocumentoRepository tipos,
                           BolsaDocumentoRepository bolsaDocumentos, DocumentoEstudanteRepository documentos,
                           BolsaSeguidaRepository seguidas, MentorRepository mentores,
                           MentoriaRepository mentorias, UtilizadorRepository utilizadores,
                           ConviteMentorRepository convites) {
        this.bolsas = bolsas;
        this.tipos = tipos;
        this.bolsaDocumentos = bolsaDocumentos;
        this.documentos = documentos;
        this.seguidas = seguidas;
        this.mentores = mentores;
        this.mentorias = mentorias;
        this.utilizadores = utilizadores;
        this.convites = convites;
    }

    // ---------------------------------------------------------------- Estatísticas

    @GetMapping("/estatisticas")
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
    @GetMapping("/bolsas")
    public List<BolsaResponse> listarBolsas() {
        return bolsas.findAll(Sort.by("prazo")).stream()
                .map(b -> BolsaResponse.from(b, bolsaDocumentos.findByBolsaId(b.getId())))
                .toList();
    }

    @PostMapping("/bolsas")
    @ResponseStatus(HttpStatus.CREATED)
    public BolsaResponse criarBolsa(@RequestBody BolsaRequest req) {
        Bolsa b = new Bolsa();
        preencherBolsa(b, req);
        bolsas.save(b);
        guardarDocumentos(b, req.documentosIds());
        return BolsaResponse.from(b, bolsaDocumentos.findByBolsaId(b.getId()));
    }

    @PutMapping("/bolsas/{id}")
    public BolsaResponse editarBolsa(@PathVariable Long id, @RequestBody BolsaRequest req) {
        Bolsa b = bolsas.findById(id).orElseThrow(() -> naoEncontrado("Bolsa não encontrada."));
        preencherBolsa(b, req);
        bolsas.save(b);
        bolsaDocumentos.deleteByBolsaId(id);
        guardarDocumentos(b, req.documentosIds());

        // Se o prazo mudou, recalcula as datas limite dos estudantes que já seguem esta bolsa
        for (DocumentoEstudante d : documentos.findByBolsaId(id)) {
            d.setDataLimite(b.getPrazo().minusDays(d.getTipoDocumento().getTempoMedioDias()));
            documentos.save(d);
        }
        return BolsaResponse.from(b, bolsaDocumentos.findByBolsaId(id));
    }

    @DeleteMapping("/bolsas/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagarBolsa(@PathVariable Long id) {
        if (!bolsas.existsById(id)) throw naoEncontrado("Bolsa não encontrada.");
        if (seguidas.existsByBolsaId(id) || mentores.existsByBolsaGanhaId(id)
                || mentorias.existsByBolsaId(id) || convites.existsByBolsaId(id))
            throw conflito("Não é possível apagar: há estudantes, mentores ou mentorias ligados a esta bolsa.");
        bolsaDocumentos.deleteByBolsaId(id);
        bolsas.deleteById(id);
    }

    // ---------------------------------------------------------------- Tipos de documento (CRUD)

    @GetMapping("/tipos-documento")
    public List<TipoDocumentoDTO> listarTipos() {
        return tipos.findAllByOrderByNomeAsc().stream().map(TipoDocumentoDTO::from).toList();
    }

    @PostMapping("/tipos-documento")
    @ResponseStatus(HttpStatus.CREATED)
    public TipoDocumentoDTO criarTipo(@RequestBody TipoDocumentoDTO req) {
        TipoDocumento t = new TipoDocumento();
        preencherTipo(t, req);
        return TipoDocumentoDTO.from(tipos.save(t));
    }

    @PutMapping("/tipos-documento/{id}")
    public TipoDocumentoDTO editarTipo(@PathVariable Long id, @RequestBody TipoDocumentoDTO req) {
        TipoDocumento t = tipos.findById(id).orElseThrow(() -> naoEncontrado("Documento não encontrado."));
        preencherTipo(t, req);
        tipos.save(t);

        // O tempo médio mudou: recalcula as datas limite que usam este documento
        for (DocumentoEstudante d : documentos.findByTipoDocumentoId(id)) {
            d.setDataLimite(d.getBolsa().getPrazo().minusDays(t.getTempoMedioDias()));
            documentos.save(d);
        }
        return TipoDocumentoDTO.from(t);
    }

    @DeleteMapping("/tipos-documento/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagarTipo(@PathVariable Long id) {
        if (!tipos.existsById(id)) throw naoEncontrado("Documento não encontrado.");
        if (bolsaDocumentos.existsByTipoDocumentoId(id) || documentos.existsByTipoDocumentoId(id))
            throw conflito("Não é possível apagar: este documento é exigido por uma ou mais bolsas.");
        tipos.deleteById(id);
    }

    // ---------------------------------------------------------------- Mentores

    /** estado (opcional): PENDENTE, APROVADO ou REJEITADO */
    @GetMapping("/mentores")
    public List<MentorResponse> listarMentores(@RequestParam(required = false) EstadoMentor estado) {
        List<Mentor> lista = estado == null ? mentores.findAll(Sort.by("id")) : mentores.findByEstado(estado);
        return lista.stream().map(MentorResponse::from).toList();
    }

    @PutMapping("/mentores/{id}/aprovar")
    public MentorResponse aprovarMentor(@PathVariable Long id) {
        return mudarEstadoMentor(id, EstadoMentor.APROVADO);
    }

    @PutMapping("/mentores/{id}/rejeitar")
    public MentorResponse rejeitarMentor(@PathVariable Long id) {
        return mudarEstadoMentor(id, EstadoMentor.REJEITADO);
    }

    // ---------------------------------------------------------------- Utilizadores

    @GetMapping("/utilizadores")
    public List<UtilizadorResponse> listarUtilizadores() {
        return utilizadores.findAll(Sort.by("id")).stream()
                .map(u -> UtilizadorResponse.from(u, mentores.findByUtilizadorId(u.getId()).orElse(null)))
                .toList();
    }

    @PutMapping("/utilizadores/{id}/ativo")
    public UtilizadorResponse ativarDesativar(@PathVariable Long id, @RequestBody AtivoRequest req) {
        Utilizador u = utilizadores.findById(id).orElseThrow(() -> naoEncontrado("Utilizador não encontrado."));
        if (u.getPerfil() == Perfil.SUPERADMIN) throw pedidoInvalido("Não é possível desativar um SuperAdmin.");
        u.setAtivo(req.ativo());
        utilizadores.save(u);
        return UtilizadorResponse.from(u, mentores.findByUtilizadorId(id).orElse(null));
    }

    // ---------------------------------------------------------------- Convites

    @GetMapping("/convites")
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

    private MentorResponse mudarEstadoMentor(Long id, EstadoMentor estado) {
        Mentor m = mentores.findById(id).orElseThrow(() -> naoEncontrado("Mentor não encontrado."));
        m.setEstado(estado);
        mentores.save(m);
        return MentorResponse.from(m);
    }
}
