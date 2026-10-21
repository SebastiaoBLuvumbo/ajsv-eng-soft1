package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Um documento que as bolsas podem exigir, com o tempo médio que demora a tratar em Angola. */
@Entity
@Getter @Setter @NoArgsConstructor
public class TipoDocumento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    /** Tempo médio, em dias, que este documento demora a ficar pronto. Definido pelo SuperAdmin. */
    @Column(nullable = false)
    private Integer tempoMedioDias;

    private String descricao;
}
