package ao.ajsv.bolsas.repository;

import ao.ajsv.bolsas.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface BolsaDocumentoRepository extends JpaRepository<BolsaDocumento, Long> {
    List<BolsaDocumento> findByBolsaId(Long bolsaId);
    boolean existsByTipoDocumentoId(Long tipoDocumentoId);

    @Transactional
    void deleteByBolsaId(Long bolsaId);
}
