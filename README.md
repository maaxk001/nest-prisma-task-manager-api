# Role-Based Task Management API

A NestJS + Prisma-based backend API that supports:

- **JWT Authentication** (user, manager, admin)
- **Role-Based Permissions** (e.g., only managers can assign tasks; users only update their own tasks)
- **CRUD** for Projects, Tasks, and Comments
- **Pagination & Filtering** by status, priority, assignee
- **Swagger Docs** for easy API exploration

---

## 🧱 Tech Stack

- **NestJS** (Node.js framework)
- **Prisma** (ORM) + PostgreSQL (or MySQL)
- **JWT** (authentication via `@nestjs/jwt`)
- **class-validator** / **class-transformer** (request validation)
- **Swagger** (`@nestjs/swagger`) for API docs

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL or MySQL running locally (or a connection string to a hosted database)
- Git (version control)

### 1. Clone the Repo

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```
