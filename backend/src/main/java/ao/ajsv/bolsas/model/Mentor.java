package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Perfil de mentor. Está ligado a um utilizador (que pode ter perfil MENTOR, ou ser um estudante que aceitou o convite). */
@Entity
@Getter @Setter @NoArgsConstructor
public class Mentor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "utilizador_id", unique = true)
    private Utilizador utilizador;

    /** Bolsa que o mentor ganhou. */
    @ManyToOne
    private Bolsa bolsaGanha;

    private Integer anoBolsa;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    /** Preço de uma mentoria, em Kwanzas. */
    @Column(nullable = false)
    private Long preco;

    private String fotoUrl;

    /** Prova de que ganhou a bolsa (ex.: referência da carta de atribuição). O SuperAdmin verifica antes de aprovar. */
    @Column(columnDefinition = "TEXT")
    private String provaBolsa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMentor estado = EstadoMentor.PENDENTE;

    private Double avaliacaoMedia = 0.0;

    private Integer totalAvaliacoes = 0;
}
