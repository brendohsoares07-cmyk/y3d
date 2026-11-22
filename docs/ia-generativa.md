# Agentes de IA (IA Generativa)

| Item da rubrica | Onde está |
|---|---|
| AGENTS.md + 3 skills + guardrails + proteção do `.env` | `AGENTS.md` · `.claude/skills/*/SKILL.md` · `.gitignore` · `.cursorignore` |
| 3 skills específicas | `.claude/skills/novo-crud/SKILL.md` · `.claude/skills/revisao-poo-solid/SKILL.md` · `.claude/skills/docker-compose-seguro/SKILL.md` |
| Guardrails | seção "Guardrails" do `AGENTS.md` e instruções de cada skill |
| Proteção do `.env` | `.cursorignore`, `.gitignore` e a regra explícita no `AGENTS.md` |

A configuração fica em `.claude/` porque é onde Claude Code procura skills e permissões.
