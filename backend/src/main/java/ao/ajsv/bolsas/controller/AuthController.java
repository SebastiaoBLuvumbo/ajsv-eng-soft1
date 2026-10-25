package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.LoginRequest;
import ao.ajsv.bolsas.dto.RegistoRequest;
import ao.ajsv.bolsas.dto.UtilizadorResponse;
import ao.ajsv.bolsas.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Rotas de registo e login. As regras estão no {@link AuthService}. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/registo")
    @ResponseStatus(HttpStatus.CREATED)
    public UtilizadorResponse registar(@RequestBody RegistoRequest req) {
        return service.registar(req);
    }

    @PostMapping("/login")
    public UtilizadorResponse login(@RequestBody LoginRequest req) {
        return service.login(req);
    }
}
