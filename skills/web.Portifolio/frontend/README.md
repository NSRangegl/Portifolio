# Frontend - Data Analyst Portfolio

Next.js 15 frontend application for the Data Analyst Portfolio.

## 🚀 Features

- **Project Gallery**: Browse data analysis projects
- **Project Details**: View project information and files
- **CSV Viewer**: Interactive table viewer with pagination
- **Image Viewer**: Display images inline
- **File Download**: Download any project file
- **Admin Dashboard**: Create projects and upload files
- **Authentication**: Secure admin login with JWT
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Automatic dark mode support

## 📋 Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Backend API running on port 5000

## 🛠️ Installation

1. **Install dependencies**
```bash
pnpm install
```

2. **Setup environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Homepage (project gallery)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx            # Project detail page
│   └── admin/
│       ├── login/
│       │   └── page.tsx            # Admin login
│       └── dashboard/
│           └── page.tsx            # Admin dashboard
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   ├── ProjectCard.tsx             # Project card component
│   ├── FileUploader.tsx            # Drag & drop uploader
│   └── CSVViewer.tsx               # CSV table viewer
├── lib/
│   ├── api.ts                      # API client
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # Utility functions
└── public/                         # Static assets
```

## 🎨 Pages

### Public Pages
- **/** - Homepage with project gallery
- **/projects/[id]** - Project detail page with files

### Admin Pages (Protected)
- **/admin/login** - Admin login
- **/admin/dashboard** - Create projects and upload files

## 🔧 Components

### Navbar
Navigation bar with authentication state and links.

### ProjectCard
Displays project summary in gallery view with title, description, tags, and file count.

### FileUploader
Drag-and-drop file upload component with:
- File type validation
- Size validation
- Upload progress
- Success/error feedback

### CSVViewer
Interactive CSV viewer with:
- Modal display
- Pagination (50 rows per page)
- Download option
- Responsive table

## 🌐 API Integration

The frontend communicates with the backend API using the `api` client in `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// Get projects
const data = await api.getProjects(page, limit);

// Login
await api.login(username, password);

// Upload files
await api.uploadFiles(projectId, files);
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Dark Mode**: Automatic based on system preference
- **Responsive**: Mobile-first design

## 🔒 Authentication

The app uses JWT tokens stored in localStorage:
- Login redirects to `/admin/dashboard`
- Protected routes check authentication
- Logout clears token and redirects to home

## 🚀 Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:5000 |

## 🧪 Development

```bash
# Run development server
pnpm dev

# Lint code
pnpm lint
```

## 📄 License

MIT
