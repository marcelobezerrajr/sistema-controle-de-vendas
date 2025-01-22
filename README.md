<div align="center">
    <img src="./frontend/src//assets/logo_marcelo_developer_branco.png" height="70" style="margin-bottom: 20px; margin-top: 20px;">
    <h1 align="center">Sistema Controle de Vendas 📈📊</h1>
</div>

Este sistema oferece um completo gerenciamento de operações comerciais, permitindo o controle eficiente de vendas e seus diversos elementos por meio de funcionalidades de CRUD (Create, Read, Update, Delete). Inclui o cadastro e a gestão de Usuários, Clientes, Comissões, Custos, Fornecedores, Parcelas, Itens de Venda, Produtos, Vendas, Vendedores e o relacionamento entre Venda e Vendedor. Ideal para empresas que buscam uma solução integrada para otimizar processos e acompanhar todas as etapas do ciclo de vendas.

## Funcionalidades

- Login
- Requisição de Senha
- Reset de Senha
- Troca de Senha
- CRUD (Usuário, Cliente, Comissão, Custo, Fornecedor, Parcela, Item Venda, Produto, Venda, Vendedor e Venda Vendedor)
## Stacks utilizadas

**Front-end:** React

**Back-end:** FastApi

**SQL:** Sqlite

**Autenticação e Autorização:** JWT e OAuth2PasswordBearer

**Envio de E-mails:** MIMEMultipart

## Documentação da API - CRUD

As chamadas para a API seguem um padrão consistente para todas as entidades do sistema (Fornecedores, Usuários, Vendedores, Produtos, etc.). Para utilizar outros recursos, substitua o caminho e o identificador da entidade conforme necessário. Abaixo estão exemplos utilizando a entidade **Fornecedor**.

### Listar todos os Fornecedores

Retorna uma lista de todos os fornecedores cadastrados.

```http
  GET /fornecedor/list
```

| Parâmetro   | Tipo       | Descrição                           | 
| :---------- | :--------- | :---------------------------------- |
| `SECRET_KEY` | `string` | **Obrigatório**. 	Chave de autenticação da API. |

### Obter Fornecedor por ID

Retorna os detalhes de um fornecedor específico.

```http
  GET /fornecedor/view/{id_fornecedor}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id_fornecedor` | `int` | **Obrigatório**. ID do fornecedor que deseja consultar. |
| `SECRET_KEY` | `string` | **Obrigatório**. 	Chave de autenticação da API. |

### Criar um Novo Fornecedor

Adiciona um novo fornecedor ao sistema.

```http
  POST /fornecedor/create
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `nome_fornecedor` | `string` | **Obrigatório**. 	Nome do fornecedor. |
| `percentual_comissao` | `string` | **Obrigatório**. Percentual de Comissão do fornecedor. |
| `impostos` | `string` | **Obrigatório**. Valor dos impostos do Fornecedor. |
| `SECRET_KEY` | `string` | **Obrigatório**. Chave de autenticação da API. |

### Atualiza um Fornecedor
Atualiza as informações de um fornecedor existente.

```http
  PUT /fornecedor/update/{id_fornecedor}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id_fornecedor` | `int` | **Obrigatório**. 	ID do fornecedor. |
| `nome_fornecedor` | `string` | **Obrigatório**. 	Nome do fornecedor. |
| `percentual_comissao` | `string` | **Obrigatório**. Percentual de Comissão do fornecedor. |
| `impostos` | `string` | **Obrigatório**. Valor dos impostos do Fornecedor. |
| `SECRET_KEY` | `string` | **Obrigatório**. Chave de autenticação da API. |

### Deletar um Fornecedor
Remove um fornecedor do sistema.

```http
  DELETE /fornecedor/delete/{id_fornecedor}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id_fornecedor` | `int` | **Obrigatório**. ID do fornecedor que será deletado. |
| `SECRET_KEY` | `string` | **Obrigatório**. Chave de autenticação da API. |

#### Observações Gerais:

- Todos os endpoints exigem autenticação via `SECRET_KEY`.
- O formato das respostas segue o padrão JSON, facilitando a integração com diferentes sistemas.

## Documentação da API - Autenticação e Login

Esta API utiliza **OAuth2 com Password Flow** para autenticação, gerando tokens **JWT** para controle de acesso. A seguir estão os endpoints para login e verificação de autenticação do usuário.

### Autenticação de Login- Obter Token de Acesso

Este endpoint permite que um usuário autenticado receba um token de acesso JWT.

#### Endpoint:

```http
  POST /login/token
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `username` | `string` | **Obrigatório**. E-mail do usuário para login. |
| `password` | `string` | **Obrigatório**. Senha do usuário. |

