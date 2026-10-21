package ao.ajsv.bolsas.controller;

import ao.ajsv.bolsas.dto.LoginRequest;
import ao.ajsv.bolsas.dto.RegistoRequest;
import ao.ajsv.bolsas.dto.UtilizadorResponse;
import ao.ajsv.bolsas.model.*;
import ao.ajsv.bolsas.repository.BolsaRepository;
import ao.ajsv.bolsas.repository.MentorRepository;
import ao.ajsv.bolsas.repository.UtilizadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

import static ao.ajsv.bolsas.controller.Erros.*;

/**
 * Registo e login simples (sem JWT, para manter o projeto simples).
 * O frontend guarda o utilizador devolvido e usa o id nas outras rotas.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilizadorRepository utilizadores;
    private final MentorRepository mentores;
    private final BolsaRepository bolsas;

    public AuthController(UtilizadorRepository utilizadores, MentorRepository mentores, BolsaRepository bolsas) {
        this.utilizadores = utilizadores;
        this.mentores = mentores;
        this.bolsas = bolsas;
    }

    @PostMapping("/registo")
    @ResponseStatus(HttpStatus.CREATED)
    public UtilizadorResponse registar(@RequestBody RegistoRequest req) {
        if (vazio(req.nome()) || vazio(req.email()) || vazio(req.senha()))
            throw pedidoInvalido("Preenche o nome, o email e a senha.");
        if (req.senha().length() < 6)
            throw pedidoInvalido("A senha deve ter pelo menos 6 caracteres.");
        if (utilizadores.existsByEmailIgnoreCase(req.email()))
            throw conflito("Já existe uma conta com este email.");

        Perfil perfil = req.perfil() == null ? Perfil.ESTUDANTE : req.perfil();
        if (perfil == Perfil.SUPERADMIN)
            throw pedidoInvalido("Não é possível criar contas de SuperAdmin pelo registo.");
        if (perfil == Perfil.MENTOR && (req.preco() == null || req.preco() <= 0))
            throw pedidoInvalido("Indica o preço da tua mentoria em Kz.");

        Utilizador u = new Utilizador();
        u.setNome(req.nome().trim());
        u.setEmail(req.email().trim().toLowerCase());
        u.setSenha(hash(req.senha()));
        u.setTelefone(req.telefone());
        u.setPerfil(perfil);
        utilizadores.save(u);

        Mentor mentor = null;
        if (perfil == Perfil.MENTOR) {
            // O mentor fica PENDENTE até o SuperAdmin verificar que ganhou mesmo a bolsa
            mentor = new Mentor();
            mentor.setUtilizador(u);
            if (req.bolsaGanhaId() != null) mentor.setBolsaGanha(bolsas.findById(req.bolsaGanhaId()).orElse(null));
            mentor.setAnoBolsa(req.anoBolsa());
            mentor.setDescricao(req.descricao());
            mentor.setPreco(req.preco());
            mentor.setProvaBolsa(req.provaBolsa());
            mentores.save(mentor);
        }
        return UtilizadorResponse.from(u, mentor);
    }

    @PostMapping("/login")
    public UtilizadorResponse login(@RequestBody LoginRequest req) {
        if (vazio(req.email()) || vazio(req.senha()))
            throw pedidoInvalido("Preenche o email e a senha.");
        Utilizador u = utilizadores.findByEmailIgnoreCase(req.email().trim())
                .filter(x -> x.getSenha().equals(hash(req.senha())))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha incorretos."));
        if (!u.isAtivo())
            throw proibido("Esta conta foi desativada. Contacta a administração.");
        return UtilizadorResponse.from(u, mentores.findByUtilizadorId(u.getId()).orElse(null));
    }

    /** Hash SHA-256 da senha. */
    static String hash(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(senha.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
