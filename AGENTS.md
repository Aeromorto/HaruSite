# Haru — ambiente de migração

## Escopo
- Trabalhar exclusivamente no site, backend e banco de dados do Haru.
- Este ambiente pertence ao fork `uzoom333/HaruSite-migration`.
- O repositório `Aeromorto/HaruSite` é somente referência: não fazer push, merge, deploy ou alterações administrativas nele.
- Desenvolver a migração na branch `migration/stack`; publicar alterações somente no fork.
- Não reutilizar credenciais ou recursos de produção para o ambiente de migração.

## Continuidade
- Ler `docs/MIGRATION.md` antes de começar o trabalho.
- Atualizar esse documento com decisões confirmadas, validações, pendências e próximo passo ao concluir cada etapa.
- Não registrar segredos ou dados pessoais na documentação.
- Separar fatos confirmados de propostas; a stack de destino ainda não foi definida.

## Validação
- O projeto atual usa `npm ci --ignore-scripts`, `npm test` e `npm run build`, com Node.js >=22.
- Executar as verificações pertinentes ao alterar código; atualizar os comandos documentados quando a stack mudar.
