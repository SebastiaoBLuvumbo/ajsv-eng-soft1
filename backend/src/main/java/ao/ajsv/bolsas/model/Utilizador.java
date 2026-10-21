package ao.ajsv.bolsas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Qualquer pessoa com conta: estudante, mentor ou superadmin. */
@Entity
@Getter @Setter @NoArgsConstructor
public class Utilizador {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    /** Guardada como hash SHA-256, nunca em texto simples. */
    @Column(nullable = false)
    private String senha;

    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;

    private boolean ativo = true;

    private LocalDate dataRegisto = LocalDate.now();
}
