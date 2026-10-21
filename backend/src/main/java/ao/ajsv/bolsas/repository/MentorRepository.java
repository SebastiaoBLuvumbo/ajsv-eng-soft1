package ao.ajsv.bolsas.repository;

import ao.ajsv.bolsas.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
    List<Mentor> findByEstado(EstadoMentor estado);
    List<Mentor> findByEstadoAndBolsaGanhaId(EstadoMentor estado, Long bolsaId);
    Optional<Mentor> findByUtilizadorId(Long utilizadorId);
    boolean existsByBolsaGanhaId(Long bolsaId);
    long countByEstado(EstadoMentor estado);
}
