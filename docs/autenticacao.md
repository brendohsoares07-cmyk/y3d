# Autenticação, cadastro e edição de usuário

Backend: `backend/src/auth/` (login, JWT, bcrypt) e `backend/src/users/` (cadastro e edição do próprio usuário).
Frontend: `pages/Login`, `pages/Cadastro`, `pages/Perfil`, `contexts/AuthContext.tsx` e `validations/` (`email.ts`, `cpf.ts`, `password.ts`).

## Backend
| Item da rubrica | Onde está |
|---|---|
| Login com e-mail/senha, regex de e-mail, JWT, só usuário existente | `backend/src/auth/AuthService.ts` (`login`) · `shared/validators/validators.ts` (`isEmail`) |
| Senha criptografada | `auth/PasswordHasher.ts` (bcrypt) — o banco guarda só `senha_hash` |
| Cadastro (nome, e-mail, senha, CPF) + validações de CPF, senha e e-mail | `AuthService.register` · `users/Usuario.ts` (setters) · `shared/validators/validators.ts` |
| Edição: rota autenticada, só o próprio usuário | `routes/index.ts` (`authMiddleware`) · `UsuarioService.update` (403 se `id` ≠ token) |
| Edição: campos obrigatórios, CPF, senha, e-mail imutável | `UsuarioService.update` |

## Frontend
| Item da rubrica | Onde está |
|---|---|
| Login: campos, regex, token no localStorage, erros amigáveis, redirecionamento | `pages/Login/LoginPage.tsx` · `services/http.ts` (`tokenStorage`, `friendlyMessage`) |
| Cadastro: obrigatórios, senha dupla, CPF, e-mail, redireciona ao login, erros da API | `pages/Cadastro/RegisterPage.tsx` |
| Edição: Context global, CPF, nível de senha, confirmação, e-mail bloqueado | `contexts/AuthContext.tsx` · `pages/Perfil/ProfilePage.tsx` |

## Regras de validação
- **Senha**: mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial (backend e frontend usam as mesmas regras).
- **CPF**: dígitos verificadores; aceita com ou sem máscara e é salvo só com dígitos.
- **E-mail**: regex, guardado em minúsculas e único.
