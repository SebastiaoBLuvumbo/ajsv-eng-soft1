package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.model.EstadoMentoria;
import ao.ajsv.bolsas.model.Mentor;
import ao.ajsv.bolsas.model.Mentoria;
import ao.ajsv.bolsas.repository.AvaliacaoRepository;
import ao.ajsv.bolsas.repository.MentorRepository;
import ao.ajsv.bolsas.repository.MentoriaRepository;
import ao.ajsv.bolsas.repository.UtilizadorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ao.ajsv.bolsas.controller.Erros.*;

/** Rotas do painel do mentor. {id} é o id do MENTOR (não do utilizador). */
@RestController
@RequestMapping("/api/mentor/{id}")
public class MentorPainelController {

    private final MentorRepository mentores;
    private final MentoriaRepository mentorias;
    private final AvaliacaoRepository avaliacoes;
    private final UtilizadorRepository utilizadores;

    public MentorPainelController(MentorRepository mentores, MentoriaRepository mentorias,
                                  AvaliacaoRepository avaliacoes, UtilizadorRepository utilizadores) {
        this.mentores = mentores;
        this.mentorias = mentorias;
        this.avaliacoes = avaliacoes;
        this.utilizadores = utilizadores;
    }

    @GetMapping("/perfil")
    public MentorResponse perfil(@PathVariable Long id) {
        return MentorResponse.from(buscarMentor(id));
    }

    @PutMapping("/perfil")
    public MentorResponse editarPerfil(@PathVariable Long id, @RequestBody MentorPerfilRequest req) {
        Mentor m = buscarMentor(id);
        if (req.preco() != null) {
            if (req.preco() <= 0) throw pedidoInvalido("O preço tem de ser maior que zero.");
            m.setPreco(req.preco());
        }
        if (req.descricao() != null) m.setDescricao(req.descricao());
        if (req.fotoUrl() != null) m.setFotoUrl(req.fotoUrl().isBlank() ? null : req.fotoUrl());
        if (req.anoBolsa() != null) m.setAnoBolsa(req.anoBolsa());
        if (req.telefone() != null) {
            m.getUtilizador().setTelefone(req.telefone());
            utilizadores.save(m.getUtilizador());
        }
        mentores.save(m);
        return MentorResponse.from(m);
    }

    @GetMapping("/mentorias")
    public List<MentoriaResponse> listarMentorias(@PathVariable Long id) {
        buscarMentor(id);
        return mentorias.findByMentorIdOrderByIdDesc(id).stream()
                .map(m -> MentoriaResponse.from(m, avaliacoes.findByMentoriaId(m.getId()).orElse(null)))
                .toList();
    }

    /** acao = aceitar | recusar | concluir */
    @PutMapping("/mentorias/{mentoriaId}/{acao}")
    public MentoriaResponse mudarEstado(@PathVariable Long id, @PathVariable Long mentoriaId,
                                        @PathVariable String acao) {
        Mentoria m = mentorias.findById(mentoriaId)
                .filter(x -> x.getMentor().getId().equals(id))
                .orElseThrow(() -> naoEncontrado("Mentoria não encontrada."));

        switch (acao) {
            case "aceitar" -> {
                exigirEstado(m, EstadoMentoria.PENDENTE);
                m.setEstado(EstadoMentoria.ACEITE);
            }
            case "recusar" -> {
                exigirEstado(m, EstadoMentoria.PENDENTE);
                m.setEstado(EstadoMentoria.RECUSADA);
            }
            case "concluir" -> {
                exigirEstado(m, EstadoMentoria.ACEITE);
                m.setEstado(EstadoMentoria.CONCLUIDA);
            }
            default -> throw pedidoInvalido("Ação desconhecida: " + acao);
        }
        mentorias.save(m);
        return MentoriaResponse.from(m, avaliacoes.findByMentoriaId(m.getId()).orElse(null));
    }

    /** Resumo dos ganhos: só contam as mentorias concluídas. */
    @GetMapping("/ganhos")
    public GanhosResponse ganhos(@PathVariable Long id) {
        Mentor mentor = buscarMentor(id);
        List<Mentoria> lista = mentorias.findByMentorIdOrderByIdDesc(id);
        long total = lista.stream().filter(m -> m.getEstado() == EstadoMentoria.CONCLUIDA).mapToLong(Mentoria::getValor).sum();
        return new GanhosResponse(total,
                contar(lista, EstadoMentoria.CONCLUIDA),
                contar(lista, EstadoMentoria.PENDENTE),
                contar(lista, EstadoMentoria.ACEITE),
                mentor.getAvaliacaoMedia() == null ? 0 : mentor.getAvaliacaoMedia());
    }

    private Mentor buscarMentor(Long id) {
        return mentores.findById(id).orElseThrow(() -> naoEncontrado("Mentor não encontrado."));
    }

    private static void exigirEstado(Mentoria m, EstadoMentoria esperado) {
        if (m.getEstado() != esperado)
            throw conflito("Esta mentoria não pode mudar de estado agora (estado atual: " + m.getEstado() + ").");
    }

    private static long contar(List<Mentoria> lista, EstadoMentoria estado) {
        return lista.stream().filter(m -> m.getEstado() == estado).count();
    }
}
