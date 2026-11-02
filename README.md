# Matchbook

Um site que recomenda **um livro por vez**. A pessoa responde **Amei** (o livro vai para os favoritos e ensina o algoritmo) ou **Próximo** (pula, e também ensina). Há ainda os favoritos ("Meus livros"), uma tela para adicionar livro ao catálogo e o Perfil, com os dados, as estatísticas do algoritmo, "Recomeçar do zero" e excluir conta.

Este repositório é o **front**: React 19, TypeScript estrito, Vite 7, styled-components, motion (animações) e react-router. O backend (Spring Boot + MySQL) fica no repositório `matchbook-api`.

A conta da pessoa fica no **Firebase Auth**: ela entra com a conta do **Google**, e o nome, o email e a foto vêm de lá. Ninguém guarda senha. O backend não guarda nada disso: ele só conhece o `uid` do Firebase, que tira do token enviado em toda chamada, e guarda as preferências de leitura, as reações (Amei e Próximo) e os livros que a pessoa criou. O contrato está em [`docs/CONTRATO-API.md`](docs/CONTRATO-API.md).

## Como rodar

Precisa do Node 24.15 ou mais novo.

```bash
npm install
npm run dev:mock   # o app com uma API falsa, sem backend
```

O app abre na página de primeira visita (`/`); o login fica em `/entrar`. No modo `dev:mock`, clique em **Entrar com Google**: o Firebase falso (`src/mocks/firebase.ts`) não abre janela nenhuma e entra direto como a conta de exemplo, a Ana. A API falsa (MSW, em `src/mocks/`) responde no formato do backend de verdade, com dados de exemplo, e nada sai para a rede.

| Comando             | O que faz                                                                         |
| ------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`       | o app falando com o backend em `http://localhost:8080/api` (ou no `VITE_API_URL`) |
| `npm run dev:mock`  | o app com a API falsa                                                             |
| `npm test`          | os testes dos fluxos principais (Vitest + Testing Library + a mesma API falsa)    |
| `npm run build`     | confere os tipos e gera o site em `dist/`                                         |
| `npm run typecheck` | só confere os tipos                                                               |
| `npm run lint`      | ESLint                                                                            |
| `npm run format`    | formata tudo com o Prettier (`format:check` só confere)                           |

### Com o Firebase e o backend de verdade

O `npm run dev` e o `npm run build` precisam do `firebaseConfig` do app Web do Firebase (Configurações do projeto → Seus apps), num `.env.local` na raiz. O `*.local` já está no `.gitignore`:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
# opcional: outro endereço de API
VITE_API_URL=https://...
```

Sem essas variáveis, o app para na abertura com um erro no console. Esses valores vão no site publicado de propósito, porque quem protege os dados é o backend conferindo o token. No console do Firebase, o Authentication precisa ter sido iniciado (o botão **Vamos começar**, senão toda entrada dá `CONFIGURATION_NOT_FOUND`) e o provedor **Google** precisa estar ativado (Authentication → Método de login), e o `FIREBASE_PROJECT_ID` do backend precisa ser o mesmo `projectId`.

**Cuidado:** o Vite dá prioridade às variáveis `VITE_*` que já existem no terminal sobre as do `.env.local`. Se o seu terminal exporta `VITE_FIREBASE_*` de outro projeto, é esse projeto que o app usa. Para conferir só os nomes, sem mostrar os valores: `env | cut -d= -f1 | grep '^VITE_'`.

Os testes e o `dev:mock` não leem nada disso.

### Deploy na Vercel

A Vercel não vê o `.env.local`, que fica fora do git. As mesmas variáveis vão em **Settings → Environment Variables**, e a `VITE_API_URL` passa a ser obrigatória: o endereço **https** do backend publicado, terminando em `/api`. O Vite escreve os valores no site na hora do build, então trocar uma variável só vale depois de um **Redeploy**. O domínio da Vercel também precisa entrar em Firebase → Authentication → Configurações → Domínios autorizados: sem isso, a janela do Google não abre no site publicado.

O `vercel.json` manda todo endereço para o `index.html`. Sem ele, abrir ou recarregar `/home` direto dá 404, porque as rotas existem só dentro do app.

## Estrutura

```
src/
  main.tsx         liga o React; no modo mock, liga a API falsa antes
  app/             App, provedores, rotas (cada tela carregada sob demanda) e endereços (paths.ts)
  layouts/         a moldura das telas: AppShell, AppLayout, AuthLayout, Header, MobileNav
  components/      o design system: peças visuais que não sabem de API nem de sessão
  features/        uma pasta por assunto: welcome (primeira visita), auth, recommendations, my-books,
                   add-book, profile, not-found (404)
  lib/             código sem tela: api/ (um arquivo por assunto), firebase.ts (o único que fala com o
                   Firebase), sessão, contador de curtidos
  styles/          tokens (cores, raios, sombras, gêneros), motion (curvas e transições), GlobalStyle
  mocks/           a API falsa (MSW) e o Firebase falso, usados pelos testes e pelo dev:mock
  test/            setup, renderApp e os testes de fluxo
