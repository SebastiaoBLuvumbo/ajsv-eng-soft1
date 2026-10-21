package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.model.*;
import ao.ajsv.bolsas.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

import static ao.ajsv.bolsas.controller.Erros.*;

/**
 * Rotas do painel do estudante. {id} é o id do utilizador (estudante).
 * Aqui está a funcionalidade principal: o CALENDÁRIO DE DOCUMENTOS.
 */
@RestController
@RequestMapping("/api/estudante/{id}")
public class EstudanteController {

    private final UtilizadorRepository utilizadores;
    private final BolsaRepository bolsas;
    private final BolsaDocumentoRepository bolsaDocumentos;
    private final BolsaSeguidaRepository seguidas;
    private final DocumentoEstudanteRepository documentos;
    private final MentorRepository mentores;
    private final MentoriaRepository mentorias;
    private final AvaliacaoRepository avaliacoes;
    private final ConviteMentorRepository convites;

    public EstudanteController(UtilizadorRepository utilizadores, BolsaRepository bolsas,
                               BolsaDocumentoRepository bolsaDocumentos, BolsaSeguidaRepository seguidas,
                               DocumentoEstudanteRepository documentos, MentorRepository mentores,
                               MentoriaRepository mentorias, AvaliacaoRepository avaliacoes,
                               ConviteMentorRepository convites) {
        this.utilizadores = utilizadores;
        this.bolsas = bolsas;
        this.bolsaDocumentos = bolsaDocumentos;
        this.seguidas = seguidas;
        this.documentos = documentos;
        this.mentores = mentores;
        this.mentorias = mentorias;
        this.avaliacoes = avaliacoes;
        this.convites = convites;
    }

    // =====================================================================
    // BOLSAS SEGUIDAS + CALENDÁRIO DE DOCUMENTOS
    // =====================================================================

    /** Todas as bolsas que o estudante segue, cada uma com o seu calendário. Prazos mais próximos primeiro. */
    @GetMapping("/bolsas")
    public List<CalendarioResponse> bolsasSeguidas(@PathVariable Long id) {
        buscarEstudante(id);
        return seguidas.findByEstudanteId(id).stream()
                .sorted(Comparator.comparing(s -> s.getBolsa().getPrazo()))
                .map(this::montarCalendario)
                .toList();
    }

    /**
     * "Quero candidatar-me": o estudante passa a seguir a bolsa e o sistema calcula o calendário.
     *
     * CÁLCULO: para cada documento exigido pela bolsa,
     *     data limite para começar = prazo da bolsa - tempo médio do documento em Angola
     */
    @PostMapping("/bolsas/{bolsaId}/seguir")
    @ResponseStatus(HttpStatus.CREATED)
    public CalendarioResponse seguir(@PathVariable Long id, @PathVariable Long bolsaId) {
        Utilizador estudante = buscarEstudante(id);
        Bolsa bolsa = bolsas.findById(bolsaId).orElseThrow(() -> naoEncontrado("Bolsa não encontrada."));

        BolsaSeguida existente = seguidas.findByEstudanteIdAndBolsaId(id, bolsaId).orElse(null);
        if (existente != null) return montarCalendario(existente);

        if (bolsa.getPrazo().isBefore(LocalDate.now()))
            throw pedidoInvalido("O prazo desta bolsa já terminou.");

        BolsaSeguida seguida = new BolsaSeguida();
        seguida.setEstudante(estudante);
        seguida.setBolsa(bolsa);
        seguidas.save(seguida);

        for (BolsaDocumento bd : bolsaDocumentos.findByBolsaId(bolsaId)) {
            DocumentoEstudante doc = new DocumentoEstudante();
            doc.setEstudante(estudante);
            doc.setBolsa(bolsa);
            doc.setTipoDocumento(bd.getTipoDocumento());
            doc.setDataLimite(bolsa.getPrazo().minusDays(bd.getTipoDocumento().getTempoMedioDias()));
            documentos.save(doc);
        }
        return montarCalendario(seguida);
    }

