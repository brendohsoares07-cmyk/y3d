# Agentes de IA (IA Generativa)

| Item da rubrica | Onde está |
|---|---|
| AGENTS.md + 3 skills + guardrails + proteção do `.env` | `AGENTS.md` · `.claude/skills/*` · `.claude/settings.json` · `.gitignore` · `.cursorignore` |
| 3 skills específicas | `.claude/skills/novo-crud` · `.claude/skills/revisao-poo-solid` · `.claude/skills/docker-compose-seguro` |
| Guardrails | seção "Guardrails" do `AGENTS.md` + `permissions` em `.claude/settings.json` |
| Proteção do `.env` | `.claude/settings.json` (`deny` de leitura), `.cursorignore`, `.gitignore` e a regra no `AGENTS.md` |

A configuração fica em `.claude/` porque é onde Claude Code procura skills e permissões.
