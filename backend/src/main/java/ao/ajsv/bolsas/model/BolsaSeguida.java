package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Uma bolsa à qual o estudante decidiu candidatar-se. */
@Entity
@Getter @Setter @NoArgsConstructor
public class BolsaSeguida {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Utilizador estudante;

    @ManyToOne(optional = false)
    private Bolsa bolsa;

    private LocalDate dataInicio = LocalDate.now();

    /** O estudante indicou que ganhou esta bolsa. */
    private boolean ganha;
}
