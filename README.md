# Gerenciador de Tarefas

O **Gerenciador de Tarefas** é uma aplicação web que permite gerenciar tarefas pessoais com funcionalidades de cadastro, listagem, edição e exclusão de tarefas. O projeto possui **frontend** em React/TypeScript (utilizando Vite) e **backend** em Node.js/TypeScript (utilizando Express e Sequelize). Ele faz parte do meu portfólio pessoal e foi implantado em produção com **Railway** (backend) e **[Vercel](https://gerenciador-de-tarefas-lovat.vercel.app/)** (frontend).

---

## Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Arquitetura e Estrutura de Pastas](#arquitetura-e-estrutura-de-pastas)
5. [Endpoints Principais do Backend](#endpoints-principais-do-backend)
6. [Sobre o Autor](#sobre-o-autor)
7. [Observações finais](#observações-finais)


---

## Visão Geral do Projeto

O **Gerenciador de Tarefas** permite aos usuários criarem e gerenciarem suas tarefas em diferentes categorias. Cada tarefa contém:
- Título
- Descrição
- Data de entrega
- Categoria
- Status (pendente ou concluído)

O aplicativo oferece recursos de login e registro de novos usuários, para que cada um possa visualizar e manipular apenas as suas próprias tarefas.

- **Backend:** Desenvolvido em Node.js com TypeScript, utilizando Express como framework web e Sequelize para modelagem de dados (banco de dados MySQL). Hospedado no Railway.
- **Frontend:** Desenvolvido em React com TypeScript, utilizando Vite para o build e o desenvolvimento local, e Ant Design como biblioteca de componentes de interface. Hospedado no **[Vercel](https://gerenciador-de-tarefas-lovat.vercel.app/)**.

---

## Funcionalidades

1. **Cadastro e Login de Usuários**  
   - Registro de novos usuários (nome, email, senha).
   - Login com email e senha, gerando um token JWT que é utilizado nas requisições subsequentes.

2. **Gerenciamento de Tarefas**  
   - **Criação** de tarefas com título, descrição, data de entrega e categoria.
   - **Listagem** de tarefas filtradas por busca textual, categoria e status (pendente ou concluído).
   - **Edição** e **exclusão** de tarefas.
   - **Marcar tarefa como concluída**.

3. **Perfil do Usuário**  
   - Visualização e edição do perfil (nome, email).
   - Alteração de senha (mediante validação do token JWT).

4. **Filtros e Ordenação**  
   - Filtro por título (busca textual).
   - Filtro por categoria.
   - Filtro por status (pendente ou concluído).
   - Ordenação automática das tarefas pendentes pela data de entrega mais próxima.

---

## Tecnologias Utilizadas

### **Backend**:
- **Node.js** e **TypeScript**  
- **Express** — framework para criação de APIs REST
- **Sequelize** — ORM para interação com banco de dados
- **MySQL** — banco de dados relacional
- **JWT (jsonwebtoken)** — para autenticação e autorização
- **bcrypt** — para hashing de senhas
- **dotenv** — para manusear variáveis de ambiente

### **Frontend**:
- **React** com **TypeScript**
- **Vite** — build tool
- **React Router** — para navegação entre rotas
- **Ant Design** — biblioteca de componentes UI
- **Axios** — para chamadas HTTP
- **dayjs** — para manipulação de datas

---

## Arquitetura e Estrutura de Pastas

A estrutura principal do projeto é dividida em duas pastas: **`frontend`** e **`backend`**. Abaixo, uma visão geral simplificada:

```
Gerenciador-de-Tarefas/
  ├── backend/
  │   ├── src/
  │   │   ├── controllers/
  │   │   │   ├── authController.ts
  │   │   │   └── taskController.ts
  │   │   ├── models/
  │   │   │   ├── user.ts
  │   │   │   ├── task.ts
  │   │   │   └── associations.ts
  │   │   ├── routes/
  │   │   │   ├── auth.ts
  │   │   │   └── task.ts
  │   │   ├── database.ts
  │   │   └── server.ts
  └── frontend/
      ├── src/
      │   ├── components/
      │   │   ├── AddTaskModal.tsx
      │   │   ├── EditTaskModal.tsx
      │   │   ├── Filters.tsx
      │   │   ├── Header.tsx
      │   │   ├── PrivateRoute.tsx
      │   │   ├── ProfileModal.tsx
      │   │   ├── TaskDetails.tsx
      │   │   └── TaskTable.tsx
      │   ├── contexts/
      │   │   └── TasksCOntext.tsx
      │   ├── pages/
      │   │   ├── DashboardPage.tsx
      │   │   └── LoginPage.tsx
      │   ├── services/
      │   │   ├── api.ts
      │   │   ├── profileService.ts
      │   │   └── taskService.ts
      │   ├── App.tsx
      │   └── main.tsx

```
---
## Endpoints Principais do Backend

Os endpoints estão disponíveis sob o prefixo `/api`. Alguns dos principais são:


### Autenticação:

- `POST /api/register` Registra um novo usuário.
- `POST /api/login` Faz login e retorna um token JWT.

### Perfil:

- `GET /api/profile` Retorna dados do perfil do usuário.
- `PUT /api/profile` Atualiza dados do perfil.
- `PUT /api/password` Altera a senha.

### Tarefas:

- `GET /api/tasks` Lista todas as tarefas do usuário.
- `POST /api/tasks` Cria uma nova tarefa.
- `PUT /api/tasks/:id` Atualiza uma tarefa existente.
- `DELETE /api/tasks/:id` Exclui uma tarefa existente.
---
## Sobre o Autor

| [LinkedIn](https://www.linkedin.com/in/joaolaia/) | [GitHub](https://github.com/joaolaia/) |
|---|---|

Sou um desenvolvedor web em busca da minha primeira colocação no mercado e este é um projeto autoral, demonstrando minhas habilidades em **React**, **Node.js**, **TypeScript**, **MySQL** e **Sequelize**. Fique à vontade para explorar e entrar em contato comigo!

---

## Observações Finais

- O projeto foi implantado em produção no **Railway** (para o backend) e no **[Vercel](https://gerenciador-de-tarefas-lovat.vercel.app/)** (para o frontend).
- Confira o projeto na íntegra clicando **[aqui](https://gerenciador-de-tarefas-lovat.vercel.app/)**. 


Agradeço por conferir o **Gerenciador de Tarefas**! Se este projeto lhe foi útil ou interessante, não deixe de dar uma estrela ⭐ no repositório.


