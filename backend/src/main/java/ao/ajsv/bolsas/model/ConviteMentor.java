package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Convite enviado automaticamente a um estudante que ganhou uma bolsa, para se tornar mentor. */
@Entity
@Getter @Setter @NoArgsConstructor
public class ConviteMentor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Utilizador estudante;

    @ManyToOne(optional = false)
    private Bolsa bolsa;

    private LocalDate dataEnvio = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoConvite estado = EstadoConvite.PENDENTE;
}
