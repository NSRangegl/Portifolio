# Data Analyst Portfolio

A modern, full-stack web portfolio for showcasing data analysis projects with interactive file viewing and management capabilities.

## 🚀 Features

- **Project Showcase**: Display data analysis projects in an elegant gallery
- **File Management**: Upload and manage multiple file types (.pbix, .csv, .xlsx, images)
- **CSV Preview**: Interactive table viewer for CSV files
- **Image Gallery**: Lightbox-enabled image viewing
- **Admin Dashboard**: Secure area for uploading and managing projects
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Dropzone
- Papa Parse (CSV parsing)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- Multer (file uploads)
- JWT Authentication

## 📁 Project Structure

```
web.Portifolio/
├── backend/          # Express API server
├── frontend/         # Next.js application
└── README.md
```

## 🏃 Quick Start

**Para instruções detalhadas de instalação, veja [QUICK_START.md](QUICK_START.md)**

### Resumo Rápido

1. **Clone o repositório**
```bash
cd web.Portifolio
```

2. **Setup Backend**
```bash
cd backend
pnpm install
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed
pnpm dev
```

3. **Setup Frontend**
```bash
cd frontend
pnpm install
cp .env.local.example .env.local
pnpm dev
```

4. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Login: `admin` / `admin123`

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio"
JWT_SECRET="your-secret-key"
PORT=5000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## 🔒 Security Features

- File type validation (whitelist)
- File size limits
- Filename sanitization
- JWT-based authentication
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📦 Deployment

See individual README files in `backend/` and `frontend/` for deployment instructions.

## 📄 License

MIT

## 👤 Author

Data Analyst Portfolio - Built with ❤️ using modern web technologies
