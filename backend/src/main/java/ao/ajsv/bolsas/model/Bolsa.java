package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor
public class Bolsa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    /** Quem oferece a bolsa (governo, fundação, empresa). */
    private String entidade;

    @Column(nullable = false)
    private String pais;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoBolsa tipo;

    private String areaEstudo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nivel nivel;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    /** Um requisito por linha. */
    @Column(columnDefinition = "TEXT")
    private String requisitos;

    /** Prazo final de candidatura. É a partir daqui que o calendário de documentos é calculado. */
    @Column(nullable = false)
    private LocalDate prazo;

    private String linkOficial;

    private boolean destaque;
}
