package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.BolsaResponse;
import ao.ajsv.bolsas.model.Nivel;
import ao.ajsv.bolsas.model.TipoBolsa;
import ao.ajsv.bolsas.service.BolsaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Rotas públicas das bolsas. As regras estão no {@link BolsaService}. */
@RestController
@RequestMapping("/api/bolsas")
public class BolsaController {

    private final BolsaService service;

    public BolsaController(BolsaService service) {
        this.service = service;
    }

    /** Pesquisa (q) e filtros opcionais. Com todas=true inclui as já encerradas. */
    @GetMapping
    public List<BolsaResponse> listar(@RequestParam(required = false) String q,
                                      @RequestParam(required = false) String pais,
                                      @RequestParam(required = false) String area,
                                      @RequestParam(required = false) Nivel nivel,
                                      @RequestParam(required = false) TipoBolsa tipo,
                                      @RequestParam(defaultValue = "false") boolean todas) {
        return service.listar(q, pais, area, nivel, tipo, todas);
    }

    @GetMapping("/destaque")
    public List<BolsaResponse> destaque() {
        return service.destaque();
    }

    @GetMapping("/filtros")
    public Map<String, List<String>> filtros() {
        return service.filtros();
    }

    @GetMapping("/{id}")
    public BolsaResponse detalhe(@PathVariable Long id) {
        return service.detalhe(id);
    }
}
