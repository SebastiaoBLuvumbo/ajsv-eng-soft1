package ao.ajsv.bolsas.repository;

import ao.ajsv.bolsas.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UtilizadorRepository extends JpaRepository<Utilizador, Long> {
    Optional<Utilizador> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    long countByPerfil(Perfil perfil);
}
