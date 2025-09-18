# Developer Guidelines - NestJS Todo Application

## 📋 Daftar Isi
1. [Overview Aplikasi](#overview-aplikasi)
2. [Arsitektur & Teknologi](#arsitektur--teknologi)
3. [Struktur Folder](#struktur-folder)
4. [Alur Request-Response](#alur-request-response)
5. [Fitur & Endpoints](#fitur--endpoints)
6. [Setup & Development](#setup--development)
7. [Monitoring & Debugging](#monitoring--debugging)
8. [Maintenance Guide](#maintenance-guide)
9. [Best Practices](#best-practices)
10. [Roadmap & Recommendations](#roadmap--recommendations)

---

## 🔍 Overview Aplikasi

**Todo Application** adalah aplikasi backend RESTful API yang dibangun menggunakan NestJS framework dengan fitur-fitur modern seperti:

- **Authentication & Authorization** dengan JWT
- **CRUD Operations** untuk Todo dan Article management
- **User Management** dengan role-based access
- **Monitoring** dengan Prometheus metrics
- **Database** menggunakan SQLite dengan TypeORM
- **Security Features** seperti password hashing dengan bcrypt

### Core Purpose
Aplikasi ini dirancang sebagai learning project untuk memahami konsep-konsep:
- Modern backend development dengan NestJS
- Authentication & Authorization patterns
- Database design & ORM usage
- API monitoring & observability
- Clean code architecture

---

## 🏗️ Arsitektur & Teknologi

### Tech Stack
```
Backend Framework    : NestJS (v11.0.1)
Database            : SQLite
ORM                 : TypeORM (v0.3.26)
Authentication      : JWT + Passport
Password Hashing    : bcrypt
Validation          : class-validator + class-transformer
Monitoring          : Prometheus + prom-client
Testing             : Jest
Development         : TypeScript
```

### Architectural Pattern
- **Modular Architecture**: Setiap fitur diorganisir dalam module terpisah
- **Dependency Injection**: Menggunakan NestJS DI container
- **Repository Pattern**: Data access melalui TypeORM repositories
- **Middleware/Interceptor Pattern**: Cross-cutting concerns
- **DTO Pattern**: Input validation dan data transformation

### Database Design
```sql
Users (id, username, email, password, role, currentHashedRefreshToken)
  ↓ (One-to-Many)
Todos (id, title, description, isDone, user_id)

Users (id, username, email, password, role)
  ↓ (One-to-Many)  
Articles (id, title, content, createdAt, updatedAt, user_id)
```

---

## 📁 Struktur Folder

```
src/
├── app.module.ts              # Root module, mengonfigurasi semua dependencies
├── main.ts                    # Entry point aplikasi
├── 
├── auth/                      # 🔐 Authentication & Authorization
│   ├── auth.controller.ts     # Login/Register endpoints
│   ├── auth.service.ts        # Business logic untuk auth
│   ├── auth.module.ts         # Auth module configuration
│   ├── jwt.strategy.ts        # JWT validation strategy
│   └── dto/                   # Data Transfer Objects
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── user/                      # 👥 User Management
│   ├── user.controller.ts     # User CRUD endpoints
│   ├── user.service.ts        # User business logic
│   ├── user.entity.ts         # User database model
│   └── user.module.ts
│
├── todo/                      # ✅ Todo Management
│   ├── todo.controller.ts     # Todo CRUD endpoints
│   ├── todo.service.ts        # Todo business logic
│   ├── todo.entity.ts         # Todo database model
│   └── todo.module.ts
│
├── article/                   # 📝 Article Management
│   ├── article.controller.ts  # Article CRUD endpoints
│   ├── article.service.ts     # Article business logic
│   ├── article.entity.ts      # Article database model
│   └── article.module.ts
│
└── common/                    # 🔧 Shared Components
    ├── filters/               # Exception filters
    ├── interceptors/          # Request/Response interceptors
    ├── middleware/            # Custom middleware
    ├── pipes/                 # Validation pipes
    └── request-context/       # Request context utilities
```

### Penjelasan Struktur:

**Modules**: Setiap fitur memiliki module terpisah yang mengenkapsulasi controller, service, dan entity.

**Common**: Berisi komponen yang bisa digunakan di berbagai module (middleware, interceptors, filters, pipes).

**DTOs**: Data Transfer Objects untuk validasi input dan type safety.

**Entities**: Database models yang merepresentasikan struktur tabel.

---

## 🔄 Alur Request-Response

### 1. Request Flow
```
Client Request
    ↓
Middleware (Logger - hanya untuk Article routes)
    ↓  
Guards (JWT Authentication)
    ↓
Interceptors (Logging, Transform - hanya untuk Article)
    ↓
Pipes (Validation, Transformation)
    ↓
Controller (Route Handler)
    ↓
Service (Business Logic)
    ↓
Repository/Entity (Database Operations)
    ↓
Response
```

### 2. Authentication Flow
```
POST /auth/register
    ↓
Password Hashing (bcrypt)
    ↓
Save User to Database
    ↓
Return User Info

POST /auth/login
    ↓
Validate Credentials
    ↓
Generate JWT Token
    ↓
Return Access Token

Protected Endpoints
    ↓
JWT Strategy Validation
    ↓
Extract User from Token
    ↓
Proceed to Handler
```

### 3. Error Handling Flow
```
Exception Occurs
    ↓
HTTP Exception Filter
    ↓
Format Error Response
    ↓
Log Error Details
    ↓
Return Structured Error
```

---

## 🚀 Fitur & Endpoints

### Authentication Endpoints
```http
POST /auth/register     # User registration
POST /auth/login        # User login
POST /auth/refresh      # Refresh JWT token
```

### User Management
```http
GET    /users           # Get all users (Admin only)
GET    /users/:id       # Get user by ID
POST   /users           # Create new user
PUT    /users/:id       # Update user
DELETE /users/:id       # Delete user
```

### Todo Management
```http
GET    /todos           # Get user's todos
GET    /todos/:id       # Get specific todo
POST   /todos           # Create new todo
PUT    /todos/:id       # Update todo
DELETE /todos/:id       # Delete todo
PATCH  /todos/:id/done  # Mark todo as done
```

### Article Management (dengan Advanced Features)
```http
GET    /articles        # Get all articles
GET    /articles/:id    # Get specific article
POST   /articles        # Create new article
PUT    /articles/:id    # Update article
DELETE /articles/:id    # Delete article
```

**Special Features pada Article Module:**
- **Logging Interceptor**: Mencatat semua request/response
- **Transform Interceptor**: Mengubah format response
- **HTTP Exception Filter**: Custom error handling
- **Request Context**: Melacak request ID dan metadata

### Monitoring & Metrics
```http
GET /metrics           # Prometheus metrics endpoint
```

---

## ⚙️ Setup & Development

### Prerequisites
```bash
Node.js >= 18.x
npm atau yarn
SQLite (included)
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd belajar-nestjs

# Install dependencies
npm install

# Start development server
npm run start:dev

# Run tests
npm run test
npm run test:e2e

# Build for production
npm run build
npm run start:prod
```

### Environment Variables
Saat ini aplikasi menggunakan PORT default 3000. Untuk production, perlu menambahkan:
```env
PORT=3000
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=1h
DATABASE_URL=./db.sqlite
```

### Database Setup
Database SQLite akan dibuat otomatis saat aplikasi pertama kali dijalankan dengan `synchronize: true` di TypeORM config.

⚠️ **Warning**: `synchronize: true` hanya untuk development. Untuk production, gunakan migrations.

---

## 📊 Monitoring & Debugging

### Prometheus Metrics
Aplikasi mengekspos metrics di `/metrics` endpoint:
- HTTP request duration
- Request count by status code
- Active connections
- Custom business metrics

### Logging System
- **Console Logging**: Untuk development
- **Request Logging**: Via LoggingInterceptor di article module
- **Logger Middleware**: Khusus untuk article routes
- **Error Logging**: Via HTTP Exception Filter di article module

### Debugging Tools
```bash
# Debug mode
npm run start:debug

# Watch mode untuk development
npm run start:dev

# Test coverage
npm run test:cov

# E2E testing
npm run test:e2e
```

### Common Debugging Commands
```bash
# Check database content
sqlite3 db.sqlite
.tables
SELECT * FROM user;
SELECT * FROM todo;
SELECT * FROM article;

# Check running processes
ps aux | grep node

# Check port usage
lsof -i :3000
```

---

## 🔧 Maintenance Guide

### Regular Tasks

#### 1. Security Updates
```bash
# Check for security vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update
```

#### 2. Database Maintenance
```bash
# Backup database
cp db.sqlite db.sqlite.backup.$(date +%Y%m%d)

# Check database integrity
sqlite3 db.sqlite "PRAGMA integrity_check;"

# Vacuum database (optimize storage)
sqlite3 db.sqlite "VACUUM;"
```

#### 3. Log Management
```bash
# Clear old logs (jika menggunakan file logging)
find ./logs -name "*.log" -mtime +30 -delete

# Monitor disk usage
df -h
du -sh ./
```

#### 4. Performance Monitoring
- Monitor `/metrics` endpoint untuk performance insights
- Check response times pada endpoints yang sering digunakan
- Monitor memory usage dengan `htop` atau `ps`

### Troubleshooting Common Issues

#### Database Issues
```bash
# Database locked
# Solution: Restart aplikasi atau check for zombie processes

# Migration errors
# Solution: Drop database dan restart (development only)
rm db.sqlite
npm run start:dev
```

#### Authentication Issues
```bash
# JWT token expired
# Solution: Check JWT_EXPIRATION setting

# Password not hashing
# Solution: Verify bcrypt installation dan salt rounds
```

#### Performance Issues
```bash
# High memory usage
# Check for memory leaks in services

# Slow database queries
# Add proper indexes (melalui TypeORM migrations)

# High CPU usage
# Profile dengan clinic.js atau 0x
```

---

## ✅ Best Practices

### Code Quality
1. **Type Safety**: Selalu gunakan TypeScript types yang strict
2. **Validation**: Gunakan class-validator untuk semua DTOs
3. **Error Handling**: Implement proper exception handling
4. **Testing**: Maintain test coverage minimal 80%
5. **Documentation**: Update comments dan documentation

### Security
1. **Password Security**: 
   - Password di-hash dengan bcrypt
   - Menggunakan salt rounds 10
2. **JWT Security**:
   - JWT untuk authentication
   - Validate JWT pada protected routes
3. **Input Validation**:
   - Validasi input dengan DTOs

### Performance
1. **Database**:
   - Eager loading sudah digunakan pada relations
   - Implement proper indexing untuk production
   - Avoid N+1 queries
2. **Performance**:
   - Gunakan eager loading dengan bijak (sudah digunakan)
   - Implement proper indexing
   - Avoid N+1 queries
3. **Monitoring**:
   - Setup proper logging levels
   - Monitor application metrics (Prometheus sudah terintegrasi)
   - Implement health checks

### Development Workflow
1. **Branching Strategy**: Gunakan Git Flow atau GitHub Flow
2. **Code Review**: Mandatory untuk semua changes
3. **Testing**: Write tests sebelum implement features
4. **Documentation**: Update documentation seiring development

---

## 🛣️ Roadmap & Recommendations

### Short Term (1-2 bulan)
1. **Database Migration System**
   - Implement proper migrations untuk production

2. **Environment Configuration**
   - Add proper environment management

3. **Rate Limiting**
   - Implement rate limiting untuk API protection

4. **API Documentation**
   - Add Swagger/OpenAPI documentation

### Medium Term (3-6 bulan)
1. **Caching Layer**
   - Implement Redis untuk caching
   - Add cache invalidation strategies

2. **File Upload**
   - Support untuk file uploads
   - Integration dengan cloud storage

3. **Real-time Features**
   - WebSocket support untuk real-time updates
   - Implement Socket.IO

4. **Advanced Security Features**
   - Implement RBAC (Role-Based Access Control)
   - Add API key authentication (sebagian sudah ada)
   - Security headers dan CORS configuration

### Long Term (6+ bulan)
1. **Microservices Architecture**
   - Break down monolith ke microservices
   - Implement message queues (RabbitMQ/Redis)

2. **Advanced Monitoring**
   - Distributed tracing dengan Jaeger
   - Error tracking dengan Sentry
   - APM dengan New Relic/DataDog

3. **DevOps Integration**
   - Docker containerization
   - CI/CD pipeline setup
   - Kubernetes deployment

4. **Advanced Features**
   - Search functionality dengan Elasticsearch
   - Background job processing
   - Multi-tenant architecture

### Recommended Improvements

#### Immediate Fixes yang Bisa Diterapkan
```typescript
// 1. Add proper error handling
try {
  // business logic
} catch (error) {
  this.logger.error('Error in method', error.stack);
  throw new InternalServerErrorException('Something went wrong');
}

// 2. Add input sanitization
@IsString()
@IsNotEmpty()
@Transform(({ value }) => value?.trim())
title: string;

// 3. Implement proper logging (sudah ada di Article module)
import { Logger } from '@nestjs/common';
private readonly logger = new Logger(ServiceName.name);
```

#### Architecture Improvements
1. **Implement CQRS Pattern** untuk complex business logic
2. **Add Event Sourcing** untuk audit trails
3. **Implement Repository Pattern** untuk better data access abstraction
4. **Add Domain Layer** untuk better separation of concerns

#### Performance Optimizations
1. **Database Indexing**:
   ```typescript
   @Index(['user', 'createdAt'])
   @Entity()
   export class Todo {
     // ...
   }
   ```

2. **Query Optimization**:
   ```typescript
   // Use select untuk avoid loading unnecessary data
   const users = await this.userRepository.find({
     select: ['id', 'username', 'email'],
     where: { isActive: true }
   });
   ```

3. **Implement Pagination**:
   ```typescript
   async findAll(page: number = 1, limit: number = 10) {
     return await this.repository.findAndCount({
       skip: (page - 1) * limit,
       take: limit,
     });
   }
   ```

---

## 📞 Support & Contact

Untuk pertanyaan atau issue:
1. Check documentation ini terlebih dahulu
2. Search di existing issues/tickets
3. Create new issue dengan template yang proper
4. Contact team lead untuk critical issues

**Happy Coding! 🚀**

---

*Last updated: September 2025*
*Version: 1.0*