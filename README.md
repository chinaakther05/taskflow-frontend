# TaskFlow — Team Task Management Platform

TaskFlow is a team task management platform designed to help teams organize projects, manage tasks, collaborate efficiently, and track their work in one place.

## Overview

TaskFlow provides a centralized workspace where team members can manage projects, assign tasks, share comments, and keep track of project progress. It is built with a modern full-stack architecture using Next.js, Express.js, TypeScript, Prisma, and PostgreSQL.

## Features

* **Authentication** — User login and registration.
* **Organization Management** — Organize team members within a workspace.
* **Role-Based Access** — Support different organization member roles.
* **Project Management** — Organize work into projects.
* **Task Management** — Create and manage tasks.
* **Comments** — Support task-related collaboration.
* **Time Tracking** — Track time spent on tasks.
* **Attachments** — Support task-related files.
* **Activity Tracking** — Keep track of workspace activities.
* **Notifications** — Support task and workspace notifications.
* **Subscription and Payments** — Backend modules for subscription and payment functionality.
* **Responsive UI** — A user interface designed for different screen sizes.

> Note: Features that depend on external services or deployment configuration may require additional setup.

## Tech Stack

### Frontend

* Next.js
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

## Project Structure

```text
TaskFlow/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
│
└── README.md
```

Adjust the folder names above to match your actual repository structure.

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* pnpm or npm
* PostgreSQL
* Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace the placeholders with your actual GitHub repository URL and folder name.

### 2. Configure the Backend

Navigate to your backend directory and install dependencies:

```bash
cd backend
pnpm install
```

Create a `.env` file based on your backend configuration.

Example:

```env
PORT=5000
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
JWT_SECRET="YOUR_JWT_SECRET"
```

Add any other environment variables required by your backend. Never commit real passwords, tokens, or production secrets.

### 3. Set Up the Database

Run the Prisma commands appropriate for your project:

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

For a development database without existing migrations, follow your project's Prisma migration setup instead.

### 4. Start the Backend

Use the development script defined in your backend `package.json`. For example:

```bash
pnpm dev
```

The backend may run at:

```text
http://localhost:5000
```

### 5. Configure the Frontend

Open a separate terminal:

```bash
cd frontend
pnpm install
```

Create the frontend `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Update the API URL if your backend uses a different address.

### 6. Start the Frontend

```bash
pnpm dev
```

Open the local URL shown in your terminal, usually:

```text
http://localhost:3000
```

## Environment Variables

Configure the environment variables required by your application.

| Variable              | Purpose                      |
| --------------------- | ---------------------------- |
| `PORT`                | Backend server port          |
| `DATABASE_URL`        | PostgreSQL connection string |
| `JWT_SECRET`          | Secret used for JWT signing  |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL        |

Your actual project may require additional variables for refresh tokens, Google OAuth, payments, email services, or file storage.

## API Modules

The backend is organized around the following API modules:

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

These paths describe the configured API modules; individual endpoints and methods depend on the backend implementation.

## Security

* Store secrets in environment variables.
* Do not commit `.env` or `.env.local` files.
* Use appropriate authentication and authorization checks.
* Protect sensitive organization and project data.
* Configure production CORS and cookie settings before deployment.

## Future Improvements

* Expand automated testing.
* Improve reporting and analytics.
* Enhance collaboration features.
* Improve accessibility and user experience.

## Author

**China Akther**

Full-Stack Web Developer

* GitHub: [chinaakther05](https://github.com/chinaakther05)

## License

Choose and add a license before distributing this project for reuse.
