package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Liga uma bolsa a cada documento que ela exige. */
@Entity
@Getter @Setter @NoArgsConstructor
public class BolsaDocumento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Bolsa bolsa;

    @ManyToOne(optional = false)
    private TipoDocumento tipoDocumento;
}
