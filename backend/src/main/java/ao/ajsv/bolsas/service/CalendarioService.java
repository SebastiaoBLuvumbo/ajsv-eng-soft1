package ao.ajsv.bolsas.service;

import ao.ajsv.bolsas.dto.CalendarioResponse;
import ao.ajsv.bolsas.dto.DocumentoEstudanteResponse;
import ao.ajsv.bolsas.dto.MentorResponse;
import ao.ajsv.bolsas.model.*;
import ao.ajsv.bolsas.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

import static ao.ajsv.bolsas.service.Erros.*;

/**
 * Regras de negócio do CALENDÁRIO DE DOCUMENTOS (a funcionalidade principal).
 * Os controllers só recebem o pedido HTTP e chamam este serviço; o cálculo vive apenas aqui.
 *
 * CÁLCULO: data limite para começar = prazo da bolsa - tempo médio do documento em Angola
 */
@Service
public class CalendarioService {

    private final BolsaSeguidaRepository seguidas;
    private final BolsaDocumentoRepository bolsaDocumentos;
    private final DocumentoEstudanteRepository documentos;
    private final MentorRepository mentores;

    public CalendarioService(BolsaSeguidaRepository seguidas, BolsaDocumentoRepository bolsaDocumentos,
                             DocumentoEstudanteRepository documentos, MentorRepository mentores) {
        this.seguidas = seguidas;
        this.bolsaDocumentos = bolsaDocumentos;
        this.documentos = documentos;
        this.mentores = mentores;
    }

    /** A fórmula do calendário, num único sítio. */
    public static LocalDate calcularDataLimite(LocalDate prazoBolsa, int tempoMedioDias) {
        return prazoBolsa.minusDays(tempoMedioDias);
    }

    /**
     * "Quero candidatar-me": o estudante passa a seguir a bolsa e é criado um documento por cada
     * documento exigido, já com a data limite. Se já seguia a bolsa, devolve o calendário existente.
     */
    @Transactional
    public CalendarioResponse seguir(Utilizador estudante, Bolsa bolsa) {
        BolsaSeguida existente = seguidas.findByEstudanteIdAndBolsaId(estudante.getId(), bolsa.getId()).orElse(null);
        if (existente != null) return montarCalendario(existente);

        if (bolsa.getPrazo().isBefore(LocalDate.now()))
            throw pedidoInvalido("O prazo desta bolsa já terminou.");

        BolsaSeguida seguida = new BolsaSeguida();
        seguida.setEstudante(estudante);
        seguida.setBolsa(bolsa);
        seguidas.save(seguida);

        for (BolsaDocumento bd : bolsaDocumentos.findByBolsaId(bolsa.getId())) {
            DocumentoEstudante doc = new DocumentoEstudante();
            doc.setEstudante(estudante);
            doc.setBolsa(bolsa);
            doc.setTipoDocumento(bd.getTipoDocumento());
            doc.setDataLimite(calcularDataLimite(bolsa.getPrazo(), bd.getTipoDocumento().getTempoMedioDias()));
            documentos.save(doc);
        }
        return montarCalendario(seguida);
    }

    /** Apaga os documentos e a ligação à bolsa, tudo ou nada. */
    @Transactional
    public void deixarDeSeguir(Long estudanteId, Long bolsaId) {
        BolsaSeguida seguida = seguidas.findByEstudanteIdAndBolsaId(estudanteId, bolsaId)
                .orElseThrow(() -> naoEncontrado("Não estás a seguir esta bolsa."));
        documentos.deleteByEstudanteIdAndBolsaId(estudanteId, bolsaId);
        seguidas.delete(seguida);
    }

    /** O prazo da bolsa mudou: recalcula as datas limite de todos os estudantes que a seguem. */
    @Transactional
    public void recalcularPorBolsa(Bolsa bolsa) {
        for (DocumentoEstudante d : documentos.findByBolsaId(bolsa.getId())) {
            d.setDataLimite(calcularDataLimite(bolsa.getPrazo(), d.getTipoDocumento().getTempoMedioDias()));
            documentos.save(d);
        }
    }

    /** O tempo médio de um documento mudou: recalcula as datas limite que o usam. */
    @Transactional
    public void recalcularPorTipo(TipoDocumento tipo) {
        for (DocumentoEstudante d : documentos.findByTipoDocumentoId(tipo.getId())) {
            d.setDataLimite(calcularDataLimite(d.getBolsa().getPrazo(), tipo.getTempoMedioDias()));
            documentos.save(d);
        }
    }

    /** Junta a bolsa seguida, os documentos (com alertas) e, se houver alertas, mentores sugeridos. */
    @Transactional(readOnly = true)
    public CalendarioResponse montarCalendario(BolsaSeguida s) {
        Bolsa b = s.getBolsa();
        Long estudanteId = s.getEstudante().getId();

        List<DocumentoEstudanteResponse> docs = documentos.findByEstudanteIdAndBolsaId(estudanteId, b.getId())
                .stream()
                .sorted(Comparator.comparing(DocumentoEstudante::getDataLimite))
                .map(DocumentoEstudanteResponse::from)
                .toList();

        int concluidos = (int) docs.stream().filter(d -> d.estado() == EstadoDocumento.CONCLUIDO).count();
        boolean temAlerta = !s.isGanha() && docs.stream().anyMatch(d -> !d.alerta().equals("OK"));

        List<MentorResponse> sugeridos = List.of();
        if (temAlerta) {
            // Primeiro, mentores que ganharam ESTA bolsa. Se não houver, os mais bem avaliados.
            List<Mentor> candidatos = mentores.findByEstadoAndBolsaGanhaId(EstadoMentor.APROVADO, b.getId());
            if (candidatos.isEmpty()) candidatos = mentores.findByEstado(EstadoMentor.APROVADO);
            sugeridos = candidatos.stream()
                    .filter(m -> !m.getUtilizador().getId().equals(estudanteId))
                    .sorted(Comparator.comparing(Mentor::getAvaliacaoMedia, Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(3)
                    .map(MentorResponse::from)
                    .toList();
        }

        return new CalendarioResponse(b.getId(), b.getNome(), b.getPais(), b.getPrazo(),
                ChronoUnit.DAYS.between(LocalDate.now(), b.getPrazo()), s.isGanha(),
                docs, concluidos, temAlerta, sugeridos);
    }
}
