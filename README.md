# Encurtador de Links

Aplicação web simples para encurtar URLs usando **Node.js**, **Express**, **MongoDB** e um frontend estático em HTML, CSS e JavaScript.

## Funcionalidades

- Encurta URLs enviadas pelo usuário.
- Gera um código curto de 5 caracteres para cada link.
- Redireciona automaticamente do link curto para a URL original.
- Expiração automática dos links após 2 horas.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- dotenv
- shortid

## Estrutura do projeto

```text
.
├── index.html
├── server.js
├── package.json
├── vercel.json
└── assets/
    ├── script.js
    └── style.css
```

## Requisitos

- Node.js instalado.
- Acesso a um banco MongoDB.
- Arquivo `.env` na raiz do projeto com a variável `MONGO_URI`.

## Configuração

Crie um arquivo `.env` na raiz do projeto com o conteúdo abaixo:

```env
MONGO_URI=sua_string_de_conexao_mongodb
PORT=3000
```

Se `PORT` não for informado, o servidor usa `3000` por padrão.

## Instalação

```bash
npm install
```

## Como executar

### Ambiente local

1. Configure o arquivo `.env`.
2. Inicie o servidor:

```bash
node server.js
```

3. Abra o `index.html` no navegador ou sirva os arquivos estáticos com a sua ferramenta preferida.

### Observação sobre o frontend

O arquivo [assets/script.js](assets/script.js) usa a variável `baseUrl` para montar as chamadas da API e os links curtos. Atualmente ela está apontando para `https://devcix.com`.

Se você estiver rodando localmente, ajuste esse valor para o endereço do seu ambiente, por exemplo:

```js
const baseUrl = 'http://localhost:3000';
```

## Rotas da API

### `POST /api/shorten`

Encurta uma URL informada no corpo da requisição.

Exemplo de payload:

```json
{
  "fullUrl": "https://exemplo.com"
}
```

Resposta de sucesso:

```json
{
  "shortUrl": "abc12"
}
```

### `GET /:shortUrl`

Redireciona o usuário para a URL original associada ao código curto.

Exemplo:

```text
GET /abc12
```

## Comportamento dos links

- O código curto é gerado automaticamente com `shortid`.
- Os registros expiram após 7200 segundos, ou seja, 2 horas.
- Após expirar, o link curto retorna `404`.

## Deploy

O projeto contém [vercel.json](vercel.json) com rewrite para `index.html`, indicando uso em ambiente de hospedagem estática. Como o backend depende de Express e MongoDB, verifique a estratégia de deploy antes de publicar em produção.

## Licença

Projeto sem licença definida.
