package ao.ajsv.bolsas.repository;

import ao.ajsv.bolsas.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface DocumentoEstudanteRepository extends JpaRepository<DocumentoEstudante, Long> {
    List<DocumentoEstudante> findByEstudanteIdAndBolsaId(Long estudanteId, Long bolsaId);
    List<DocumentoEstudante> findByBolsaId(Long bolsaId);
    List<DocumentoEstudante> findByTipoDocumentoId(Long tipoDocumentoId);
    boolean existsByTipoDocumentoId(Long tipoDocumentoId);

    @Transactional
    void deleteByEstudanteIdAndBolsaId(Long estudanteId, Long bolsaId);
}