    @DeleteMapping("/bolsas/{bolsaId}/seguir")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deixarDeSeguir(@PathVariable Long id, @PathVariable Long bolsaId) {
        BolsaSeguida seguida = seguidas.findByEstudanteIdAndBolsaId(id, bolsaId)
                .orElseThrow(() -> naoEncontrado("Não estás a seguir esta bolsa."));
        documentos.deleteByEstudanteIdAndBolsaId(id, bolsaId);
        seguidas.delete(seguida);
    }

    /** Muda o estado de um documento: POR_INICIAR, EM_CURSO ou CONCLUIDO. */
    @PutMapping("/documentos/{documentoId}/estado")
    public DocumentoEstudanteResponse mudarEstado(@PathVariable Long id, @PathVariable Long documentoId,
                                                  @RequestBody EstadoDocumentoRequest req) {
        if (req.estado() == null) throw pedidoInvalido("Indica o novo estado do documento.");
        DocumentoEstudante doc = documentos.findById(documentoId)
                .filter(d -> d.getEstudante().getId().equals(id))
                .orElseThrow(() -> naoEncontrado("Documento não encontrado."));
        doc.setEstado(req.estado());
        documentos.save(doc);
        return DocumentoEstudanteResponse.from(doc);
    }

    /**
     * O estudante indica que ganhou a bolsa.
     * O sistema envia-lhe automaticamente um convite para se tornar mentor (se ainda não for).
     */
    @PostMapping("/bolsas/{bolsaId}/ganha")
    public CalendarioResponse marcarGanha(@PathVariable Long id, @PathVariable Long bolsaId) {
        BolsaSeguida seguida = seguidas.findByEstudanteIdAndBolsaId(id, bolsaId)
                .orElseThrow(() -> naoEncontrado("Não estás a seguir esta bolsa."));
        seguida.setGanha(true);
        seguidas.save(seguida);

        boolean jaEMentor = mentores.findByUtilizadorId(id).isPresent();
        if (!jaEMentor && !convites.existsByEstudanteIdAndBolsaId(id, bolsaId)) {
            ConviteMentor convite = new ConviteMentor();
            convite.setEstudante(seguida.getEstudante());
            convite.setBolsa(seguida.getBolsa());
            convites.save(convite);
        }
        return montarCalendario(seguida);
    }

    // =====================================================================
    // CONVITES PARA MENTOR
    // =====================================================================

    @GetMapping("/convites")
    public List<ConviteResponse> listarConvites(@PathVariable Long id) {
        return convites.findByEstudanteIdOrderByIdDesc(id).stream().map(ConviteResponse::from).toList();
    }

    /** Aceitar cria um perfil de mentor PENDENTE, que segue para aprovação do SuperAdmin. */
    @PostMapping("/convites/{conviteId}/aceitar")
    public UtilizadorResponse aceitarConvite(@PathVariable Long id, @PathVariable Long conviteId,
                                             @RequestBody AceitarConviteRequest req) {
        ConviteMentor convite = buscarConvitePendente(id, conviteId);
        if (req.preco() == null || req.preco() <= 0)
            throw pedidoInvalido("Indica o preço da tua mentoria em Kz.");
        if (mentores.findByUtilizadorId(id).isPresent())
            throw conflito("Já tens um perfil de mentor.");

        Mentor mentor = new Mentor();
        mentor.setUtilizador(convite.getEstudante());
        mentor.setBolsaGanha(convite.getBolsa());
        mentor.setAnoBolsa(LocalDate.now().getYear());
        mentor.setDescricao(req.descricao());
        mentor.setPreco(req.preco());
        mentor.setProvaBolsa("Convite automático: o estudante marcou a bolsa como ganha na plataforma.");
        mentores.save(mentor);

        convite.setEstado(EstadoConvite.ACEITE);
        convites.save(convite);
        return UtilizadorResponse.from(convite.getEstudante(), mentor);
    }

    @PostMapping("/convites/{conviteId}/recusar")
    public ConviteResponse recusarConvite(@PathVariable Long id, @PathVariable Long conviteId) {
        ConviteMentor convite = buscarConvitePendente(id, conviteId);
        convite.setEstado(EstadoConvite.RECUSADO);
        convites.save(convite);
        return ConviteResponse.from(convite);
    }

