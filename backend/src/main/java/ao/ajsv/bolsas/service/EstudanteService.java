package ao.ajsv.bolsas.service;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.model.*;
import ao.ajsv.bolsas.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import static ao.ajsv.bolsas.service.Erros.*;

/**
 * Regras do painel do estudante: bolsas seguidas, documentos, convites para mentor e mentorias.
 * O cálculo do calendário está no {@link CalendarioService}.
 */
@Service
public class EstudanteService {

    private final UtilizadorRepository utilizadores;
    private final BolsaRepository bolsas;
    private final BolsaSeguidaRepository seguidas;
    private final DocumentoEstudanteRepository documentos;
    private final MentorRepository mentores;
    private final MentoriaRepository mentorias;
    private final AvaliacaoRepository avaliacoes;
    private final ConviteMentorRepository convites;
    private final CalendarioService calendario;

    public EstudanteService(UtilizadorRepository utilizadores, BolsaRepository bolsas,
                            BolsaSeguidaRepository seguidas, DocumentoEstudanteRepository documentos,
                            MentorRepository mentores, MentoriaRepository mentorias,
                            AvaliacaoRepository avaliacoes, ConviteMentorRepository convites,
                            CalendarioService calendario) {
        this.utilizadores = utilizadores;
        this.bolsas = bolsas;
        this.seguidas = seguidas;
        this.documentos = documentos;
        this.mentores = mentores;
        this.mentorias = mentorias;
        this.avaliacoes = avaliacoes;
        this.convites = convites;
        this.calendario = calendario;
    }

    // =====================================================================
    // BOLSAS SEGUIDAS + CALENDÁRIO DE DOCUMENTOS
    // =====================================================================

    /** Todas as bolsas que o estudante segue, cada uma com o seu calendário. Prazos mais próximos primeiro. */
    public List<CalendarioResponse> bolsasSeguidas(Long estudanteId) {
        buscarEstudante(estudanteId);
        return seguidas.findByEstudanteId(estudanteId).stream()
                .sorted(Comparator.comparing(s -> s.getBolsa().getPrazo()))
                .map(calendario::montarCalendario)
                .toList();
    }

    /** "Quero candidatar-me": confirma o estudante e a bolsa e pede ao CalendarioService para calcular as datas. */
    public CalendarioResponse seguir(Long estudanteId, Long bolsaId) {
        Utilizador estudante = buscarEstudante(estudanteId);
        Bolsa bolsa = bolsas.findById(bolsaId).orElseThrow(() -> naoEncontrado("Bolsa não encontrada."));
        return calendario.seguir(estudante, bolsa);
    }

    public void deixarDeSeguir(Long estudanteId, Long bolsaId) {
        calendario.deixarDeSeguir(estudanteId, bolsaId);
    }

    /** Muda o estado de um documento: POR_INICIAR, EM_CURSO ou CONCLUIDO. */
    @Transactional
    public DocumentoEstudanteResponse mudarEstadoDocumento(Long estudanteId, Long documentoId, EstadoDocumentoRequest req) {
        if (req.estado() == null) throw pedidoInvalido("Indica o novo estado do documento.");
        DocumentoEstudante doc = documentos.findById(documentoId)
                .filter(d -> d.getEstudante().getId().equals(estudanteId))
                .orElseThrow(() -> naoEncontrado("Documento não encontrado."));
        doc.setEstado(req.estado());
        documentos.save(doc);
        return DocumentoEstudanteResponse.from(doc);
    }

    /**
     * O estudante indica que ganhou a bolsa.
     * O sistema envia-lhe automaticamente um convite para se tornar mentor (se ainda não for).
     */
    @Transactional
    public CalendarioResponse marcarGanha(Long estudanteId, Long bolsaId) {
        BolsaSeguida seguida = seguidas.findByEstudanteIdAndBolsaId(estudanteId, bolsaId)
                .orElseThrow(() -> naoEncontrado("Não estás a seguir esta bolsa."));
        seguida.setGanha(true);
        seguidas.save(seguida);

        boolean jaEMentor = mentores.findByUtilizadorId(estudanteId).isPresent();
        if (!jaEMentor && !convites.existsByEstudanteIdAndBolsaId(estudanteId, bolsaId)) {
            ConviteMentor convite = new ConviteMentor();
            convite.setEstudante(seguida.getEstudante());
            convite.setBolsa(seguida.getBolsa());
            convites.save(convite);
        }
        return calendario.montarCalendario(seguida);
    }

    // =====================================================================
    // CONVITES PARA MENTOR
    // =====================================================================

    public List<ConviteResponse> listarConvites(Long estudanteId) {
        return convites.findByEstudanteIdOrderByIdDesc(estudanteId).stream().map(ConviteResponse::from).toList();
    }

    /** Aceitar cria um perfil de mentor PENDENTE, que segue para aprovação do SuperAdmin. */
    @Transactional
    public UtilizadorResponse aceitarConvite(Long estudanteId, Long conviteId, AceitarConviteRequest req) {
        ConviteMentor convite = buscarConvitePendente(estudanteId, conviteId);
        if (req.preco() == null || req.preco() <= 0)
            throw pedidoInvalido("Indica o preço da tua mentoria em Kz.");
        if (mentores.findByUtilizadorId(estudanteId).isPresent())
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

    @Transactional
    public ConviteResponse recusarConvite(Long estudanteId, Long conviteId) {
        ConviteMentor convite = buscarConvitePendente(estudanteId, conviteId);
        convite.setEstado(EstadoConvite.RECUSADO);
        convites.save(convite);
        return ConviteResponse.from(convite);
    }

    // =====================================================================
    // MENTORIAS
    // =====================================================================

    public List<MentoriaResponse> listarMentorias(Long estudanteId) {
        return mentorias.findByEstudanteIdOrderByIdDesc(estudanteId).stream()
                .map(m -> MentoriaResponse.from(m, avaliacoes.findByMentoriaId(m.getId()).orElse(null)))
                .toList();
    }

    /** Contratar uma mentoria. O valor é o preço atual do mentor. */
    @Transactional
    public MentoriaResponse contratar(Long estudanteId, MentoriaRequest req) {
        Utilizador estudante = buscarEstudante(estudanteId);
        if (req.mentorId() == null) throw pedidoInvalido("Escolhe um mentor.");
        Mentor mentor = mentores.findById(req.mentorId())
                .filter(m -> m.getEstado() == EstadoMentor.APROVADO)
                .orElseThrow(() -> naoEncontrado("Mentor não encontrado."));
        if (mentor.getUtilizador().getId().equals(estudanteId))
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
    @Transactional
    public MentoriaResponse avaliar(Long estudanteId, Long mentoriaId, AvaliacaoRequest req) {
        Mentoria m = mentorias.findById(mentoriaId)
                .filter(x -> x.getEstudante().getId().equals(estudanteId))
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

    private ConviteMentor buscarConvitePendente(Long estudanteId, Long conviteId) {
        ConviteMentor c = convites.findById(conviteId)
                .filter(x -> x.getEstudante().getId().equals(estudanteId))
                .orElseThrow(() -> naoEncontrado("Convite não encontrado."));
        if (c.getEstado() != EstadoConvite.PENDENTE) throw conflito("Este convite já foi respondido.");
        return c;
    }
}
