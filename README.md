# HARU — migração da stack

Base de desenvolvimento da v5.5 em **Next.js + NestJS + TypeScript + Tailwind CSS + daisyUI + PostgreSQL**.

Este repositório é o fork de trabalho `uzoom333/HaruSite-migration`, branch `migration/stack`. O original `Aeromorto/HaruSite` permanece intacto.

## Começar a trabalhar

Requisitos: Node.js **22.13+** (ou 24), npm e PostgreSQL. Não são necessárias chaves de pagamento para desenvolver esta entrega.

```bash
npm ci --ignore-scripts
cp .env.example .env
```

Escolha **um** banco local:

```bash
# Ubuntu/Linux com PostgreSQL já instalado: cria cluster exclusivo na pasta .local.
npm run db:local
```

Ou use o container isolado (não execute os dois na mesma porta):

```bash
docker compose up -d db
```

Depois:

```bash
npm run db:migrate
npm run dev
```

Abra **http://localhost:3000**. A API fica em `http://127.0.0.1:3001/api/health`. O banco usa a porta **55439**, diferente do serviço padrão 5432.

O `.env` da raiz é carregado pelos dois aplicativos. Ao alterar variáveis, reinicie os processos. `WEB_ORIGIN` deve ser o endereço exato usado no navegador; para usar `http://127.0.0.1:3000`, ajuste a variável.

## Onde editar

| Objetivo | Local |
| --- | --- |
| Páginas e metadados | `apps/web/src/app/` |
| Conteúdo editorial migrado | `apps/web/src/content/*.tsx` |
| Textos em português/inglês | `apps/web/src/content/translations.json` |
| Cabeçalho e rodapé | `apps/web/src/components/site-shell.tsx` |
| Catálogo, filtros, CEP e formulário | `apps/web/src/components/commerce.tsx` |
| Sacola e estado da interface | `apps/web/src/components/cart-drawer.tsx`, `store-provider.tsx` |
| Ajustes visuais | `apps/web/src/app/globals.css` |
| Estilos originais preservados | `apps/web/src/styles/` |
| Fotos e fontes locais | `apps/web/public/` |
| API, validações e regras | `apps/api/src/` |
| Tabelas e catálogo inicial | `apps/api/migrations/` |
| Contratos frontend/backend | `packages/contracts/src/index.ts` |

## O que funciona nesta entrega

- Oito páginas migradas, navegação React e redirecionamentos de URLs `.html`.
- Visual, imagens, fontes, temas clara/kraft e idiomas PT/EN da v5.5.
- Catálogo PostgreSQL, filtro de preço e ordenação.
- Sacola anônima persistida no servidor, quantidades e subtotais validados pela API.
- Consulta de cidade/estado pelo CEP via ViaCEP, com cancelamento e tratamento de falhas.
- Salvamento e exclusão de e-mail **somente neste aparelho**, como função local.
- Estados de carregamento, tentativa novamente, página 404 e foco acessível na sacola.

Compras e pagamentos continuam indisponíveis. Não há reserva de estoque, cotação dos Correios, envio de newsletter, autenticação de clientes ou painel administrativo nesta entrega. O estoque inicial ainda é desconhecido; o limite de nove unidades do legado é mantido até informar um saldo real. Isso não indica disponibilidade comercial.

## Verificar

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Testes de API e navegador exigem `TEST_DATABASE_URL` com nome terminado em `_test` e usam os bancos locais criados acima. A suíte da API aplica migrações no banco de testes. Execute `npm test` antes do primeiro `test:e2e`. O navegador usa portas 3002/3100 para não interferir em 3001/3000.

Para testar o build de produção, execute em terminais separados:

```bash
npm run start -w @haru/api
npm run start -w @haru/web
```

## Documentação

- [Relatório de migração e manutenção](docs/MIGRATION.md)
- [Requisitos extraídos do CSV e próximas etapas](docs/REQUIREMENTS.md)
- [Contrato da API](docs/API.md)
- [Instruções para agentes](AGENTS.md)
- [Revisão anterior da v5.5](docs/REVIEW.md)

## Legado e publicação

Os HTML/CSS/JS antigos permanecem na raiz e em `v5.5/` para comparação. **Edite `apps/` para trabalhar na nova stack.** `npm run build:legacy` e `npm run start:legacy` permitem consultar as versões antigas na porta 8765.

A nova aplicação precisa de dois processos Node e PostgreSQL. GitHub Pages não executa essa arquitetura. O workflow desta branch valida a migração; não publica o site nem altera o original. O código pode ser acompanhado no fork público; um preview público da aplicação ainda não foi provisionado.

## Prévia visual

Capturas da última rodada de testes de navegador (anteriores aos refinamentos finais de CSS):

- [Desktop](docs/preview/desktop.png)
- [Celular](docs/preview/mobile.png)

Para navegar na aplicação, execute os passos de instalação acima. Ainda não há URL pública da aplicação em execução. Colaboradores podem clonar este fork com `git clone --branch migration/stack https://github.com/uzoom333/HaruSite-migration.git` e enviar pull requests para esta branch; push direto depende das permissões do GitHub.
