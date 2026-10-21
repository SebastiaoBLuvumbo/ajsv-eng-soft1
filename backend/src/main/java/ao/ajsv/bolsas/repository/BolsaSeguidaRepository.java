package ao.ajsv.bolsas.repository;

import ao.ajsv.bolsas.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface BolsaSeguidaRepository extends JpaRepository<BolsaSeguida, Long> {
    List<BolsaSeguida> findByEstudanteId(Long estudanteId);
    Optional<BolsaSeguida> findByEstudanteIdAndBolsaId(Long estudanteId, Long bolsaId);
    boolean existsByBolsaId(Long bolsaId);
}
