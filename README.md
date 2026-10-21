# AJSV – Bolsas & Mentorias

*Mais oportunidades. Um futuro melhor.*

Plataforma web para estudantes angolanos que publica bolsas de estudo e permite contratar mentorias pagas com mentores que já ganharam essas bolsas.

**Funcionalidade principal: o calendário de documentos.** Quando o estudante clica em «Quero candidatar-me», o sistema pega no prazo final da bolsa e calcula, para cada documento, até quando ele deve começar a tratá-lo:

```
data limite para começar = prazo da bolsa − tempo médio do documento em Angola
```

Se um documento está atrasado ou perto da data limite, o sistema mostra um alerta e sugere mentores que ganharam essa mesma bolsa.

---

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, React Router, Axios |
| Backend | Spring Boot 3 (Java 17), Spring Web, Spring Data JPA, Lombok |
| Base de dados | PostgreSQL |

## Como correr o projeto

### 1. Pré-requisitos

Java 17 ou superior, Maven (ou o IntelliJ, que já traz o Maven), Node.js 18 ou superior e PostgreSQL.

### 2. Criar a base de dados

No pgAdmin ou no `psql`:

```sql
CREATE DATABASE ajsv_bolsas;
```

Se o teu utilizador ou senha do PostgreSQL não forem `postgres` / `postgres`, altera-os em
`backend/src/main/resources/application.properties`.

### 3. Iniciar o backend

```bash
cd backend
mvn spring-boot:run
```

No IntelliJ: abre a pasta `backend` e corre a classe `AjsvApplication`.

O backend fica em `http://localhost:8080`. Ao arrancar, cria as tabelas e carrega os dados de demonstração do ficheiro `data.sql`.

> Com `spring.jpa.hibernate.ddl-auto=create`, os dados voltam ao estado inicial sempre que o backend reinicia. É útil para a apresentação. Para guardar os dados, muda para `update` e põe `spring.sql.init.mode=never`.

### 4. Iniciar o frontend

Noutro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Contas de demonstração

Todas usam a senha **123456**. Na página de login há botões para preencher estas contas.

| Perfil | Email | O que mostrar |
|---|---|---|
| Estudante | ana@ajsv.ao | Calendário com documentos atrasados e mentores sugeridos |
| Estudante | josue@ajsv.ao | Ganhou uma bolsa e tem um convite para ser mentor |
| Mentor | helena@ajsv.ao | Pedidos de mentoria, ganhos e avaliações |
| Mentor (por aprovar) | paulo@ajsv.ao | Perfil a aguardar aprovação |
| SuperAdmin | admin@ajsv.ao | Estatísticas, bolsas, documentos, aprovação de mentores |

Os dados são fictícios. Os prazos das bolsas são calculados a partir da data de hoje, por isso a demonstração mostra sempre alertas.

## Guião sugerido para a apresentação

1. **Página inicial**: mostra o exemplo do calendário logo no topo. É o diferencial.
2. **Bolsas**: usa os filtros (país, área, nível) e abre a Bolsa Interna de Mérito.
3. Entra como **Edvânia** (edvania@ajsv.ao) ou cria uma conta de estudante nova e clica em **Quero candidatar-me**: o calendário aparece calculado na hora.
4. Entra como **Ana**: mostra o painel com o passaporte atrasado, o alerta e o mentor sugerido. Contrata uma mentoria.
5. Entra como **Helena**: aceita o pedido, marca como concluído e mostra o total ganho.
6. Volta à **Ana** e avalia a mentoria.
7. Entra como **SuperAdmin**: aprova o Paulo, altera o tempo médio do passaporte e mostra que as datas dos estudantes são recalculadas.

## Estrutura do backend (MVC simples)

```
backend/src/main/java/ao/ajsv/bolsas/
├── model/        Entidades JPA e enums
├── dto/          Objetos de pedido e resposta (records)
├── repository/   Interfaces JpaRepository
├── controller/   Controllers REST com as rotas
└── config/       CORS para o React
```

Não há camada de serviço: os controllers usam os repositories diretamente.

### Entidades

`Utilizador`, `Bolsa`, `TipoDocumento`, `BolsaDocumento`, `Mentor`, `BolsaSeguida`, `DocumentoEstudante`, `Mentoria`, `Avaliacao` e `ConviteMentor`.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/registo` | Criar conta (estudante ou mentor) |
| POST | `/api/auth/login` | Entrar |
| GET | `/api/bolsas` | Listar bolsas abertas (`q`, `pais`, `area`, `nivel`, `tipo`, `todas`) |
| GET | `/api/bolsas/destaque` | Bolsas em destaque |
| GET | `/api/bolsas/filtros` | Países e áreas para os filtros |
| GET | `/api/bolsas/{id}` | Detalhe da bolsa |
| GET | `/api/mentores` | Mentores aprovados (`bolsaId` opcional) |
| GET | `/api/mentores/{id}` | Perfil do mentor |
| GET | `/api/estudante/{id}/bolsas` | Bolsas seguidas com o calendário |
| POST | `/api/estudante/{id}/bolsas/{bolsaId}/seguir` | Quero candidatar-me (calcula o calendário) |
| DELETE | `/api/estudante/{id}/bolsas/{bolsaId}/seguir` | Deixar de seguir |
| PUT | `/api/estudante/{id}/documentos/{docId}/estado` | Mudar estado de um documento |
| POST | `/api/estudante/{id}/bolsas/{bolsaId}/ganha` | Marcar bolsa como ganha (envia convite) |
| GET | `/api/estudante/{id}/convites` | Convites para mentor |
| POST | `/api/estudante/{id}/convites/{cid}/aceitar` | Aceitar convite |
| POST | `/api/estudante/{id}/convites/{cid}/recusar` | Recusar convite |
| GET | `/api/estudante/{id}/mentorias` | Mentorias contratadas |
| POST | `/api/estudante/{id}/mentorias` | Contratar mentoria |
| POST | `/api/estudante/{id}/mentorias/{mid}/avaliar` | Avaliar mentoria |
| GET / PUT | `/api/mentor/{id}/perfil` | Ver e editar perfil do mentor |
| GET | `/api/mentor/{id}/mentorias` | Pedidos recebidos |
| PUT | `/api/mentor/{id}/mentorias/{mid}/{acao}` | `aceitar`, `recusar` ou `concluir` |
| GET | `/api/mentor/{id}/ganhos` | Resumo dos ganhos |
| GET | `/api/admin/estatisticas` | Estatísticas gerais |
| GET / POST / PUT / DELETE | `/api/admin/bolsas` | Gerir bolsas |
| GET / POST / PUT / DELETE | `/api/admin/tipos-documento` | Gerir documentos e tempos médios |
| GET | `/api/admin/mentores` | Listar mentores (`estado` opcional) |
| PUT | `/api/admin/mentores/{id}/aprovar` | Aprovar mentor |
| PUT | `/api/admin/mentores/{id}/rejeitar` | Rejeitar mentor |
| GET | `/api/admin/utilizadores` | Listar utilizadores |
| PUT | `/api/admin/utilizadores/{id}/ativo` | Ativar ou desativar conta |
| GET | `/api/admin/convites` | Convites enviados |

## Simplificações (para mencionar na apresentação)

Para manter o projeto simples, o login não usa JWT nem Spring Security: o frontend guarda o utilizador após o login. As senhas são guardadas com hash SHA-256. O pagamento das mentorias é simulado (o valor fica registado na mentoria). Numa versão real, estas partes seriam substituídas por Spring Security com JWT, BCrypt e integração com Multicaixa Express.
