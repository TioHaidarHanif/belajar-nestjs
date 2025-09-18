# 🚀 NestJS Todo Application

Full-stack Todo application dengan NestJS backend dan React frontend yang terintegrasi dengan authentication, authorization, dan CRUD operations.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Protected routes
- ✅ Admin and user roles
- ✅ Profile management

### 📝 Todo Management
- ✅ Create, read, update, delete todos
- ✅ Mark todos as completed
- ✅ Personal todo lists per user
- ✅ Real-time updates

### 📰 Article System
- ✅ Public article viewing
- ✅ Article creation (authenticated users)
- ✅ Article management
- ✅ Rich content support

### 👥 User Management
- ✅ Admin dashboard
- ✅ User list and management
- ✅ Profile editing
- ✅ Role-based access control

### 🎨 UI/UX
- ✅ Responsive design
- ✅ Modern UI with TailwindCSS
- ✅ Dark/Light mode support
- ✅ Mobile-friendly interface

---

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS 10+
- **Database**: SQLite dengan TypeORM
- **Authentication**: JWT + Passport
- **Validation**: Class Validator
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

### Frontend (React)
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **Routing**: React Router v7
- **Styling**: TailwindCSS
- **State Management**: React Context API

---

## 📁 Project Structure

```
belajar-nestjs/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── user/           # User management
│   │   ├── todo/           # Todo CRUD operations
│   │   ├── article/        # Article management
│   │   ├── common/         # Shared utilities
│   │   │   ├── filters/    # Exception filters
│   │   │   ├── interceptors/ # Request/Response interceptors
│   │   │   ├── middleware/ # Custom middleware
│   │   │   └── pipes/      # Validation pipes
│   │   └── main.ts         # Application entry point
│   ├── test/               # E2E tests
│   ├── db.sqlite          # SQLite database file
│   └── package.json
│
├── frontend/               # React Frontend
│   ├── components/         # Reusable React components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   ├── types.ts           # TypeScript definitions
│   ├── constants.ts       # App constants
│   └── package.json
│
├── README.md              # This file
└── monitoring.md          # Monitoring setup guide
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** atau **yarn**
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/TioHaidarHanif/belajar-nestjs.git
cd belajar-nestjs
```

### 2. Setup Backend & Frontend

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend akan berjalan di: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di: http://localhost:5173

### 4. Open Application

Buka browser dan akses: **http://localhost:5173**

---

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
Database SQLite akan otomatis dibuat saat aplikasi pertama kali dijalankan.

### 3. Environment Variables
Buat file `.env` di folder backend (opsional):
```bash
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d

# Database (SQLite - tidak perlu konfigurasi)
DATABASE_URL=./db.sqlite

# App Configuration
PORT=3000
```

### 4. Available Scripts

```bash
# Development dengan auto-reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
npm run test:cov

# Linting
npm run lint
npm run format
```

### 5. API Documentation
Setelah backend berjalan, akses Swagger UI di:
**http://localhost:3000/api**

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Buat file `.env.local` di folder frontend (opsional):
```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000

# Gemini AI (jika diperlukan)
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### 4. ⚠️ **PENTING: AI Studio Google Troubleshooting**

Jika project ini diambil dari AI Studio Google, pastikan file `frontend/index.html` menggunakan format yang benar:

```html
<!-- ✅ BENAR - Gunakan ini -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NestJS Todo Frontend</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

**Jangan gunakan import map** seperti ini (akan menyebabkan blank page):
```html
<!-- ❌ SALAH - Jangan gunakan dengan Vite -->
<script type="importmap">...</script>
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/profile` | Get user profile | ✅ |
| PUT | `/auth/profile` | Update profile | ✅ |

### Todo Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/todos` | Get user todos | ✅ |
| POST | `/todos` | Create new todo | ✅ |
| PUT | `/todos/:id` | Update todo | ✅ |
| DELETE | `/todos/:id` | Delete todo | ✅ |