```

Cada componente e cada tela tem a sua pasta, com o arquivo nomeado (`Button/Button.tsx`), um `index.ts` que diz o que sai da pasta e, quando há tipos, um `types.ts`. A importação usa o atalho `@/` (`@/components/Button`).

**Os tipos ficam sempre num `types.ts`**, nunca no arquivo do componente, da tela ou da função: as props de cada componente, os formatos de dados e os tipos de estado. O `types.ts` fica na pasta do componente ou da tela; os tipos dos hooks e das regras de uma feature ficam em `features/<feature>/types.ts`, e os de `lib/`, `styles/`, `app/`, `mocks/` e `test/` num `types.ts` na própria pasta (os da API em `lib/api/types.ts`). Ficam de fora só os tipos escritos dentro do `styled.x<...>` dos arquivos de estilo e as declarações globais do `src/vite-env.d.ts`.

**O código não leva comentário**, nem nos testes e nos arquivos de configuração. Os nomes das funções, dos tipos e dos testes dizem o que cada coisa faz. A exceção é a linha `/// <reference types="..." />` do `src/vite-env.d.ts` e do `vite.config.ts`: parece comentário, mas sem ela o TypeScript não acha os tipos do Vite e do Vitest.

**Quem pode importar quem:**

- `components/` só importa `styles/` e outros `components/`;
- `lib/` não importa nada de `features/`, `layouts/` ou `app/`;
- uma feature não importa outra, e `layouts/` não importa `features/`. O que várias telas usam mora em `lib/` (a sessão em `lib/session.ts`, o contador em `lib/likedCount.ts`);
- só `lib/firebase.ts` importa o SDK do Firebase. Nos testes e no `dev:mock`, o `vite.config.ts` troca esse arquivo pelo `src/mocks/firebase.ts`, que tem as mesmas funções;
- só `app/` (as rotas) importa as telas.

## Nomes: inglês no código, português no que é da tela

O código e o contrato com o backend estão em inglês: rotas, campos (`title`, `favoriteGenre`, `pageCount`...) e valores (`DIVERSIFIED`, `beginner`), descritos em `src/lib/api/types.ts`. Ficam em português, de propósito:

- todo texto da tela. Quando a API manda um valor em inglês, o front traduz (o nível de leitura `intermediate` aparece como Intermediário);
- o conteúdo dos livros, que vem assim do backend (gêneros como `Ficção Científica`, idiomas como `Português`);
- o `?editar=1` do Perfil: mudar muda o comportamento.

## Outros documentos

- [`docs/CONTRATO-API.md`](docs/CONTRATO-API.md): as rotas do backend, os campos e os fluxos de conta com o Firebase.
- [`docs/INTEGRACAO-API.md`](docs/INTEGRACAO-API.md) e [`docs/BACK-END-REQUISITOS.md`](docs/BACK-END-REQUISITOS.md) descrevem a estrutura e o backend anteriores ao Firebase.
- O commit que só formatou o projeto está em `.git-blame-ignore-revs`. Para o `git blame` local pular esse commit: `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
