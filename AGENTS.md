<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
# AGENTS — Guia para agentes e automações do repositório

Checklist (what this file contains):
- Roles and responsibilities for automated agents
- Rules for editing code and running tasks
- Expected automation workflows (lint, test, build, generate docs)
- Safety rules and boundaries (do not modify existing files outside PRs)

Objetivo
--------
Este arquivo descreve como agentes automatizados (human-assisted bots, CI, ou agentes internos) devem operar neste repositório `pokemon-web`. Fornece regras claras para alterações, execução de tarefas, estilos e interações com desenvolvedores humanos.

Agentes disponíveis e responsabilidades
-------------------------------------
- Plan (specialized agent):
    - Responsabilidade: gerar planos multi-step para tarefas complexas (refactors, features cross-cutting).
    - Uso: sempre delegar para `Plan` quando a tarefa envolver múltiplos passos ou várias áreas do código.

- Editor (automation performing edits):
    - Responsabilidade: aplicar mudanças de código via patch ou criar novos artefatos em `IA/`.
    - Restrições: não modificar arquivos existentes sem criar um PR ou sem consentimento explícito do time. Quando necessário alterar arquivos existentes, prefira pequenas mudanças e adicione testes.

Regras gerais para agentes
-------------------------
1. Sempre ler o `README.md` e o `AGENTS.md` raiz antes de agir.
2. Não alterar arquivos fora de `IA/` sem um checklist e execução de testes locais. Para mudanças em arquivos existentes, criar um branch e abrir um PR com descrição detalhada.
3. Antes de aplicar patches, rodar mental (ou programaticamente) as verificações: `yarn run lint` e `yarn run test`.
4. Tipagem: qualquer código novo deve usar TypeScript estrito; evitar `any`.
5. Componentes React:
    - Preferir server components quando possível.
    - Use `"use client"` somente quando o componente precisa de estado ou efeitos.
    - Memoize com `useMemo`/`useCallback` quando necessário.
6. Styling:
    - Usar Tailwind para novas classes; manter SCSS onde já existe; migrar com cuidado.
7. Criação de arquivos:
    - Colocar documentação, auto-gerados ou de apoio, dentro de `IA/`.

Fluxos de trabalho automáticos (exemplos)
--------------------------------------
- Geração de documentação:
    1. Agente lê `package.json`, `tsconfig.json`, `next.config.ts`, `app/` e `app/ds/`.
    2. Gera `README.md` (resumo do projeto) e `AGENTS.md` (este arquivo) — não sobrescrever sem revisão humana.

- Refactor de componente (ex.: migrar Image SCSS→Tailwind):
    1. `Plan` cria plano com passos (analisar uso, tests, edge cases).
    2. Agente cria branch e aplica mudanças incrementais com `apply_patch`.
    3. Executa `yarn run lint` e `yarn run test` e corrige até passar.
    4. Abre PR e pede revisão humana.

Segurança e privacidade
----------------------
- Nunca gravar ou expor chaves privadas, tokens ou segredos no repositório — sempre usar variáveis de ambiente e vaults.
- Logs de execução automatizados podem conter caminhos de arquivos e erros; sanitize informações sensíveis antes de compartilhá-las.

Como pedir ao agente que faça alterações (boas práticas)
-----------------------------------------------------
Forneça sempre:
- Objetivo claro e esperado (ex.: "migrar `app/ds/image/Image.tsx` para Tailwind e consertar fallback"),
- Arquivos afetados (se souber),
- Critérios de aceitação (lint/test passando, comportamento X em caso de falha de imagem, etc.).

Checklist pré-merge automatizado (CI)
------------------------------------
1. `yarn ci` / `yarn install`
2. `yarn run lint` — falhar se houver erros de ESLint
3. `yarn run test` — falhar se houver testes com falha
4. Build de produção: `yarn run build` (Next build)

Observações finais
------------------
Este arquivo serve como contrato operacional para agentes que automatizam tarefas neste repositório. Siga as regras e, em caso de dúvida, pare e consulte um humano (autor do repositório ou time de frontend).


