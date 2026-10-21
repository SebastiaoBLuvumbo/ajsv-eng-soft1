package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.Bolsa;
import ao.ajsv.bolsas.model.EstadoMentor;
import ao.ajsv.bolsas.model.Mentor;
import ao.ajsv.bolsas.model.Utilizador;

public record MentorResponse(
        Long id, Long utilizadorId, String nome, String email, String telefone,
        Long bolsaGanhaId, String bolsaGanhaNome, String bolsaGanhaPais, Integer anoBolsa,
        String descricao, Long preco, String fotoUrl, EstadoMentor estado, boolean verificado,
        Double avaliacaoMedia, Integer totalAvaliacoes, String provaBolsa) {

    public static MentorResponse from(Mentor m) {
        Utilizador u = m.getUtilizador();
        Bolsa b = m.getBolsaGanha();
        return new MentorResponse(m.getId(), u.getId(), u.getNome(), u.getEmail(), u.getTelefone(),
                b != null ? b.getId() : null, b != null ? b.getNome() : null, b != null ? b.getPais() : null,
                m.getAnoBolsa(), m.getDescricao(), m.getPreco(), m.getFotoUrl(), m.getEstado(),
                m.getEstado() == EstadoMentor.APROVADO, m.getAvaliacaoMedia(), m.getTotalAvaliacoes(),
                m.getProvaBolsa());
    }
}
