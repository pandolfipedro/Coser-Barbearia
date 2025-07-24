# COSER2 - Sistema de Barbearia

## Endpoints principais

### Autenticação
- `POST /api/auth/register` — Cadastro de cliente (nome, cpf, nascimento, telefone)
- `POST /api/auth/login` — Login via CPF e data de nascimento (retorna JWT)

### Cliente
- `GET /api/cliente/agendamentos` — Listar agendamentos do cliente
- `POST /api/cliente/agendamentos` — Criar agendamento
- `PATCH /api/cliente/agendamentos/[id]` — Editar agendamento
- `DELETE /api/cliente/agendamentos/[id]` — Cancelar agendamento
- `GET /api/cliente/perfil` — Dados do perfil
- `PATCH /api/cliente/perfil` — Atualizar nome/telefone

### Admin
- `GET /api/admin/agendamentos` — Listar todos agendamentos
- `PATCH /api/admin/agendamentos/[id]` — Editar agendamento
- `DELETE /api/admin/agendamentos/[id]` — Cancelar agendamento
- `GET /api/admin/barbeiros` — Listar barbeiros
- `POST /api/admin/barbeiros` — Cadastrar barbeiro
- `DELETE /api/admin/barbeiros/[id]` — Remover barbeiro
- `GET /api/admin/servicos` — Listar serviços
- `POST /api/admin/servicos` — Cadastrar serviço
- `DELETE /api/admin/servicos/[id]` — Remover serviço

## Fluxo de autenticação
- Cadastro/login retorna JWT (role: admin/cliente)
- Envie o token no header `Authorization: Bearer <token>` para rotas protegidas
- Middleware protege rotas `/admin/*` (apenas admin) e `/cliente/*` (apenas cliente)

## Deploy
- Configure `.env` com `DATABASE_URL` e `JWT_SECRET`
- Rode `npx prisma migrate dev` e `npx prisma generate`
- Rode `npx tsx prisma/seed.ts` para criar admin padrão
- Deploy-ready para Vercel + banco Neon

## Extras
- Layout moderno, mobile-first, acessível
- Código limpo, comentado e pronto para replicação white-label
