# Backend - Data Analyst Portfolio API

Express.js REST API for managing data analysis projects and file uploads.

## 🚀 Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Project Management**: CRUD operations for projects
- **File Upload**: Secure multi-file upload with validation
- **File Serving**: Stream files for viewing or download
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, CORS, rate limiting, file validation

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm (recommended) or npm

## 🛠️ Installation

1. **Install dependencies**
```bash
pnpm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
JWT_SECRET="your-secret-key"
PORT=5000
```

3. **Setup database**
```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed database with sample data
pnpm seed
```

4. **Start development server**
```bash
pnpm dev
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/register` - Register new user

### Projects
- `GET /api/projects` - List all projects (public)
- `GET /api/projects/:id` - Get project by ID (public)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Files
- `POST /api/files/upload` - Upload files (protected)
- `GET /api/files/:id` - View file (public)
- `GET /api/files/:id/download` - Download file (public)
- `DELETE /api/files/:id` - Delete file (protected)

### Health
- `GET /api/health` - Health check

## 🔒 Security Features

- **File Validation**: Whitelist of allowed extensions (.pbix, .csv, .xlsx, .png, .jpg, .pdf)
- **MIME Type Checking**: Validates file content matches extension
- **Size Limits**: 100MB per file, 10 files per upload
- **Filename Sanitization**: Prevents path traversal attacks
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Prisma client
│   ├── controllers/
│   │   ├── authController.ts    # Auth logic
│   │   ├── projectController.ts # Project CRUD
│   │   └── fileController.ts    # File operations
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   ├── upload.ts            # Multer config
│   │   └── errorHandler.ts      # Error handling
│   ├── routes/
│   │   ├── auth.ts              # Auth routes
│   │   ├── projects.ts          # Project routes
│   │   └── files.ts             # File routes
│   ├── utils/
│   │   ├── jwt.ts               # JWT helpers
│   │   └── fileValidation.ts    # File validation
│   ├── server.ts                # Express app
│   └── seed.ts                  # Database seeding
├── prisma/
│   └── schema.prisma            # Database schema
├── uploads/                     # Uploaded files
├── package.json
└── tsconfig.json
```

## 🗄️ Database Schema

### User
- id (UUID)
- username (unique)
- password (hashed)
- createdAt, updatedAt

### Project
- id (UUID)
- title
- description
- tags (array)
- createdAt, updatedAt
- files (relation)

### File
- id (UUID)
- filename (original)
- storedName (UUID-based)
- mimetype
- size
- path
- projectId (foreign key)
- createdAt

## 🧪 Testing

```bash
# Run Prisma Studio to view database
pnpm prisma:studio

# Test API endpoints
curl http://localhost:5000/api/health
```

## 🚀 Production Build

```bash
pnpm build
pnpm start
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| UPLOAD_DIR | Upload directory | ./uploads |
| MAX_FILE_SIZE | Max file size in bytes | 104857600 (100MB) |
| MAX_FILES_PER_UPLOAD | Max files per upload | 10 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## 📄 License

MIT
