# Migração Haru

## Objetivo
Migrar a stack e evoluir o site e o banco de dados, mantendo o projeto original intacto e o trabalho acessível em um fork público.

## Ambiente
- Original de referência: https://github.com/Aeromorto/HaruSite (branch `main`).
- Fork de trabalho: https://github.com/uzoom333/HaruSite-migration.
- Branch de migração: `migration/stack`.
- Cópia local: `/home/uzoom/projetos/HaruSite-migration`.
- `origin` aponta para o fork; o push de `upstream` está bloqueado localmente.

## Estado inicial — 2026-09-09
- README apresenta versões v5 e v5.5 do site estático.
- Segundo o README, ainda não existe backend de autenticação, pedidos ou pagamentos.
- package.json usa scripts Node.js para testes, build e servidor local; jsdom é dependência de desenvolvimento.
- Workflow herdado publica GitHub Pages na branch main; publicação de um preview próprio ainda não foi configurada.
- Nenhuma migração de código ou dados foi executada nesta etapa.

## Decisões confirmadas
- Trabalhar em fork separado, sem alterar o original.
- Manter instruções e contexto no repositório para continuidade entre sessões.

## Próximo passo
Mapear páginas, funcionalidades, armazenamento no navegador e integrações. Com esse inventário, definir a stack de destino e as necessidades de hospedagem, autenticação, catálogo, pedidos, pagamentos e banco de dados. Implementar primeiro uma versão local verificável, preservando a identidade visual e os comportamentos acordados.

## Em aberto
- Stack e hospedagem de destino.
- Versão de referência para a migração (v5 ou v5.5).
- Escopo funcional inicial e existência de dados externos a importar.
- URL pública de preview do site migrado.
