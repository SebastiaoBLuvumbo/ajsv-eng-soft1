-- =====================================================================
-- AJSV - Bolsas & Mentorias
-- Dados de DEMONSTRAÇÃO (fictícios). Os prazos são relativos à data de hoje,
-- para que o calendário de documentos mostre sempre alertas na apresentação.
-- Todas as contas usam a senha: 123456
-- =====================================================================

-- ---------------------------------------------------------------- Utilizadores
INSERT INTO utilizador (id, nome, email, senha, telefone, perfil, ativo, data_registo) VALUES
(1,  'Administração AJSV',   'admin@ajsv.ao',   '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '923000000', 'SUPERADMIN', true, CURRENT_DATE - 120),
(2,  'Ana Paula Domingos',   'ana@ajsv.ao',     '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '923111222', 'ESTUDANTE',  true, CURRENT_DATE - 40),
(3,  'Mateus Kiala',         'mateus@ajsv.ao',  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '924222333', 'ESTUDANTE',  true, CURRENT_DATE - 35),
(4,  'Edvânia Sebastião',    'edvania@ajsv.ao', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '925333444', 'ESTUDANTE',  true, CURRENT_DATE - 30),
(5,  'Josué Manuel',         'josue@ajsv.ao',   '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '926444555', 'ESTUDANTE',  true, CURRENT_DATE - 200),
(6,  'Helena Cardoso',       'helena@ajsv.ao',  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '927555666', 'MENTOR',     true, CURRENT_DATE - 100),
(7,  'Nelson Tchipa',        'nelson@ajsv.ao',  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '928666777', 'MENTOR',     true, CURRENT_DATE - 95),
(8,  'Yolanda Mbala',        'yolanda@ajsv.ao', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '929777888', 'MENTOR',     true, CURRENT_DATE - 90),
(9,  'Carlos Ngola',         'carlos@ajsv.ao',  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '931888999', 'MENTOR',     true, CURRENT_DATE - 80),
(10, 'Teresa Afonso',        'teresa@ajsv.ao',  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '932999000', 'MENTOR',     true, CURRENT_DATE - 70),
(11, 'Paulo Lufuankenda',    'paulo@ajsv.ao',   '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '933123456', 'MENTOR',     true, CURRENT_DATE - 3);

-- ---------------------------------------------------------------- Bolsas
INSERT INTO bolsa (id, nome, entidade, pais, tipo, area_estudo, nivel, descricao, requisitos, prazo, link_oficial, destaque) VALUES
(1, 'Bolsa Chevening', 'Governo do Reino Unido', 'Reino Unido', 'EXTERNA', 'Várias áreas', 'MESTRADO',
 'Mestrado de um ano numa universidade do Reino Unido, com propinas, viagem e subsídio mensal pagos.',
 E'Licenciatura concluída\nPelo menos 2 anos de experiência profissional\nInglês com IELTS 6.5 ou equivalente\nRegressar a Angola durante pelo menos 2 anos após o curso',
 CURRENT_DATE + 40, 'https://www.chevening.org', true),
(2, 'Bolsa DAAD de Mestrado', 'DAAD', 'Alemanha', 'EXTERNA', 'Engenharia', 'MESTRADO',
 'Mestrado em engenharia numa universidade alemã, com subsídio mensal, seguro de saúde e viagem.',
 E'Licenciatura em engenharia com média igual ou superior a 14 valores\nCertificado de inglês ou alemão\nCarta de motivação e duas cartas de recomendação',
 CURRENT_DATE + 120, 'https://www.daad.de', true),
(3, 'Erasmus Mundus em Ciência de Dados', 'União Europeia', 'Portugal', 'EXTERNA', 'Informática', 'MESTRADO',
 'Mestrado conjunto em várias universidades europeias, começando em Portugal. Bolsa completa.',
 E'Licenciatura em Informática, Matemática ou área afim\nInglês com nível B2 ou superior\nDocumentos traduzidos e legalizados',
 CURRENT_DATE + 75, 'https://erasmus-plus.ec.europa.eu', true),
(4, 'Bolsa do Governo Chinês (CSC)', 'China Scholarship Council', 'China', 'EXTERNA', 'Engenharia', 'LICENCIATURA',
 'Licenciatura completa na China, incluindo um ano de língua chinesa, alojamento e subsídio mensal.',
 E'Ensino médio concluído com média igual ou superior a 14 valores\nIdade máxima de 25 anos\nAtestado médico e registo criminal',
 CURRENT_DATE + 95, 'https://www.campuschina.org', false),
(5, 'Bolsa Interna de Mérito', 'INAGBE', 'Angola', 'INTERNA', 'Várias áreas', 'LICENCIATURA',
 'Apoio às propinas e subsídio para estudantes com bom aproveitamento em instituições de ensino superior angolanas.',
 E'Estar matriculado numa instituição de ensino superior em Angola\nMédia igual ou superior a 14 valores\nRegisto criminal e atestado médico',
 CURRENT_DATE + 30, NULL, true),
(6, 'Türkiye Bursları', 'Governo da Turquia', 'Turquia', 'EXTERNA', 'Várias áreas', 'LICENCIATURA',
 'Bolsa completa com curso de língua turca, propinas, alojamento, seguro e subsídio mensal.',
 E'Ensino médio concluído\nIdade máxima de 21 anos para licenciatura\nCarta de motivação e carta de recomendação',
 CURRENT_DATE + 150, 'https://www.turkiyeburslari.gov.tr', false),
(7, 'Bolsa Fulbright', 'Governo dos Estados Unidos', 'Estados Unidos', 'EXTERNA', 'Ciências Sociais', 'MESTRADO',
 'Mestrado nos Estados Unidos com propinas, viagem, seguro e subsídio mensal.',
 E'Licenciatura concluída com bom aproveitamento\nInglês com TOEFL ou IELTS\nExperiência de liderança ou serviço comunitário',
 CURRENT_DATE + 200, 'https://foreign.fulbrightonline.org', false),
(8, 'Programa PEC-PG de Doutoramento', 'Governo do Brasil', 'Brasil', 'EXTERNA', 'Saúde', 'DOUTORAMENTO',
 'Doutoramento numa universidade pública brasileira, com bolsa mensal durante o curso.',
 E'Mestrado concluído\nCarta de aceitação de um orientador\nProjeto de investigação',
 CURRENT_DATE + 180, 'https://www.gov.br/capes', false),
(9, 'Bolsa Interna de Mérito (edição anterior)', 'INAGBE', 'Angola', 'INTERNA', 'Várias áreas', 'LICENCIATURA',
 'Edição anterior da bolsa interna de mérito, já encerrada.',
 E'Estar matriculado numa instituição de ensino superior em Angola\nMédia igual ou superior a 14 valores',
 CURRENT_DATE - 60, NULL, false);

-- ---------------------------------------------------------------- Tipos de documento (tempo médio em Angola)
INSERT INTO tipo_documento (id, nome, tempo_medio_dias, descricao) VALUES
(1,  'Passaporte',                          90, 'Inclui marcação, recolha de dados e emissão.'),
(2,  'Certificado de habilitações',         30, 'Pedido na secretaria da universidade ou escola.'),
(3,  'Declaração de notas',                 15, 'Pedido na secretaria da universidade ou escola.'),
(4,  'Tradução certificada',                20, 'Tradução dos certificados por tradutor certificado.'),
(5,  'Legalização de documentos',           21, 'Reconhecimento dos documentos para uso no estrangeiro.'),
(6,  'Carta de recomendação',               14, 'Pedida a um professor ou chefe. Dá tempo à pessoa para escrever.'),
(7,  'Carta de motivação',                  10, 'Escrita pelo estudante, com revisão.'),
(8,  'Certificado de inglês (IELTS/TOEFL)', 45, 'Inclui inscrição, preparação, exame e resultado.'),
(9,  'Atestado médico',                      7, 'Emitido por um centro de saúde ou clínica.'),
(10, 'Registo criminal',                    10, 'Pedido nos serviços de identificação.');

-- ---------------------------------------------------------------- Documentos exigidos por cada bolsa
INSERT INTO bolsa_documento (bolsa_id, tipo_documento_id) VALUES
(1,1),(1,2),(1,3),(1,6),(1,7),(1,8),
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),
(3,1),(3,2),(3,3),(3,4),(3,5),(3,7),(3,8),
(4,1),(4,2),(4,3),(4,4),(4,5),(4,7),(4,9),(4,10),
(5,2),(5,3),(5,9),(5,10),
(6,1),(6,2),(6,3),(6,4),(6,6),(6,7),
(7,1),(7,2),(7,3),(7,4),(7,6),(7,7),(7,8),
(8,1),(8,2),(8,3),(8,4),(8,5),(8,6),(8,7),
(9,2),(9,3);

-- ---------------------------------------------------------------- Mentores
INSERT INTO mentor (id, utilizador_id, bolsa_ganha_id, ano_bolsa, descricao, preco, foto_url, prova_bolsa, estado, avaliacao_media, total_avaliacoes) VALUES
(1, 6,  1, 2023, 'Fiz o mestrado em Políticas Públicas em Londres com a Chevening. Ajudo-te com os ensaios, a escolha das universidades e a entrevista.', 25000, NULL, 'Carta de atribuição Chevening 2023/2024', 'APROVADO', 5.0, 1),
(2, 7,  2, 2022, 'Engenheiro mecânico, mestrado em Aachen com bolsa DAAD. Explico como escolher o curso certo e preparar a candidatura em alemão ou inglês.', 30000, NULL, 'Carta de atribuição DAAD 2022', 'APROVADO', 5.0, 1),
(3, 8,  3, 2024, 'Estudei Ciência de Dados em Lisboa e Barcelona pelo Erasmus Mundus. Reviso a tua carta de motivação e o CV europeu.', 20000, NULL, 'Contrato de bolsa Erasmus Mundus 2024', 'APROVADO', 4.0, 1),
(4, 9,  4, 2021, 'Licenciado em Engenharia Civil em Xangai. Ajudo com a candidatura CSC, a escolha da universidade e a adaptação à China.', 18000, NULL, 'Carta de admissão CSC 2021', 'APROVADO', 4.0, 1),
(5, 10, 5, 2023, 'Bolseira interna durante toda a licenciatura. Conheço bem o processo e os documentos pedidos em Angola.', 15000, NULL, 'Declaração de bolseira interna 2023', 'APROVADO', 4.5, 2),
(6, 11, 6, 2024, 'Estudo Relações Internacionais em Ancara com a Türkiye Bursları. Ajudo na carta de motivação e na entrevista.', 17000, NULL, 'Carta de aceitação Türkiye Bursları 2024 (por verificar)', 'PENDENTE', 0.0, 0);

-- ---------------------------------------------------------------- Bolsas seguidas
INSERT INTO bolsa_seguida (estudante_id, bolsa_id, data_inicio, ganha) VALUES
(2, 1, CURRENT_DATE - 10, false),
(2, 3, CURRENT_DATE - 5,  false),
(3, 2, CURRENT_DATE - 8,  false),
(4, 5, CURRENT_DATE - 2,  false),
(5, 9, CURRENT_DATE - 150, true);

-- ---------------------------------------------------------------- Calendário de documentos (mesmo cálculo do backend)
-- data limite = prazo da bolsa - tempo médio do documento
INSERT INTO documento_estudante (estudante_id, bolsa_id, tipo_documento_id, estado, data_limite)
SELECT s.estudante_id, s.bolsa_id, bd.tipo_documento_id, 'POR_INICIAR', b.prazo - t.tempo_medio_dias
FROM bolsa_seguida s
JOIN bolsa b ON b.id = s.bolsa_id
JOIN bolsa_documento bd ON bd.bolsa_id = s.bolsa_id
JOIN tipo_documento t ON t.id = bd.tipo_documento_id
WHERE s.ganha = false;

-- Alguns documentos já em andamento para a demonstração
UPDATE documento_estudante SET estado = 'EM_CURSO'  WHERE estudante_id = 2 AND bolsa_id = 1 AND tipo_documento_id IN (1, 8);
UPDATE documento_estudante SET estado = 'CONCLUIDO' WHERE estudante_id = 2 AND bolsa_id = 1 AND tipo_documento_id IN (3);
UPDATE documento_estudante SET estado = 'CONCLUIDO' WHERE estudante_id = 3 AND bolsa_id = 2 AND tipo_documento_id IN (2, 3);

-- ---------------------------------------------------------------- Mentorias
INSERT INTO mentoria (id, estudante_id, mentor_id, bolsa_id, valor, estado, data_pedido, mensagem) VALUES
(1, 2, 1, 1, 25000, 'CONCLUIDA', CURRENT_DATE - 9, 'Preciso de ajuda com os ensaios da Chevening.'),
(2, 3, 1, 1, 25000, 'ACEITE',    CURRENT_DATE - 4, 'Quero preparar a entrevista.'),
(3, 4, 2, 2, 30000, 'PENDENTE',  CURRENT_DATE - 1, 'Ainda estou a escolher o curso na Alemanha. Pode ajudar?'),
(4, 3, 3, 3, 20000, 'CONCLUIDA', CURRENT_DATE - 20, 'Revisão da carta de motivação.'),
(5, 2, 3, 3, 20000, 'PENDENTE',  CURRENT_DATE,      'Gostava de rever o meu CV europeu.'),
(6, 4, 2, 2, 30000, 'CONCLUIDA', CURRENT_DATE - 25, 'Dúvidas sobre a legalização dos documentos.'),
(7, 5, 5, 9, 15000, 'CONCLUIDA', CURRENT_DATE - 160, 'Ajuda com os documentos da bolsa interna.'),
(8, 3, 4, 4, 18000, 'CONCLUIDA', CURRENT_DATE - 30, 'Quero perceber como funciona a CSC.'),
(9, 4, 5, 5, 15000, 'CONCLUIDA', CURRENT_DATE - 12, 'Que documentos preciso para a bolsa interna?');

-- ---------------------------------------------------------------- Avaliações
INSERT INTO avaliacao (mentoria_id, nota, comentario, data) VALUES
(1, 5, 'Muito clara e paciente. Os meus ensaios melhoraram bastante.', CURRENT_DATE - 5),
(4, 4, 'Boa revisão, deu sugestões práticas.', CURRENT_DATE - 15),
(6, 5, 'Explicou tudo sobre a legalização. Poupou-me semanas.', CURRENT_DATE - 20),
(7, 5, 'Graças à Teresa entreguei tudo a tempo.', CURRENT_DATE - 150),
(8, 4, 'Ajudou a escolher a universidade.', CURRENT_DATE - 25),
(9, 4, 'Respostas rápidas e úteis.', CURRENT_DATE - 8);

-- ---------------------------------------------------------------- Convite automático (o Josué ganhou a bolsa 9)
INSERT INTO convite_mentor (estudante_id, bolsa_id, data_envio, estado) VALUES
(5, 9, CURRENT_DATE - 2, 'PENDENTE');

-- ---------------------------------------------------------------- Acertar as sequências dos ids
SELECT setval(pg_get_serial_sequence('utilizador', 'id'),     (SELECT MAX(id) FROM utilizador));
SELECT setval(pg_get_serial_sequence('bolsa', 'id'),          (SELECT MAX(id) FROM bolsa));
SELECT setval(pg_get_serial_sequence('tipo_documento', 'id'), (SELECT MAX(id) FROM tipo_documento));
SELECT setval(pg_get_serial_sequence('mentor', 'id'),         (SELECT MAX(id) FROM mentor));
SELECT setval(pg_get_serial_sequence('mentoria', 'id'),       (SELECT MAX(id) FROM mentoria));
