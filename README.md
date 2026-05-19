# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack.  
This project helps teams manage leads, assign roles, track lead status, and monitor sales pipelines efficiently.

---

#  Live Demo

## Frontend
https://lead-management-dashboard-indol.vercel.app/

## Backend
https://lead-management-dashboard-1-psxc.onrender.com

---

#  Features

## Authentication & Authorization
- JWT Authentication
- Access & Refresh Tokens
- Role-based Access Control
- Protected Routes
- Secure Cookie Authentication

---

## Lead Management
- Create Leads
- Update Lead Status
- Delete Leads
- Filter Leads
- Search Leads
- Pagination
- Sort Leads
- Export Leads to CSV

---

## Admin Features
- Assign Roles
- Delete Users
- User Search

---

## UI/UX
- Responsive Dashboard
- Toast Notifications
- Loading States
- Reusable Components
- Clean Architecture
- Mobile Friendly Design

---

#  Tech Stack

## Frontend
- React
- TypeScript
- React Router DOM
- Tailwind CSS
- TanStack Query
- Axios
- Framer Motion
- React Hook Form

---

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Helmet
- Cookie Parser
- CORS

---

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

#  Project Structure

```bash
Lead-Management-Dashboard/
│
├── client/
│   ├── src/
│   │   ├── api-services/
│   │   ├── component/
│   │   ├── contextProvider/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json
│   └── README.md
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   │
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

# ⚙️ Local Setup Guide

## 1️ Clone the Repository

```bash
git clone https://github.com/Rubul-Tanti/Lead-Management-Dashboard.git
```

---

##  Navigate Into the Project

```bash
cd Lead-Management-Dashboard
```

---

#  Frontend Setup

## Navigate to Client Folder

```bash
cd client
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment File

Create a `.env` file inside the `client` folder.

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your google client
```

---

## Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

# 🛠 Backend Setup

## Open New Terminal & Navigate to Server

```bash
cd server
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment File

Create a `.env` file inside the `server` folder.

```env
PORT=8000

DATABASE_URL="mongodb+srv://your_username:your_password@cluster0.mongodb.net/your_database"

NODE_ENV="development"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587

EMAIL="example@gmail.com"
EMAILPASS="your_app_password"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

JWT_ACCESS_TOKEN_EXPIRES="15m"
JWT_REFRESH_TOKEN_EXPIRES="30d"

FRONTEND_URL="http://localhost:5173"
```

---

## Start Backend Server

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:8000
```

---

# 🧪 Test the Application

After starting both frontend and backend:

- Register/Login
- Create Leads
- Update Lead Status
- Search & Filter Leads
- Export Leads to CSV
- Test Admin Features

---

# 🐳 Docker Setup

## Backend Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
```

---

## Build Docker Image

```bash
docker build -t lead-dashboard .
```

---

## Run Docker Container

```bash
docker run -p 8000:8000 lead-dashboard
```

---

# 🚀 Deployment

## Frontend Deployment (Vercel)

Create a `vercel.json` file inside the `client` folder.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Backend Deployment (Render)

### Render Configuration

| Setting | Value |
|---|---|
| Root Directory | server |
| Dockerfile Path | Dockerfile |
| Docker Build Context Directory | . |

---

# 🔐 API Features

- RESTful API Architecture
- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Error Handling Middleware
- Pagination APIs
- Filtering & Search APIs
- Secure Cookie Handling

---


# 👨‍💻 Author

## Rubul Tanti

- GitHub: https://github.com/Rubul-Tanti

---

# 📄 License

This project is licensed under the MIT License.
