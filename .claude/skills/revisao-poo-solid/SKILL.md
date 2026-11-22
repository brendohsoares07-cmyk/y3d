# Revisão POO e SOLID

Use esta skill para revisar ou refatorar classes TypeScript do projeto.

## Checklist

- Mantenha atributos privados; exponha getters/setters apenas com validação, transformação ou regra necessária.
- Inicialize invariantes no construtor e evite estados parcialmente válidos.
- Use `BaseEntity`, contratos e classes abstratas somente quando houver reuso/polimorfismo real.
- Confira responsabilidades únicas, pontos de extensão e substituibilidade das subclasses.
- Prefira contratos (`IRepository<T>`) às implementações concretas nos limites entre camadas.
- Use tipos explícitos, unions e generics; não introduza `any`.
- Converta falhas de negócio em subclasses de `AppError`; deixe erros de infraestrutura chegarem ao middleware.
- Preserve `routes → controllers → services → repositories → MySQL`; SQL pertence aos repositórios.

Faça alterações cirúrgicas, sem reformatação ou correções não relacionadas. Valide o build da parte modificada e acrescente testes focados para regras novas.
