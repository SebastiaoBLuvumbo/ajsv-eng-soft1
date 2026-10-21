package ao.ajsv.bolsas.repository;

import ao.ajsv.bolsas.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    Optional<Avaliacao> findByMentoriaId(Long mentoriaId);
    List<Avaliacao> findByMentoriaMentorId(Long mentorId);
}
