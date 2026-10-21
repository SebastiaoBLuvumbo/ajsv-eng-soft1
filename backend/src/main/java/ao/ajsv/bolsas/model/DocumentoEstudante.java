package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Um documento que o estudante precisa de tratar para uma bolsa, com a data limite calculada. */
@Entity
@Getter @Setter @NoArgsConstructor
public class DocumentoEstudante {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Utilizador estudante;

    @ManyToOne(optional = false)
    private Bolsa bolsa;

    @ManyToOne(optional = false)
    private TipoDocumento tipoDocumento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDocumento estado = EstadoDocumento.POR_INICIAR;

    /** Data até à qual o estudante deve COMEÇAR a tratar o documento = prazo da bolsa - tempo médio. */
    @Column(nullable = false)
    private LocalDate dataLimite;
}