    // =====================================================================
    // MENTORIAS
    // =====================================================================

    @GetMapping("/mentorias")
    public List<MentoriaResponse> listarMentorias(@PathVariable Long id) {
        return mentorias.findByEstudanteIdOrderByIdDesc(id).stream()
                .map(m -> MentoriaResponse.from(m, avaliacoes.findByMentoriaId(m.getId()).orElse(null)))
                .toList();
    }

    /** Contratar uma mentoria. O valor é o preço atual do mentor. */
    @PostMapping("/mentorias")
    @ResponseStatus(HttpStatus.CREATED)
    public MentoriaResponse contratar(@PathVariable Long id, @RequestBody MentoriaRequest req) {
        Utilizador estudante = buscarEstudante(id);
        if (req.mentorId() == null) throw pedidoInvalido("Escolhe um mentor.");
        Mentor mentor = mentores.findById(req.mentorId())
                .filter(m -> m.getEstado() == EstadoMentor.APROVADO)
                .orElseThrow(() -> naoEncontrado("Mentor não encontrado."));
        if (mentor.getUtilizador().getId().equals(id))
            throw pedidoInvalido("Não podes contratar uma mentoria contigo próprio.");

        Mentoria m = new Mentoria();
        m.setEstudante(estudante);
        m.setMentor(mentor);
        if (req.bolsaId() != null) m.setBolsa(bolsas.findById(req.bolsaId()).orElse(null));
        m.setValor(mentor.getPreco());
        m.setMensagem(req.mensagem());
        mentorias.save(m);
        return MentoriaResponse.from(m, null);
    }

    /** Avaliar uma mentoria concluída (1 a 5) e atualizar a média do mentor. */
    @PostMapping("/mentorias/{mentoriaId}/avaliar")
    public MentoriaResponse avaliar(@PathVariable Long id, @PathVariable Long mentoriaId,
                                    @RequestBody AvaliacaoRequest req) {
        Mentoria m = mentorias.findById(mentoriaId)
                .filter(x -> x.getEstudante().getId().equals(id))
                .orElseThrow(() -> naoEncontrado("Mentoria não encontrada."));
        if (m.getEstado() != EstadoMentoria.CONCLUIDA)
            throw pedidoInvalido("Só podes avaliar mentorias concluídas.");
        if (avaliacoes.findByMentoriaId(mentoriaId).isPresent())
            throw conflito("Já avaliaste esta mentoria.");
        if (req.nota() == null || req.nota() < 1 || req.nota() > 5)
            throw pedidoInvalido("A nota deve ser de 1 a 5.");

        Avaliacao a = new Avaliacao();
        a.setMentoria(m);
        a.setNota(req.nota());
        a.setComentario(req.comentario());
        avaliacoes.save(a);

        Mentor mentor = m.getMentor();
        List<Avaliacao> todas = avaliacoes.findByMentoriaMentorId(mentor.getId());
        double media = todas.stream().mapToInt(Avaliacao::getNota).average().orElse(0);
        mentor.setAvaliacaoMedia(Math.round(media * 10) / 10.0);
        mentor.setTotalAvaliacoes(todas.size());
        mentores.save(mentor);

        return MentoriaResponse.from(m, a);
    }

    // =====================================================================
    // AUXILIARES
    // =====================================================================

    private Utilizador buscarEstudante(Long id) {
        return utilizadores.findById(id)
                .filter(u -> u.getPerfil() == Perfil.ESTUDANTE)
                .orElseThrow(() -> naoEncontrado("Estudante não encontrado."));
    }

    private ConviteMentor buscarConvitePendente(Long id, Long conviteId) {
        ConviteMentor c = convites.findById(conviteId)
                .filter(x -> x.getEstudante().getId().equals(id))
                .orElseThrow(() -> naoEncontrado("Convite não encontrado."));
        if (c.getEstado() != EstadoConvite.PENDENTE) throw conflito("Este convite já foi respondido.");
        return c;
    }

    /** Junta a bolsa seguida, os documentos (com alertas) e, se houver alertas, mentores sugeridos. */
    private CalendarioResponse montarCalendario(BolsaSeguida s) {
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
