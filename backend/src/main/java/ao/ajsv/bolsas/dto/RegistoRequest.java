package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.Perfil;

/** Os campos de mentor (bolsaGanhaId, anoBolsa, descricao, preco, provaBolsa) só são usados quando perfil = MENTOR. */
public record RegistoRequest(
        String nome, String email, String senha, String telefone, Perfil perfil,
        Long bolsaGanhaId, Integer anoBolsa, String descricao, Long preco, String provaBolsa) {}
