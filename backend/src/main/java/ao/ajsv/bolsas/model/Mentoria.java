package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor
public class Mentoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Utilizador estudante;

    @ManyToOne(optional = false)
    private Mentor mentor;

    @ManyToOne
    private Bolsa bolsa;

    /** Valor pago, em Kwanzas (preço do mentor no momento da contratação). */
    @Column(nullable = false)
    private Long valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMentoria estado = EstadoMentoria.PENDENTE;

    private LocalDate dataPedido = LocalDate.now();

    @Column(columnDefinition = "TEXT")
    private String mensagem;
}
