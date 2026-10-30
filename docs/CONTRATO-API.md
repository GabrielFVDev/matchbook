# Contrato da API e login com Firebase

Este documento ensina o front a falar com o backend novo (`matchbook-api`, outubro de 2026). Ele substitui o que `INTEGRACAO-API.md` e `BACK-END-REQUISITOS.md` dizem sobre rotas e campos.

## O que mudou, em uma lista

1. **Conta e login saem do backend e vão para o Firebase Auth, com a conta do Google.** O backend não guarda mais e-mail, senha, nome nem foto, e ninguém guarda senha: quem confere é o Google. O login antigo, que baixava todos os usuários com a senha e comparava no navegador, deixa de existir.
2. **Toda chamada para `/api` precisa do token do Firebase** no cabeçalho `Authorization: Bearer <token>`. Sem token, ou com token vencido, a resposta é `401`.
3. **Nenhuma rota recebe mais o id do usuário.** O backend descobre quem é pelo token. Some todo `userId`, `idUsuario` e `usuarioId` das URLs.
4. **Rotas, campos e valores agora estão em inglês.** O texto da tela continua em português, e quem traduz é o front.
5. **A biblioteca é pessoal.** Cada pessoa vê os livros comuns (os do seed) mais os que ela criou. Só quem criou um livro edita ou apaga.

## 1. Configurar o Firebase no front

### No console do Firebase (uma vez)

- **Authentication → Vamos começar:** sem isso, toda entrada responde `400 CONFIGURATION_NOT_FOUND`.
- **Authentication → Método de login → Adicionar novo provedor → Google:** ativar e escolher o e-mail de suporte do projeto.
- **Configurações do projeto → Seus apps → app Web:** copiar o `firebaseConfig`.
- **Authentication → Configurações → Domínios autorizados:** o `localhost` já vem. O domínio de produção **precisa** entrar quando o app for publicado: a janela do Google só abre em domínio autorizado.
- **Backend:** a variável `FIREBASE_PROJECT_ID` do backend é o mesmo `projectId` do `firebaseConfig`. Sem ela, a API nem sobe.

### No código

Instalar o SDK:

```bash
npm install firebase
```

Criar um `.env.local` na raiz do front. O `*.local` já está no `.gitignore`:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Esses valores **não são segredo**: o Firebase foi feito para eles irem no bundle. Quem protege os dados é o backend, conferindo o token.

Declarar as variáveis em `src/vite-env.d.ts`, junto com as que já existem:

```ts
readonly VITE_FIREBASE_API_KEY: string;
readonly VITE_FIREBASE_AUTH_DOMAIN: string;
readonly VITE_FIREBASE_PROJECT_ID: string;
readonly VITE_FIREBASE_APP_ID: string;
```

Inicializar o Firebase num lugar só, por exemplo `src/lib/firebase.ts`:

```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const auth = getAuth(app);
```

## 2. Os fluxos de conta

### Entrar e criar conta

É a mesma chamada: a janela (popup) do Google entra numa conta que já existe ou cria uma nova. O `isNewUser` diz qual foi.

```ts
import { GoogleAuthProvider, getAdditionalUserInfo, signInWithPopup, signOut } from 'firebase/auth';

const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' }); // sempre deixa escolher a conta

const result = await signInWithPopup(auth, google);
const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

await signOut(auth);
```

O nome, o e-mail e a foto vêm da conta do Google. Para a conta nova, o cadastro pergunta o gosto e salva no backend:

```ts
await api.put('/me/preferences', {
  favoriteGenre,
  favoriteAuthor,
  readingLevel,
  receiveRecommendations,
});
```

As preferências podem ficar para depois. Quem não tem preferências salvas recebe recomendações mesmo assim, só que sem o peso do gosto.

### Sessão e rotas protegidas

Quem diz se há alguém logado é o Firebase, não mais a chave `usuario` do `localStorage`. O SDK guarda a sessão sozinho e renova o token sozinho.

```ts
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  // user === null: ninguém logado
});
```

**Cuidado:** ao recarregar a página, o Firebase leva um instante para restaurar a sessão. Os guards (`ProtectedRoute` e `PublicRoute`) precisam esperar a **primeira** chamada do `onAuthStateChanged` antes de decidir. Senão, quem está logado é jogado para o login por um instante.

O nome e o e-mail ficam em `auth.currentUser.displayName` e `auth.currentUser.email`. A foto fica em `photoURL`. O nome pode ser trocado com `updateProfile`.

