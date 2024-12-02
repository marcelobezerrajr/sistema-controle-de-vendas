
# Sistema Controle de Vendas 💻

Este sistema oferece um completo gerenciamento de operações comerciais, permitindo o controle eficiente de vendas e seus diversos elementos por meio de funcionalidades de CRUD (Create, Read, Update, Delete). Inclui o cadastro e a gestão de Usuários, Clientes, Comissões, Custos, Fornecedores, Parcelas, Itens de Venda, Produtos, Vendas, Vendedores e o relacionamento entre Venda e Vendedor. Ideal para empresas que buscam uma solução integrada para otimizar processos e acompanhar todas as etapas do ciclo de vendas.

## Funcionalidades

- Login
- Requisição de Senha
- Reset de Senha
- Troca de Senha
- CRUD (Usuário, Cliente, Comissão, Custo, Fornecedor, Parcela, Item Venda, Produto, Venda, Vendedor e Venda Vendedor)
## Documentação da API - CRUD

As chamadas para a API seguem um padrão consistente para todas as entidades do sistema (Usuários, Vendedores, Produtos, etc.). Para utilizar outros recursos, substitua o caminho e o identificador da entidade conforme necessário. Abaixo estão exemplos utilizando a entidade **Usuários**.

### Listar todos os Usuários
Retorna uma lista de todos os usuários cadastrados.

```http
  GET /user/list
```

| Parâmetro   | Tipo       | Descrição                           | 
| :---------- | :--------- | :---------------------------------- |
| `SECRET_KEY` | `string` | **Obrigatório**. 	Chave de autenticação da API. |

### Obter Usuário por ID
Retorna os detalhes de um usuário específico.

```http
  GET /user/view/${id_user}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id_user` | `int` | **Obrigatório**. ID do usuário que deseja consultar. |
| `SECRET_KEY` | `string` | **Obrigatório**. 	Chave de autenticação da API. |

### Criar um Novo Usuário
Adiciona um novo usuário ao sistema.

```http
  POST /user/create
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `username` | `string` | **Obrigatório**. 	Nome do usuário. |
| `email` | `string` | **Obrigatório**. E-mail do usuário. |
| `hashed_password` | `string` | **Obrigatório**. Senha do usuário. |
| `permission` | `string` | **Obrigatório**. Permissão do usuário. |
| `SECRET_KEY` | `string` | **Obrigatório**. Chave de autenticação da API. |

### Atualiza um Usuário
Atualiza as informações de um usuário existente.

```http
  PUT /user/update
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id_user` | `int` | **Obrigatório**. ID do usuário que será atualizado. |
| `username` | `string` | **Obrigatório**. 	Nome do usuário. |
| `email` | `string` | **Obrigatório**. E-mail do usuário. |
| `hashed_password` | `string` | **Obrigatório**. Senha do usuário. |
| `permission` | `string` | **Obrigatório**. Permissão do usuário. |
| `SECRET_KEY` | `string` | **Obrigatório**. Chave de autenticação da API. |

### Deletar um Usuário
Remove um usuário do sistema.

```http
  DELETE /user/delete/${id_user}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id_user` | `int` | **Obrigatório**. ID do usuário que será deletado. |
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
## Stacks utilizadas

**Front-end:** React

**Back-end:** FastApi

**SQL:** Sqlite

**Autenticação e Autorização:** JWT e OAuth2PasswordBearer

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
