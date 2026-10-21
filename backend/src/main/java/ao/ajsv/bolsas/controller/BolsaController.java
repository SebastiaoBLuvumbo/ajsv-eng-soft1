package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.BolsaResponse;
import ao.ajsv.bolsas.model.Bolsa;
import ao.ajsv.bolsas.model.Nivel;
import ao.ajsv.bolsas.model.TipoBolsa;
import ao.ajsv.bolsas.repository.BolsaDocumentoRepository;
import ao.ajsv.bolsas.repository.BolsaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static ao.ajsv.bolsas.controller.Erros.*;

/** Rotas públicas das bolsas. */
@RestController
@RequestMapping("/api/bolsas")
public class BolsaController {

    private final BolsaRepository bolsas;
    private final BolsaDocumentoRepository bolsaDocumentos;

    public BolsaController(BolsaRepository bolsas, BolsaDocumentoRepository bolsaDocumentos) {
        this.bolsas = bolsas;
        this.bolsaDocumentos = bolsaDocumentos;
    }

    /** Lista as bolsas abertas, com pesquisa (q) e filtros opcionais. Com todas=true inclui as já encerradas. */
    @GetMapping
    public List<BolsaResponse> listar(@RequestParam(required = false) String q,
                                      @RequestParam(required = false) String pais,
                                      @RequestParam(required = false) String area,
                                      @RequestParam(required = false) Nivel nivel,
                                      @RequestParam(required = false) TipoBolsa tipo,
                                      @RequestParam(defaultValue = "false") boolean todas) {
        LocalDate hoje = LocalDate.now();
        return bolsas.findAll(Sort.by("prazo")).stream()
                .filter(b -> todas || !b.getPrazo().isBefore(hoje))
                .filter(b -> vazio(q) || contem(b.getNome(), q) || contem(b.getEntidade(), q) || contem(b.getPais(), q))
                .filter(b -> vazio(pais) || b.getPais().equalsIgnoreCase(pais))
                .filter(b -> vazio(area) || area.equalsIgnoreCase(b.getAreaEstudo()))
                .filter(b -> nivel == null || b.getNivel() == nivel)
                .filter(b -> tipo == null || b.getTipo() == tipo)
                .map(this::paraResponse)
                .toList();
    }

    @GetMapping("/destaque")
    public List<BolsaResponse> destaque() {
        LocalDate hoje = LocalDate.now();
        return bolsas.findByDestaqueTrueOrderByPrazoAsc().stream()
                .filter(b -> !b.getPrazo().isBefore(hoje))
                .map(this::paraResponse)
                .toList();
    }

    /** Valores disponíveis para os filtros (países e áreas que existem na base de dados). */
    @GetMapping("/filtros")
    public Map<String, List<String>> filtros() {
        List<Bolsa> todas = bolsas.findAll();
        return Map.of(
                "paises", todas.stream().map(Bolsa::getPais).distinct().sorted().toList(),
                "areas", todas.stream().map(Bolsa::getAreaEstudo).filter(a -> a != null).distinct().sorted().toList());
    }

    @GetMapping("/{id}")
    public BolsaResponse detalhe(@PathVariable Long id) {
        return paraResponse(bolsas.findById(id).orElseThrow(() -> naoEncontrado("Bolsa não encontrada.")));
    }

    private BolsaResponse paraResponse(Bolsa b) {
        return BolsaResponse.from(b, bolsaDocumentos.findByBolsaId(b.getId()));
    }

    private static boolean contem(String texto, String procura) {
        return texto != null && texto.toLowerCase().contains(procura.trim().toLowerCase());
    }
}
