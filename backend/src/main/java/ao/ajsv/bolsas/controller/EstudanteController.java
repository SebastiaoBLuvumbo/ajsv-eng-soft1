package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.service.EstudanteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Rotas do painel do estudante. {id} é o id do utilizador (estudante).
 * As regras estão no {@link EstudanteService}; o calendário de documentos no CalendarioService.
 */
@RestController
@RequestMapping("/api/estudante/{id}")
public class EstudanteController {

    private final EstudanteService service;

    public EstudanteController(EstudanteService service) {
        this.service = service;
    }

    // ---------------------------------------------------------------- Bolsas seguidas + calendário

    @GetMapping("/bolsas")
    public List<CalendarioResponse> bolsasSeguidas(@PathVariable Long id) {
        return service.bolsasSeguidas(id);
    }

    /** "Quero candidatar-me": passa a seguir a bolsa e o sistema calcula o calendário. */
    @PostMapping("/bolsas/{bolsaId}/seguir")
    @ResponseStatus(HttpStatus.CREATED)
    public CalendarioResponse seguir(@PathVariable Long id, @PathVariable Long bolsaId) {
        return service.seguir(id, bolsaId);
    }

    @DeleteMapping("/bolsas/{bolsaId}/seguir")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deixarDeSeguir(@PathVariable Long id, @PathVariable Long bolsaId) {
        service.deixarDeSeguir(id, bolsaId);
    }

    @PutMapping("/documentos/{documentoId}/estado")
    public DocumentoEstudanteResponse mudarEstado(@PathVariable Long id, @PathVariable Long documentoId,
                                                  @RequestBody EstadoDocumentoRequest req) {
        return service.mudarEstadoDocumento(id, documentoId, req);
    }

    /** O estudante ganhou a bolsa: recebe um convite para ser mentor. */
    @PostMapping("/bolsas/{bolsaId}/ganha")
    public CalendarioResponse marcarGanha(@PathVariable Long id, @PathVariable Long bolsaId) {
        return service.marcarGanha(id, bolsaId);
    }

    // ---------------------------------------------------------------- Convites para mentor

    @GetMapping("/convites")
    public List<ConviteResponse> listarConvites(@PathVariable Long id) {
        return service.listarConvites(id);
    }

    @PostMapping("/convites/{conviteId}/aceitar")
    public UtilizadorResponse aceitarConvite(@PathVariable Long id, @PathVariable Long conviteId,
                                             @RequestBody AceitarConviteRequest req) {
        return service.aceitarConvite(id, conviteId, req);
    }

    @PostMapping("/convites/{conviteId}/recusar")
    public ConviteResponse recusarConvite(@PathVariable Long id, @PathVariable Long conviteId) {
        return service.recusarConvite(id, conviteId);
    }

    // ---------------------------------------------------------------- Mentorias

    @GetMapping("/mentorias")
    public List<MentoriaResponse> listarMentorias(@PathVariable Long id) {
        return service.listarMentorias(id);
    }

    @PostMapping("/mentorias")
    @ResponseStatus(HttpStatus.CREATED)
    public MentoriaResponse contratar(@PathVariable Long id, @RequestBody MentoriaRequest req) {
        return service.contratar(id, req);
    }

    @PostMapping("/mentorias/{mentoriaId}/avaliar")
    public MentoriaResponse avaliar(@PathVariable Long id, @PathVariable Long mentoriaId,
                                    @RequestBody AvaliacaoRequest req) {
        return service.avaliar(id, mentoriaId, req);
    }
}
