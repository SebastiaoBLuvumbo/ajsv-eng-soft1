package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.MentorResponse;
import ao.ajsv.bolsas.model.EstadoMentor;
import ao.ajsv.bolsas.model.Mentor;
import ao.ajsv.bolsas.repository.MentorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

import static ao.ajsv.bolsas.controller.Erros.*;

/** Rotas públicas dos mentores. Só mostra mentores aprovados pelo SuperAdmin. */
@RestController
@RequestMapping("/api/mentores")
public class MentorController {

    private final MentorRepository mentores;

    public MentorController(MentorRepository mentores) {
        this.mentores = mentores;
    }

    /** Lista os mentores verificados, os mais bem avaliados primeiro. Pode filtrar pela bolsa que ganharam. */
    @GetMapping
    public List<MentorResponse> listar(@RequestParam(required = false) Long bolsaId) {
        List<Mentor> lista = bolsaId == null
                ? mentores.findByEstado(EstadoMentor.APROVADO)
                : mentores.findByEstadoAndBolsaGanhaId(EstadoMentor.APROVADO, bolsaId);
        return lista.stream()
                .sorted(Comparator.comparing(Mentor::getAvaliacaoMedia, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(MentorResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public MentorResponse detalhe(@PathVariable Long id) {
        Mentor m = mentores.findById(id)
                .filter(x -> x.getEstado() == EstadoMentor.APROVADO)
                .orElseThrow(() -> naoEncontrado("Mentor não encontrado."));
        return MentorResponse.from(m);
    }
}
