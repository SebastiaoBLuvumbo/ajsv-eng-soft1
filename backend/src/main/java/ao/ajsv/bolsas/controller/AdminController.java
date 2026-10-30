package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.*;
import ao.ajsv.bolsas.model.EstadoMentor;
import ao.ajsv.bolsas.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Rotas do painel do SuperAdmin. As regras estão no {@link AdminService}.
 * Nota: para manter o projeto simples não há JWT. Numa versão real estas rotas seriam protegidas com Spring Security.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    // ---------------------------------------------------------------- Estatísticas

    @GetMapping("/estatisticas")
    public EstatisticasResponse estatisticas() {
        return service.estatisticas();
    }

    // ---------------------------------------------------------------- Bolsas (CRUD)

    @GetMapping("/bolsas")
    public List<BolsaResponse> listarBolsas() {
        return service.listarBolsas();
    }

    @PostMapping("/bolsas")
    @ResponseStatus(HttpStatus.CREATED)
    public BolsaResponse criarBolsa(@RequestBody BolsaRequest req) {
        return service.criarBolsa(req);
    }

    @PutMapping("/bolsas/{id}")
    public BolsaResponse editarBolsa(@PathVariable Long id, @RequestBody BolsaRequest req) {
        return service.editarBolsa(id, req);
    }

    @DeleteMapping("/bolsas/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagarBolsa(@PathVariable Long id) {
        service.apagarBolsa(id);
    }

    // ---------------------------------------------------------------- Tipos de documento (CRUD)

    @GetMapping("/tipos-documento")
    public List<TipoDocumentoDTO> listarTipos() {
        return service.listarTipos();
    }

    @PostMapping("/tipos-documento")
    @ResponseStatus(HttpStatus.CREATED)
    public TipoDocumentoDTO criarTipo(@RequestBody TipoDocumentoDTO req) {
        return service.criarTipo(req);
    }

    @PutMapping("/tipos-documento/{id}")
    public TipoDocumentoDTO editarTipo(@PathVariable Long id, @RequestBody TipoDocumentoDTO req) {
        return service.editarTipo(id, req);
    }

    @DeleteMapping("/tipos-documento/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagarTipo(@PathVariable Long id) {
        service.apagarTipo(id);
    }

    // ---------------------------------------------------------------- Mentores

    /** estado (opcional): PENDENTE, APROVADO ou REJEITADO */
    @GetMapping("/mentores")
    public List<MentorResponse> listarMentores(@RequestParam(required = false) EstadoMentor estado) {
        return service.listarMentores(estado);
    }

    @PutMapping("/mentores/{id}/aprovar")
    public MentorResponse aprovarMentor(@PathVariable Long id) {
        return service.mudarEstadoMentor(id, EstadoMentor.APROVADO);
    }

    @PutMapping("/mentores/{id}/rejeitar")
    public MentorResponse rejeitarMentor(@PathVariable Long id) {
        return service.mudarEstadoMentor(id, EstadoMentor.REJEITADO);
    }

    // ---------------------------------------------------------------- Utilizadores

    @GetMapping("/utilizadores")
    public List<UtilizadorResponse> listarUtilizadores() {
        return service.listarUtilizadores();
    }

    @PutMapping("/utilizadores/{id}/ativo")
    public UtilizadorResponse ativarDesativar(@PathVariable Long id, @RequestBody AtivoRequest req) {
        return service.ativarDesativar(id, req);
    }

    // ---------------------------------------------------------------- Convites

    @GetMapping("/convites")
    public List<ConviteResponse> listarConvites() {
        return service.listarConvites();
    }
}