### Obter Dados do Usuário Autenticado

Valida o token e retorna as informações do usuário autenticado.

#### Endpoint:

```http
  GET /login/me
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization` | `string` | **Obrigatório**. Token JWT no formato Bearer Token. |

#### Exemplo de Fluxo de Autenticação:

- O usuário envia suas credenciais para `/login/token`.
- Recebe um `access_token`.
- Utiliza o token para acessar recursos protegidos em `/login/me`.

#### Observações Gerais:

- O token tem um tempo de expiração configurado por `ACCESS_TOKEN_EXPIRE_MINUTES`.
- Use o token em todos os endpoints que exigem autenticação.
- Certifique-se de proteger a chave secreta `SECRET_KEY` e utilizar algoritmos seguros como o definido em `ALGORITHM`.

## Documentação da API - Gerenciamento de Senhas

A API oferece suporte a recuperação e redefinição de senhas de maneira segura utilizando tokens JWT para validação. Abaixo estão descritos os endpoints para solicitar a redefinição de senha, verificar o token e redefinir a senha.

### Troca de Senha

Este endpoint permite que um usuário autenticado altere sua senha atual para uma nova, desde que forneça a senha atual correta e a nova senha atenda aos requisitos de complexidade.

#### Endpoint:

```http
  POST /change-password
```

#### Cabeçalho de Autorização:

É necessário enviar o token JWT no cabeçalho da requisição no formato `Bearer Token`.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization` | `string` | **Obrigatório**. 	Token JWT no formato Bearer Token. |

#### Cabeçalho de Autorização:

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `current_password` | `string` | **Obrigatório**. A senha atual do usuário. |
| `new_password` | `string` | **Obrigatório**. A nova senha que será definida. |

#### Requisitos de Senha

A senha deve atender aos seguintes requisitos de complexidade:

- Mínimo de 8 caracteres.
- Pelo menos uma letra maiúscula e uma minúscula.
- Pelo menos um número e um caractere especial.

#### Exemplo de Fluxo de Troca de Senha:

- O usuário está autenticado e envia a requisição para `/change-password`.
- O token JWT é validado para garantir a autenticidade do usuário.
- A senha atual é verificada.
- Se tudo for validado com sucesso, a nova senha é aplicada.

### Solicitar Redefinição de Senha

Este endpoint permite solicitar a redefinição de senha enviando um e-mail de recuperação ao usuário.

#### Endpoint:

```http
  POST /reset-password/request-password
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email` | `string` | **Obrigatório**. 	E-mail cadastrado do usuário. |

### Verificar Token de Redefinição de Senha

Valida o token recebido no e-mail antes de permitir a redefinição de senha.

#### Endpoint:

```http
  POST /reset-password/verify
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token` | `string` | **Obrigatório**. Token de redefinição de senha. |

### Redefinir Senha

Permite ao usuário redefinir sua senha após a validação do token.

#### Endpoint:

```http
  POST /reset-password/reset
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token` | `string` | **Obrigatório**. Token de redefinição de senha. |
| `new_password` | `string` | **Obrigatório**. 	Nova senha do usuário. |

#### Requisitos de Senha

A senha deve atender aos seguintes requisitos de complexidade:

- Mínimo de 8 caracteres.
- Pelo menos uma letra maiúscula e uma minúscula.
- Pelo menos um número e um caractere especial.

#### Exemplo de Fluxo de Redefinição:

- O usuário solicita a redefinição com `/reset-password/request-password`.
- Recebe o token por e-mail.
- Verifica o token em `/reset-password/verify`.
- Redefine a senha em `/reset-password/reset`.

## Documentação da API - Registro de Usuário

O endpoint de registro permite a criação de novos usuários no sistema. Após o registro bem-sucedido, um token de acesso é gerado automaticamente para autenticação.

### Registro de Usuário

#### Endpoint:

```http
  POST /register
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `username` | `string` | **Obrigatório**. E-mail do usuário para login(único). |
| `email` | `string` | **Obrigatório**. E-mail do usuário (único). |
| `hashed_password` | `string` | **Obrigatório**. Senha do usuário(hash). |
| `permission` | `string` | **Obrigatório**. 	Permissão atribuída ao usuário. |

#### Códigos de Status:

- **200 OK** – Registro realizado com sucesso.
- **400 Bad Request** – E-mail já cadastrado ou erro de validação.

