# DevBills Backend (API)

## 🚀 Visão Geral do Projeto

Esta é a API RESTful do aplicativo de gestão financeira pessoal DevBills. Desenvolvida com Node.js, Fastify e Prisma ORM, ela é responsável por gerenciar a lógica de negócios, a autenticação de usuários via Firebase Admin SDK e a persistência de dados no MongoDB Atlas.

## ✨ Funcionalidades Principais da API

- **Autenticação:** Validação de tokens JWT do Firebase para proteger rotas.
- **Gestão de Categorias:** Criação e listagem de categorias de transações (receita/despesa).
- **Gestão de Transações:** CRUD (Criar, Ler, Atualizar, Deletar) de transações financeiras.
- **Resumos Financeiros:** Cálculo de saldo, total de receitas e despesas por período.
- **Histórico Mensal:** Dados para gráficos de evolução financeira.
- **Validação de Dados:** Utilização do Zod para validação robusta dos payloads das requisições.

## 🛠️ Tecnologias Utilizadas

- **Node.js:** Ambiente de execução JavaScript.
- **Fastify:** Framework web rápido e de baixo overhead.
- **TypeScript:** Para tipagem estática e maior segurança de código.
- **Prisma ORM:** ORM moderno para interagir com o banco de dados.
- **MongoDB Atlas:** Banco de dados NoSQL na nuvem.
- **Firebase Admin SDK:** Para verificar tokens de autenticação do Firebase.
- **Zod:** Biblioteca para validação de schemas de dados.
- **JWT (JSON Web Tokens):** Para autenticação (Firebase Admin SDK).
- **Insomnia / Postman:** Coleção de requisições para testes da API.

## ⚙️ Como Rodar o Projeto Localmente

1.  **Clone o repositório do backend:**
    ```bash
    git clone https://github.com/Marcelo336/devbills-backend.git
    cd devbills-backend
    ```
2.  **Instale as dependências:**
    ```bash
    yarn install # ou npm install
    ```
3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto `devbills-backend` e adicione as seguintes variáveis:
    ```
    DATABASE_URL=mongodb+srv://tiagoaugusto3305_db_user:sWbB2c3XO6yUdgQy@devbills.ldz90wm.mongodb.net/DevBills?appName=DevBills
    FIREBASE_PRIVATE_KEY_ID="seu_private_key_id_do_firebase_admin"
    FIREBASE_PRIVATE_KEY="sua_private_key_do_firebase_admin"
    FIREBASE_PROJECT_ID="seu_project_id_do_firebase_admin"
    FIREBASE_CLIENT_EMAIL="seu_client_email_do_firebase_admin"
    FIREBASE_CLIENT_ID="seu_client_id_do_firebase_admin"
    FIREBASE_AUTH_URI="seu_auth_uri_do_firebase_admin"
    FIREBASE_TOKEN_URI="seu_token_uri_do_firebase_admin"
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL="seu_auth_provider_x509_cert_url_do_firebase_admin"
    FIREBASE_CLIENT_X509_CERT_URL="seu_client_x509_cert_url_do_firebase_admin"
    ```
    *(Substitua pelos seus dados reais do MongoDB Atlas e do Firebase Admin SDK. O arquivo de credenciais do Firebase Admin SDK é obtido no Console do Firebase > Configurações do Projeto > Contas de Serviço > Gerar nova chave privada.)*
4.  **Gere o cliente Prisma:**
    ```bash
    npx prisma generate
    ```
5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    yarn dev # ou npm run dev
    ```
    O servidor estará rodando em `http://localhost:3001`.

## 🧪 Testando a API

Você pode testar os endpoints da API usando a coleção do Insomnia fornecida neste repositório: `docs/insomnia/devbills-api-collection.yaml`.

## 🤝 Contribuição

Contribuições são bem-vindas! Se você tiver sugestões ou encontrar bugs, por favor, abra uma issue ou envie um pull request.

## 📄 Licença

Este projeto está licenciado sob a licença MIT.