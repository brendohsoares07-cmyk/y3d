---
name: revisao-poo-solid
description: Revisa e refatora classes TypeScript do backend Y3D verificando encapsulamento, getters/setters, herança e polimorfismo, tipagem (interfaces, type aliases, generics, sem any), SOLID e exceções customizadas. Use ao pedir revisão de código, refatoração ou "está seguindo POO/SOLID?".
---

# Revisão de POO e SOLID (TypeScript)

Revise os arquivos indicados (ou `backend/src/`) e responda com uma lista curta: **OK**, **Problema** (arquivo:linha) e **Correção sugerida**. Só edite se a pessoa pedir.

## Checklist

**Encapsulamento e estado**
- Atributos com regra ficam `private` (`_campo`) e são inicializados no construtor.
- Nada de atributos públicos mutáveis; use `readonly` quando o valor não muda.

**Acesso controlado**
- `get`/`set` só quando existe validação, transformação ou regra de negócio (ex.: `Produto.preco` arredonda e exige > 0).
- Getter/setter "vazio" que só repassa o valor é problema.

**Domínio e pilares**
- Entidades herdam de `BaseEntity` (abstrata); `toRow()` e `toJSON()` são sobrescritos em cada uma (polimorfismo).
- Herança só quando há reuso real de código.

**Tipagem**
- `interface`/`type` para contratos (`IRepository`, `Row`, `Page<T>`); generics em `BaseRepository<T>`, `CrudService<T, TInput>`.
- Zero `any`. Use `unknown` e estreite o tipo. Rode: `grep -rnE "\bany\b" backend/src frontend/src`.

**SOLID**
- **S**: uma responsabilidade por classe (controller = HTTP, service = regra, repository = SQL, `PasswordHasher` = senha).
- **O**: novo recurso = novas subclasses, sem editar `CrudService`/`BaseRepository`.
- **L**: toda subclasse funciona no lugar da base sem quebrar (`PedidoService.update` continua respeitando o contrato).
- **D**: serviços dependem de `IRepository`, não do MySQL.

**Exceções e organização**
- Erros de negócio usam classes de `errors/AppError.ts`; o `errorHandler` converte em HTTP.
- Pastas: `entities/`, `services/`, `repositories/`, `controllers/`. Classes em PascalCase, arquivos com o nome da classe.
