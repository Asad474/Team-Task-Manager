# Team Task Manager

A professional, full-stack task management application designed for high-performance team collaboration. Built with modern technologies, it features a robust backend, a sleek interactive frontend, and a complete DevOps pipeline.

## 🚀 Features

- **Project Management**: Create, update, and manage multiple team projects.
- **Task Lifecycle**: Move tasks through `To Do`, `In Progress`, `Review`, and `Done` states.
- **Role-Based Access**: Specialized workflows for Admins and Team Members.
- **Task Assignment**: Delegate tasks to specific project members.
- **Real-time Feedback**: Instant UI updates with a smooth, premium aesthetic.
- **DevOps Ready**: Dockerized setup for consistent development and production environments.
- **Quality Assured**: Pre-commit linting, formatting, and build checks via Husky.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS 4 + ShadcnUI
- **State Management**: Zustand
- **Routing**: React Router 7

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod
- **Security**: JWT + BcryptJS

---

## 🏗 Setup & Installation

### Option 1: Docker (Recommended)
The easiest way to get started is using Docker Compose.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Asad474/Team-Task-Manager.git
   cd Team-Task-Manager
   ```

2. **Configure Environment**:
   Create a `.env` file in the root (see `.env.example`).

3. **Start the stack**:
   ```bash
   docker-compose up --build
   ```
   Access the app at `http://localhost`.

### Option 2: Manual Setup
If you prefer running without Docker, follow the setup guides for each component:

- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)

---

## 🧹 Code Quality

This project enforces strict code quality standards:
- **Linting**: `npm run lint`
- **Formatting**: `npm run lint:fix`
- **Commits**: Follows [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `chore:`) via Husky.

---

## 📄 License
This project is licensed under the ISC License.