### Article Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/articles` | Get all articles | ❌ |
| POST | `/articles` | Create article | ✅ |
| PUT | `/articles/:id` | Update article | ✅ |
| DELETE | `/articles/:id` | Delete article | ✅ |

### User Management (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | ✅ (Admin) |
| PUT | `/users/:id` | Update user | ✅ (Admin) |
| DELETE | `/users/:id` | Delete user | ✅ (Admin) |

---

## 🔐 Authentication

### JWT Token Flow

1. **Register/Login** → Receive JWT token
2. **Store token** in localStorage (frontend)
3. **Include token** in Authorization header untuk protected routes
4. **Auto-refresh** token handling

### Request Headers
```bash
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### User Roles
- **USER**: Default role, dapat mengakses todos dan articles
- **ADMIN**: Full access, dapat mengelola users

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. 🖥️ **Frontend Blank/Kosong**
**Gejala**: Server berjalan tapi browser menampilkan halaman kosong

**Penyebab**: Import map yang salah di `index.html`

**Solusi**: 
```html
<!-- Ganti import map dengan script module -->
<script type="module" src="/index.tsx"></script>
```

#### 2. 🔌 **CORS Error**
**Gejala**: Frontend tidak bisa mengakses backend API

**Solusi**: Backend sudah dikonfigurasi CORS, pastikan URL benar
```typescript
// Backend sudah include:
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
});
```

#### 3. 🔑 **Authentication Issues**
**Gejala**: User tidak bisa login atau token tidak valid

**Solusi**:
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET di backend
- Verify token expiration

#### 4. 📁 **Database Issues**
**Gejala**: Backend error saat akses database

**Solusi**:
- Delete `db.sqlite` file dan restart backend
- Check file permissions
- Verify SQLite installation

#### 5. 🚀 **Port Conflicts**
**Default Ports**:
- Backend: `3000`
- Frontend: `5173` (atau port lain jika sudah digunakan)

**Solusi**: Vite akan otomatis menggunakan port lain jika sudah digunakan

### Debug Commands

```bash
# Check processes on ports
lsof -i :3000
lsof -i :5173

# Kill processes
kill -9 <PID>

# Check logs
cd backend && npm run start:dev
cd frontend && npm run dev
```

---

## 🔄 Development Workflow

### 1. Start Development
```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### 2. Make Changes
- Backend changes → Auto-reload
- Frontend changes → Hot module replacement

### 3. Testing
```bash
# Backend tests
cd backend && npm run test

# E2E tests
cd backend && npm run test:e2e
```

### 4. Build for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

---

## 📱 Available Routes

### Frontend Routes

| Route | Description | Protection |
|-------|-------------|------------|
| `/` | Redirect to articles | Public |
| `/login` | Login page | Public |
| `/register` | Registration page | Public |
| `/articles` | Articles listing | Public |
| `/todos` | Personal todos | Protected |
| `/profile` | User profile | Protected |
| `/admin` | Admin dashboard | Admin Only |

---

## 🎯 Next Steps

### Planned Features
- [ ] Real-time notifications
- [ ] File upload untuk articles
- [ ] Todo categories and tags
- [ ] Advanced search and filtering
- [ ] Export/Import functionality
- [ ] Email notifications
- [ ] OAuth integration (Google, GitHub)

### Performance Improvements
- [ ] API caching
- [ ] Database indexing
- [ ] Image optimization
- [ ] Bundle splitting
- [ ] Service worker untuk offline support

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure responsive design

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Tio Haidar Hanif** - *Initial work* - [@TioHaidarHanif](https://github.com/TioHaidarHanif)

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Fast build tool
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeORM](https://typeorm.io/) - Database ORM
- [Passport.js](http://www.passportjs.org/) - Authentication middleware

---

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan:

1. **Check troubleshooting section** di atas
2. **Review console errors** di browser dan terminal
3. **Verify ports** dan network connectivity
4. **Create an issue** di GitHub repository
5. **Check documentation** untuk NestJS dan React

---

**Happy Coding! 🚀**

*Last updated: September 18, 2025*
