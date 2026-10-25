package ao.ajsv.bolsas.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Atalhos para os services devolverem erros HTTP com uma mensagem clara para o frontend. */
public final class Erros {
    private Erros() {}

    public static ResponseStatusException naoEncontrado(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }

    public static ResponseStatusException pedidoInvalido(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }

    public static ResponseStatusException conflito(String msg) {
        return new ResponseStatusException(HttpStatus.CONFLICT, msg);
    }

    public static ResponseStatusException proibido(String msg) {
        return new ResponseStatusException(HttpStatus.FORBIDDEN, msg);
    }

    public static boolean vazio(String s) {
        return s == null || s.isBlank();
    }
}
