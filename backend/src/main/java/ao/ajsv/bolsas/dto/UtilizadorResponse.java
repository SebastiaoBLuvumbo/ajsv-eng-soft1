package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.EstadoMentor;
import ao.ajsv.bolsas.model.Mentor;
import ao.ajsv.bolsas.model.Perfil;
import ao.ajsv.bolsas.model.Utilizador;

import java.time.LocalDate;

/** mentorId vem preenchido quando o utilizador tem perfil de mentor (incluindo estudantes que aceitaram o convite). */
public record UtilizadorResponse(
        Long id, String nome, String email, String telefone, Perfil perfil, boolean ativo,
        LocalDate dataRegisto, Long mentorId, EstadoMentor estadoMentor) {

    public static UtilizadorResponse from(Utilizador u, Mentor m) {
        return new UtilizadorResponse(u.getId(), u.getNome(), u.getEmail(), u.getTelefone(), u.getPerfil(),
                u.isAtivo(), u.getDataRegisto(), m != null ? m.getId() : null, m != null ? m.getEstado() : null);
    }
}
