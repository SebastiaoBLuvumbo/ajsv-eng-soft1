package ao.ajsv.bolsas.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Atalhos para devolver erros HTTP com uma mensagem clara para o frontend. */
final class Erros {
    private Erros() {}

    static ResponseStatusException naoEncontrado(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }

    static ResponseStatusException pedidoInvalido(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }

    static ResponseStatusException conflito(String msg) {
        return new ResponseStatusException(HttpStatus.CONFLICT, msg);
    }

    static ResponseStatusException proibido(String msg) {
        return new ResponseStatusException(HttpStatus.FORBIDDEN, msg);
    }

    static boolean vazio(String s) {
        return s == null || s.isBlank();
    }
}