### Apagar a conta

A ordem importa. O backend precisa receber o pedido **enquanto o token ainda vale**, e o Firebase só deixa apagar a conta se o login for recente:

```ts
import { reauthenticateWithPopup, deleteUser } from 'firebase/auth';

// 1. Abrir a janela do Google de novo (o Firebase exige login recente para apagar)
await reauthenticateWithPopup(auth.currentUser!, google);
// 2. Apagar os dados no backend: preferências, reações, livros que ela criou
await api.delete('/me');
// 3. Apagar a conta no Firebase
await deleteUser(auth.currentUser!);
```

Se o passo 2 vier antes do 1 e a reautenticação falhar, a pessoa fica com uma conta vazia no Firebase.

### Erros do Firebase para mostrar na tela

| Código (`error.code`)                                       | O que fazer                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `auth/popup-closed-by-user`, `auth/cancelled-popup-request` | A pessoa fechou a janela: não mostrar erro                   |
| `auth/popup-blocked`                                        | O navegador bloqueou a janela: pedir para liberar pop-ups    |
| `auth/user-mismatch`                                        | Na reautenticação, escolheu outra conta: pedir a mesma       |
| `auth/unauthorized-domain`                                  | O domínio não está nos domínios autorizados (configuração)   |
| `auth/operation-not-allowed`                                | O provedor Google não está ativado no console (configuração) |
| `auth/too-many-requests`                                    | Muitas tentativas. Tente de novo em alguns minutos.          |
| `auth/network-request-failed`                               | Sem conexão. Confira a internet.                             |

## 3. Mandar o token em toda chamada

Em `src/lib/api/client.ts`, um interceptor de requisição:

```ts
import { auth } from '@/lib/firebase';

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken(); // renova sozinho quando está perto de vencer
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

- **`401`:** o token faltou ou não vale. O mais simples é chamar `signOut` e mandar para `/entrar`.
- **`404` no `GET /me/preferences` é normal:** quer dizer "ainda não salvou preferências". Hoje o interceptor de resposta do `client.ts` transforma todo 404 em `Error('Recurso não encontrado')`, e isso precisa abrir uma exceção para essa rota.

## 4. As rotas

Todas ficam sob `/api` e todas exigem o token. "Corpo vazio" quer dizer que a resposta não tem JSON.

### Preferências e conta

| Método e rota         | Envia                    | Responde                                                                                                                       |
| --------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `GET /me/preferences` | nada                     | `200` com as preferências, ou `404` se ainda não salvou                                                                        |
| `PUT /me/preferences` | as preferências (abaixo) | `200` com o que ficou salvo. Cria ou substitui tudo: texto omitido vira `null` e `receiveRecommendations` omitido vira `false` |
| `DELETE /me`          | nada                     | `204`. Apaga preferências, reações e os livros que a pessoa criou                                                              |

### Livros

| Método e rota             | Envia                         | Responde                                                                                 |
| ------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| `GET /book/getAll`        | nada                          | `200` com os livros que a pessoa vê (os comuns e os dela), ou `204` se não houver nenhum |
| `GET /book/get?id=`       | `id`                          | `200` com o livro, ou `404` se ele não existe ou é de outra pessoa                       |
| `POST /book/create`       | o livro, sem `id`             | `200` com o livro criado, já com `id`, `ownerUid` e `createdAt`                          |
| `PUT /book/update`        | o livro **inteiro**, com `id` | `200`, `403` se não é dela (inclusive os comuns) ou `404`                                |
| `DELETE /book/delete?id=` | `id`                          | `204`, `403` ou `404`. Apaga também as reações a esse livro                              |

- No `create`, o `id` e o `ownerUid` enviados são ignorados.
- O `update` substitui o livro: campo que não for enviado fica vazio. Mande o livro completo.

### Meus livros (curtidos)

| Método e rota                | Envia    | Responde                                                                                         |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `GET /book/liked`            | nada     | `200` com os livros curtidos, do mais recente para o mais antigo. Lista vazia `[]` se não houver |
| `GET /book/liked/count`      | nada     | `200` com `{ "total": 3 }`                                                                       |
| `DELETE /book/liked?bookId=` | `bookId` | `204`, ou `404` se o livro não estava curtido                                                    |

- **Curtir é `POST /recommendation/accept`.** Não existe mais uma rota separada de curtir.
- **Descurtido, o livro pode voltar a aparecer nas recomendações.**

### Recomendações

| Método e rota                                   | Envia    | Responde                                                                                           |
| ----------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `GET /recommendation/getRecommendation`         | nada     | `200` com os livros ainda não vistos, do mais indicado para o menos, ou `204` se não sobrou nenhum |
| `GET /recommendation/getAdaptiveRecommendation` | nada     | igual, mas a ordem e a quantidade dependem da estratégia atual (abaixo)                            |
| `POST /recommendation/accept?bookId=`           | `bookId` | `200` com corpo vazio, ou `400` se o livro não existe ou é de outra pessoa                         |
| `POST /recommendation/reject?bookId=`           | `bookId` | `200` com `{ totalRejections, algorithmChanged, suggestion }`, ou `400`                            |
| `GET /recommendation/statistics`                | nada     | `200` com `{ totalRejections, totalAcceptances, acceptanceRate, currentStrategy }`                 |
| `POST /recommendation/resetAlgorithm`           | nada     | `200`. Apaga **todas** as reações, curtidas inclusive, então "Meus livros" fica vazio              |

- **Uma reação por livro.** Recusar um livro curtido troca a reação, e o contrário também.
- **"Visto" é o livro que já tem reação**, curtida ou recusa. Ele não volta na recomendação.
- **`acceptanceRate` vai de 0 a 100.**
- **`suggestion` já vem em português**, pronta para a tela.

| `currentStrategy` | Quando             | O que a adaptativa devolve                                                                                                            |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `DEFAULT`         | começo             | todos os não vistos, por pontuação                                                                                                    |
| `REFINED`         | 3 curtidas ou mais | todos os não vistos, pesando os gêneros curtidos                                                                                      |
| `DIVERSIFIED`     | 5 recusas ou mais  | os melhores de cada gênero: 10 dividido pelo número de gêneros, no mínimo 1 por gênero. Com muitos gêneros, como no seed, passa de 10 |
| `EXPLORATORY`     | 10 recusas ou mais | até 10, sorteados                                                                                                                     |

Quando as regras se cruzam, vence a primeira que bater nesta ordem: 10 recusas, depois 3 curtidas, depois 5 recusas.

## 5. Formato dos dados

### Livro

```json
{
  "id": 12,
  "title": "Dom Casmurro",
  "author": "Machado de Assis",
  "publisher": "Nova Aguilar",
  "genre": "Romance Brasileiro",
  "publicationYear": 1899,
  "pageCount": 256,
  "language": "Português",
  "synopsis": "...",
  "coverUrl": "https://...",
  "photoUrl": null,
  "createdAt": "...",
  "ownerUid": null
}
```

- **`ownerUid: null`** é um livro comum, que ninguém edita. **Igual a `auth.currentUser.uid`** é um livro da pessoa: mostrar editar e apagar.
- **O conteúdo dos livros continua em português.** Só os nomes dos campos mudaram.

### Preferências

```json
{
  "firebaseUid": "kX9a2...",
  "favoriteGenre": "Fantasia",
  "favoriteAuthor": "Tolkien",
  "readingLevel": "intermediate",
  "receiveRecommendations": true
}
```

- **`firebaseUid`** é sempre o da pessoa logada. No `PUT`, se vier outro, ele é ignorado.
- **`readingLevel`** aceita `beginner`, `intermediate` ou `advanced`. A tela mostra Iniciante, Intermediário e Avançado, e o front converte. Hoje o `TasteFields` manda o texto em português.

## 6. De → para

### Rotas

| Antes                                                   | Agora                                                                   |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| `POST /usuario/create`                                  | Firebase (`signInWithPopup` com Google) + `PUT /me/preferences`         |
| `GET /usuario/all` (o login simulado)                   | Firebase (`signInWithPopup` com Google)                                 |
| `PUT /usuario/update`                                   | `PUT /me/preferences`. Nome e foto vão pelo `updateProfile` do Firebase |
| `POST /livro/create`                                    | `POST /book/create`                                                     |
| `GET /recomendacao/getRecomendacaoAdaptativa/{id}`      | `GET /recommendation/getAdaptiveRecommendation`                         |
| `POST /recomendacao/aceitar?idUsuario=&idLivro=`        | `POST /recommendation/accept?bookId=`                                   |
| `POST /recomendacao/recusar?idUsuario=&idLivro=`        | `POST /recommendation/reject?bookId=`                                   |
| `GET /recomendacao/estatisticas/{id}`                   | `GET /recommendation/statistics`                                        |
| `POST /recomendacao/resetarAlgoritmo/{id}`              | `POST /recommendation/resetAlgorithm`                                   |
| `GET /livros-curtidos/usuario/{id}`                     | `GET /book/liked`                                                       |
| `POST /livros-curtidos/curtir?usuarioId=&livroId=`      | `POST /recommendation/accept?bookId=`                                   |
| `DELETE /livros-curtidos/descurtir?usuarioId=&livroId=` | `DELETE /book/liked?bookId=`                                            |
| `GET /livros-curtidos/usuario/{id}/contador`            | `GET /book/liked/count`                                                 |

### Campos

| Antes                                                              | Agora                                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `titulo`, `autor`, `editora`, `genero`                             | `title`, `author`, `publisher`, `genre`                                    |
| `anoPublicacao`, `numeroPaginas`, `idioma`, `sinopse`              | `publicationYear`, `pageCount`, `language`, `synopsis`                     |
| `capa` (e o `capaUrl` que o formulário mandava)                    | `coverUrl`                                                                 |
| `dataCadastro`                                                     | `createdAt`                                                                |
| `generoFavorito`, `autorPreferido`, `nivelLeitura`                 | `favoriteGenre`, `favoriteAuthor`, `readingLevel`                          |
| `receberRecomendacoes`                                             | `receiveRecommendations`                                                   |
| `nome`, `email`, `fotoUrl` do usuário                              | Firebase: `displayName`, `email`, `photoURL`                               |
| `totalRecusas`, `totalAceites`, `taxaAceitacao`, `estrategiaAtual` | `totalRejections`, `totalAcceptances`, `acceptanceRate`, `currentStrategy` |
| `algoritmoAlterado`, `sugestao`                                    | `algorithmChanged`, `suggestion`                                           |
| `PADRAO`, `REFINADO`, `DIVERSIFICADO`, `EXPLORATORIO`              | `DEFAULT`, `REFINED`, `DIVERSIFIED`, `EXPLORATORY`                         |
| `Iniciante`, `Intermediário`, `Avançado`                           | `beginner`, `intermediate`, `advanced`                                     |

### O que deixou de existir

- **Do usuário:** `senha`, `biografia`, `dataNascimento` e `livrosLidos`. O cadastro e o Perfil ainda mostram os três últimos, então eles saem da tela ou ganham outro lugar.
- **Do livro:** `isbn`, `disponivel` e `avaliacaoMedia`. O formulário de Adicionar livro ainda manda `isbn` e `disponivel`.
- **Nas respostas:** os campos que "Meus livros" tentava ler e o backend nunca mandou (`livro`, `livroId`, `imagem`, `imagemUrl`, `dataCurtida`). Agora a lista vem com os livros direto.

## 7. Onde mexer no front

| Arquivo                                                                   | O que muda                                                                                                                                                           |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/firebase.ts`                                                     | novo: inicializa o Firebase                                                                                                                                          |
| `src/lib/api/client.ts`                                                   | interceptor do token, tratamento do `401` e exceção do `404` em `/me/preferences`                                                                                    |
| `src/lib/api/auth.ts`, `src/features/auth/useAuth.ts`                     | cadastro e login pelo Firebase                                                                                                                                       |
| `src/lib/session.ts`                                                      | a sessão passa a ser o Firebase, e a chave `usuario` do `localStorage` deixa de ser a prova de login                                                                 |
| `src/features/auth/RouteGuards.tsx`                                       | esperar a primeira resposta do `onAuthStateChanged`                                                                                                                  |
| `src/lib/api/types.ts`                                                    | campos novos (seções 5 e 6)                                                                                                                                          |
| `src/lib/api/books.ts`, `likedBooks.ts`, `recommendations.ts`, `users.ts` | rotas novas, sem id de usuário                                                                                                                                       |
| `src/components/TasteFields`, cadastro e Perfil                           | valores de `readingLevel` e os campos que deixaram de existir                                                                                                        |
| `src/mocks/handlers.ts` e testes                                          | MSW com as rotas novas. Nos testes, o Firebase fica atrás do `src/lib/firebase.ts` (ou de um módulo de auth do front), e é esse módulo que se substitui por um falso |

## 8. Testar a API na mão

1. Com o app rodando e alguém logado, abra o DevTools → Network e copie o cabeçalho `Authorization` de qualquer chamada para `/api`.
2. Use o cabeçalho num `curl`:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/me/preferences
```

O token vale cerca de uma hora e dá acesso à conta de quem estava logado. Não cole em lugar público.
