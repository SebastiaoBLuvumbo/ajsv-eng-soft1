package ao.ajsv.bolsas.service;

import ao.ajsv.bolsas.dto.MentorResponse;
import ao.ajsv.bolsas.model.EstadoMentor;
import ao.ajsv.bolsas.model.Mentor;
import ao.ajsv.bolsas.repository.MentorRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

import static ao.ajsv.bolsas.service.Erros.*;

/** Consulta pública dos mentores. Só mostra mentores aprovados pelo SuperAdmin. */
@Service
public class MentorService {

    private final MentorRepository mentores;

    public MentorService(MentorRepository mentores) {
        this.mentores = mentores;
    }

    /** Lista os mentores verificados, os mais bem avaliados primeiro. Pode filtrar pela bolsa que ganharam. */
    public List<MentorResponse> listar(Long bolsaId) {
        List<Mentor> lista = bolsaId == null
                ? mentores.findByEstado(EstadoMentor.APROVADO)
                : mentores.findByEstadoAndBolsaGanhaId(EstadoMentor.APROVADO, bolsaId);
        return lista.stream()
                .sorted(Comparator.comparing(Mentor::getAvaliacaoMedia, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(MentorResponse::from)
                .toList();
    }

    public MentorResponse detalhe(Long id) {
        Mentor m = mentores.findById(id)
                .filter(x -> x.getEstado() == EstadoMentor.APROVADO)
                .orElseThrow(() -> naoEncontrado("Mentor não encontrado."));
        return MentorResponse.from(m);
    }
}
