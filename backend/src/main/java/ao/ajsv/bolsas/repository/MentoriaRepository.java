package ao.ajsv.bolsas.repository;

import ao.ajsv.bolsas.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MentoriaRepository extends JpaRepository<Mentoria, Long> {
    List<Mentoria> findByEstudanteIdOrderByIdDesc(Long estudanteId);
    List<Mentoria> findByMentorIdOrderByIdDesc(Long mentorId);
    List<Mentoria> findByEstado(EstadoMentoria estado);
    boolean existsByBolsaId(Long bolsaId);
}
