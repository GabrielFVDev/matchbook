# Matchbook

Um site que recomenda **um livro por vez**. A pessoa responde **Amei** (o livro vai para os favoritos e ensina o algoritmo) ou **Próximo** (pula, e também ensina). Há ainda os favoritos ("Meus livros"), uma tela para adicionar livro ao catálogo e o Perfil, com os dados, as estatísticas do algoritmo, "Recomeçar do zero" e excluir conta.

Este repositório é o **front**: React 19, TypeScript estrito, Vite 7, styled-components, motion (animações) e react-router. O backend (Spring Boot + MySQL) fica no repositório `matchbook-api`.

## Como rodar

Precisa do Node 24.15 ou mais novo.

```bash
npm install
npm run dev:mock   # o app com uma API falsa, sem backend
```

O app abre na página de primeira visita (`/`); o login fica em `/entrar`. No modo `dev:mock`, entre com **`ana@email.com` / `123456`**. A API falsa (MSW, em `src/mocks/`) responde no formato do backend de verdade, com dados de exemplo.

| Comando             | O que faz                                                                         |
| ------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`       | o app falando com o backend em `http://localhost:8080/api` (ou no `VITE_API_URL`) |
| `npm run dev:mock`  | o app com a API falsa                                                             |
| `npm test`          | os testes dos fluxos principais (Vitest + Testing Library + a mesma API falsa)    |
| `npm run build`     | confere os tipos e gera o site em `dist/`                                         |
| `npm run typecheck` | só confere os tipos                                                               |
| `npm run lint`      | ESLint                                                                            |
| `npm run format`    | formata tudo com o Prettier (`format:check` só confere)                           |

Para outro endereço de API, crie um `.env.local` com `VITE_API_URL=https://...`.

## Estrutura

```
src/
  main.tsx         liga o React; no modo mock, liga a API falsa antes
  app/             App, provedores, rotas (cada tela carregada sob demanda) e endereços (paths.ts)
  layouts/         a moldura das telas: AppShell, AppLayout, AuthLayout, Header, MobileNav
  components/      o design system: peças visuais que não sabem de API nem de sessão
  features/        uma pasta por assunto: welcome (primeira visita), auth, recommendations, my-books,
                   add-book, profile, not-found (404)
  lib/             código sem tela: api/ (um arquivo por assunto), sessão, contador de curtidos
  styles/          tokens (cores, raios, sombras, gêneros), motion (curvas e transições), GlobalStyle
  mocks/           a API falsa (MSW), usada pelos testes e pelo dev:mock
  test/            setup, renderApp e os testes de fluxo
```

Cada componente e cada tela tem a sua pasta, com o arquivo nomeado (`Button/Button.tsx`) e um `index.ts` de uma linha. A importação usa o atalho `@/` (`@/components/Button`).

**Quem pode importar quem:**

- `components/` só importa `styles/` e outros `components/`;
- `lib/` não importa nada de `features/`, `layouts/` ou `app/`;
- uma feature não importa outra, e `layouts/` não importa `features/`. O que várias telas usam mora em `lib/` (a sessão em `lib/session.ts`, o contador em `lib/likedCount.ts`);
- só `app/` (as rotas) importa as telas.

## Nomes: inglês no código, português no que é contrato

Os nomes do código estão em inglês. Ficam em português, de propósito:

- **os campos da API** (`nome`, `generoFavorito`, `numeroPaginas`...), descritos em `src/lib/api/types.ts`. Quando o backend mudar, o contrato muda nesse arquivo e o compilador aponta o resto;
- **as chaves dos formulários**, que viram o corpo do pedido como estão;
- os valores que vêm do servidor ou são comparados com ele (estratégias como `DIVERSIFICADO`, nomes de gênero, níveis de leitura);
- as chaves `usuario` e `token` do `localStorage` e o `?editar=1` do Perfil: mudar qualquer uma muda o comportamento;
- todo texto da tela.

## Outros documentos

- [`docs/INTEGRACAO-API.md`](docs/INTEGRACAO-API.md) e [`docs/BACK-END-REQUISITOS.md`](docs/BACK-END-REQUISITOS.md) descrevem a estrutura anterior à reestruturação do front.
- O commit que só formatou o projeto está em `.git-blame-ignore-revs`. Para o `git blame` local pular esse commit: `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