#### Fluxo de Registro:

- O cliente envia as informações do usuário para o endpoint `/register`.
- O sistema verifica se o e-mail já está registrado.
- Se for novo, o usuário é registrado, e um token JWT é gerado para autenticação.
- A resposta inclui o token de acesso, permitindo que o usuário esteja imediatamente autenticado.
## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

**Back-end:**

`SQLALCHEMY_DATABASE_URL`

`SECRET_KEY`

`ALGORITHM`

`ACCESS_TOKEN_EXPIRE_MINUTES`

`RESET_TOKEN_EXPIRY_HOURS`

`SMTP_SERVER`
`SMTP_PORT`
`SMTP_USERNAME`
`SMTP_PASSWORD`

`EMAIL_FROM`

`RESET_PASSWORD_URL`

**Front-end:**

`VITE_API_URL`

## Guia de Instalação do Projeto (Backend: FastAPI + Frontend: React com Vite)

### Pré-requisitos

- Python 3.8+ (para o backend)
- Node.js 16+ (para o frontend)
- Gerenciador de Pacotes:
    - Pip para Python
    - NPM ou YARN para Node.js

### 1. Configuração do Backend (FastAPI)

#### Passo 1: Acesse o diretório do backend

```bash
  cd backend
```

#### Passo 2: Crie um ambiente virtual (opcional, mas recomendado)

```bash
  python -m venv venv
  source venv/bin/activate     # Linux/MacOS
  # ou
  venv\Scripts\activate        # Windows

```

#### Passo 3: Instale as dependências

Certifique-se de que o arquivo `requirements.txt` está na pasta `backend`.

```bash
  pip install -r requirements.txt
```

#### Passo 4: Configuração de variáveis de ambiente

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:

```bash
  SQLALCHEMY_DATABASE_URL=sqlite:///./vendas.db  # ou outro banco (PostgreSQL, MySQL etc.)
  SECRET_KEY=chave_secreta
  ALGORITHM=HS256
  ACCESS_TOKEN_EXPIRE_MINUTES=120
  RESET_TOKEN_EXPIRY_HOURS=1
  SMTP_SERVER=smtp.office365.com
  SMTP_PORT=587
  SMTP_USERNAME=username
  SMTP_PASSWORD=password
  EMAIL_FROM=email_from
  RESET_PASSWORD_URL=http://localhost:5173/reset-password
```

#### Passo 5: Inicie o servidor FastAPI

Inicie com o código bash abaixou ou iniciando o arquivo `run.py`, que está no `backend`.

```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
O backend estará disponível em: http://localhost:8000.

### 2. Configuração do Frontend (React com Vite)

#### Passo 1: Acesse o diretório do frontend

```bash
  cd frontend
```

#### Passo 2: Instale as dependências

```bash
  npm install
  # ou
  yarn install
```

#### Passo 3: Configuração de variáveis de ambiente

Crie um arquivo `.env` na pasta `frontend`:

```bash
  VITE_API_URL=http://localhost:8000  # URL da API do backend
```

#### Passo 4: Inicie o servidor de desenvolvimento

```bash
  npm run dev
  # ou
  yarn dev
```

### 3. Testando a Instalação

#### Backend:

Acesse o Swagger da API em:

```bash
  http://localhost:8000/docs
```

#### Frontend:

Acesse o frontend em:

```bash
  http://localhost:5173
```

### 4. Rodando em Produção

#### Backend:

Execute o FastAPI com um servidor de produção com Uvicorn.

```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend:

Faça o build do React com Vite para produção:

```bash
  npm run build
  # ou
  yarn build
```

Os arquivos gerados estarão na pasta dist, prontos para serem servidos por um servidor web, como NGINX.

Depois de executar o comando `npm run build` ou `yarn build`, o Vite gera uma versão otimizada da sua aplicação na pasta `**dist/**`. Para acessar sua aplicação a partir dessa pasta, você precisa de um servidor web, pois o Vite não oferece um servidor de produção por padrão.

### Opção para Servir a Aplicação Buildada:

#### Usando um Servidor Simples com serve (Rápido e Fácil)

Instale o pacote `serve` (caso ainda não tenha instalado):

```bash
  npm install -g serve
  # ou
  yarn global add serve
```

Execute o comando para servir a pasta `dist`:

```bash
  serve -s dist
```

## Licença

[MIT](https://github.com/marcelobezerrajr/sistema-controle-de-vendas/blob/main/LICENSE)