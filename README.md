# TaskFlow — Team Task Management Platform

A full-stack team task management platform designed to help teams organize projects, manage tasks, collaborate, and track work efficiently.

## 🔗 Live Demo & Repositories

* **Live Frontend:** 🔴 REPLACE HERE — your deployed frontend URL
* **Backend API:** 🔴 REPLACE HERE — your deployed backend URL
* **Frontend GitHub Repository:** 🔴 [REPLACE HERE — your frontend repository URL](https://github.com/chinaakther05/taskflow-frontend)
* **Backend GitHub Repository:** 🔴 [REPLACE HERE — your backend repository URL](https://github.com/chinaakther05/taskflow-backend)

## 📌 Overview

TaskFlow is a workspace-based project and task management application built with Next.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL.

It provides tools to organize team work, manage projects and tasks, and support collaboration within a workspace.

## ✨ Features

* **Authentication:** User registration and login.
* **Organization Management:** Manage workspaces and team members.
* **Role-Based Access:** Support organization member roles.
* **Project Management:** Organize tasks into projects.
* **Task Management:** Create and manage tasks.
* **Comments:** Collaborate through task-related comments.
* **Time Tracking:** Track time spent on tasks.
* **Attachments:** Support task-related files.
* **Activity Tracking:** Track workspace activities.
* **Notifications:** Support user notifications.
* **Subscriptions & Payments:** Subscription and payment modules.
* **Responsive UI:** Layout designed for desktop and mobile devices.

*Note: Feature availability may depend on the current implementation and external service configuration.*

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* TanStack Query
* ofetch
* Lucide Icons

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication

## 📁 Project Repositories

The frontend and backend are maintained in separate repositories.

| Application | Repository                            |
| ----------- | ------------------------------------- |
| Frontend    | 🔴 https://github.com/chinaakther05/taskflow-frontend |
| Backend     | 🔴 https://github.com/chinaakther05/taskflow-backend  |

## 🚀 Getting Started

### Prerequisites

* Node.js
* pnpm or npm
* PostgreSQL
* Git

### 1. Set Up the Backend

Clone your backend repository:

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
cd YOUR_BACKEND_FOLDER_NAME
pnpm install
```

Create a `.env` file in the backend root directory and configure the environment variables required by your application.

Example:

```env
PORT=5000
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
JWT_SECRET="YOUR_JWT_SECRET"
```

Replace the example values with your own configuration. Never commit real credentials or secrets.

### 2. Configure the Database

Generate the Prisma client:

```bash
pnpm prisma generate
```

If your project has committed Prisma migrations, apply them to your development database as appropriate:

```bash
pnpm prisma migrate deploy
```

### 3. Run the Backend

Use the development script defined in the backend `package.json`:

```bash
pnpm dev
```

The local backend URL may be:

`http://localhost:5000`

### 4. Set Up the Frontend

Open another terminal and clone the frontend repository:

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
cd YOUR_FRONTEND_FOLDER_NAME
pnpm install
```

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use the actual backend URL for your environment.

### 5. Run the Frontend

```bash
pnpm dev
```

Open:

`http://localhost:3000`

## ⚙️ Environment Variables

| Variable              | Purpose                      |
| --------------------- | ---------------------------- |
| `PORT`                | Backend server port          |
| `DATABASE_URL`        | PostgreSQL connection string |
| `JWT_SECRET`          | JWT signing secret           |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL        |

Additional environment variables may be required depending on your authentication, OAuth, payment, and file-storage configuration.

## 🔌 API Modules

The backend includes modules for:

* Authentication — `/api/auth`
* Organizations — `/api/organizations`
* Organization Members — `/api/organization-members`
* Projects — `/api/projects`
* Tasks — `/api/tasks`
* Comments — `/api/comments`
* Time Logs — `/api/time-logs`
* Attachments — `/api/attachments`
* Activities — `/api/activities`
* Notifications — `/api/notifications`
* Subscriptions — `/api/subscriptions`
* Payments — `/api/payments`

Refer to the backend implementation for the available endpoints, HTTP methods, and request formats.

## 🔐 Security

* Keep credentials in environment variables.
* Never commit `.env` or `.env.local` files.
* Validate requests on the backend.
* Enforce authentication and authorization on protected endpoints.
* Configure production CORS and cookie settings securely.

## 👨‍💻 Author

**China Akther**

Full-Stack Web Developer

* GitHub: https://github.com/chinaakther05

## 📄 License

A license can be added if you intend to distribute this project for reuse.
