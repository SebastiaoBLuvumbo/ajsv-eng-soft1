package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.MentorResponse;
import ao.ajsv.bolsas.service.MentorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Rotas públicas dos mentores. As regras estão no {@link MentorService}. */
@RestController
@RequestMapping("/api/mentores")
public class MentorController {

    private final MentorService service;

    public MentorController(MentorService service) {
        this.service = service;
    }

    /** bolsaId (opcional): só os mentores que ganharam essa bolsa. */
    @GetMapping
    public List<MentorResponse> listar(@RequestParam(required = false) Long bolsaId) {
        return service.listar(bolsaId);
    }

    @GetMapping("/{id}")
    public MentorResponse detalhe(@PathVariable Long id) {
        return service.detalhe(id);
    }
}
