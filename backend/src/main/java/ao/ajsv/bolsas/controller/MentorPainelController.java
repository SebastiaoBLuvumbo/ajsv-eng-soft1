package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.service.MentorPainelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Rotas do painel do mentor. {id} é o id do MENTOR (não do utilizador). As regras estão no {@link MentorPainelService}. */
@RestController
@RequestMapping("/api/mentor/{id}")
public class MentorPainelController {

    private final MentorPainelService service;

    public MentorPainelController(MentorPainelService service) {
        this.service = service;
    }

    @GetMapping("/perfil")
    public MentorResponse perfil(@PathVariable Long id) {
        return service.perfil(id);
    }

    @PutMapping("/perfil")
    public MentorResponse editarPerfil(@PathVariable Long id, @RequestBody MentorPerfilRequest req) {
        return service.editarPerfil(id, req);
    }

    @GetMapping("/mentorias")
    public List<MentoriaResponse> listarMentorias(@PathVariable Long id) {
        return service.listarMentorias(id);
    }

    /** acao = aceitar | recusar | concluir */
    @PutMapping("/mentorias/{mentoriaId}/{acao}")
    public MentoriaResponse mudarEstado(@PathVariable Long id, @PathVariable Long mentoriaId,
                                        @PathVariable String acao) {
        return service.mudarEstado(id, mentoriaId, acao);
    }

    @GetMapping("/ganhos")
    public GanhosResponse ganhos(@PathVariable Long id) {
        return service.ganhos(id);
    }
}
