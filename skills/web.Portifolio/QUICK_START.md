# 🚀 Quick Start Guide - Data Analyst Portfolio

Este guia irá ajudá-lo a configurar e executar o portfólio completo.

## 📋 Pré-requisitos

- **Node.js** 20 ou superior
- **PostgreSQL** 14 ou superior
- **pnpm** (recomendado) ou npm

## 🔧 Instalação Completa

### 1. Configurar o Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb portfolio_db

# Ou usando psql
psql -U postgres
CREATE DATABASE portfolio_db;
\q
```

### 2. Configurar o Backend

```bash
cd backend

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
# DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_db"
# JWT_SECRET="seu-secret-key-aqui"
# ADMIN_PASSWORD="admin123"

# Gerar Prisma Client
pnpm prisma:generate

# Executar migrations
pnpm prisma:migrate

# Popular banco com dados de exemplo
pnpm seed

# Iniciar servidor backend
pnpm dev
```

O backend estará rodando em `http://localhost:5000`

### 3. Configurar o Frontend

```bash
# Em outro terminal
cd frontend

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.local.example .env.local

# Editar .env.local se necessário
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Iniciar servidor frontend
pnpm dev
```

O frontend estará rodando em `http://localhost:3000`

## 🎯 Primeiro Acesso

1. **Acesse o frontend**: http://localhost:3000
2. **Faça login como admin**:
   - Clique em "Admin Login"
   - Username: `admin`
   - Password: `admin123` (ou o que você definiu em ADMIN_PASSWORD)
3. **Crie um projeto**:
   - No dashboard, clique em "Novo Projeto"
   - Preencha título, descrição e tags
   - Clique em "Criar Projeto"
4. **Faça upload de arquivos**:
   - Selecione o projeto criado
   - Arraste arquivos ou clique para selecionar
   - Clique em "Fazer Upload"

## 📁 Estrutura de Arquivos Suportados

- **Power BI**: `.pbix`
- **Planilhas**: `.csv`, `.xlsx`, `.xls`
- **Imagens**: `.png`, `.jpg`, `.jpeg`
- **Documentos**: `.pdf`, `.txt`

**Limite**: 100MB por arquivo, 10 arquivos por upload

## 🔍 Testando Funcionalidades

### Visualizar CSV
1. Faça upload de um arquivo `.csv`
2. Na página do projeto, clique em "📊 Pré-visualizar CSV"
3. Navegue pela tabela usando paginação

### Visualizar Imagens
1. Faça upload de uma imagem (`.png`, `.jpg`)
2. Na página do projeto, clique em "🖼️ Ver Imagem"
3. A imagem abrirá em uma nova aba

### Download de Arquivos
1. Em qualquer arquivo, clique no botão "Download"
2. O arquivo será baixado para seu computador

## 🛠️ Comandos Úteis

### Backend
```bash
# Ver banco de dados no Prisma Studio
pnpm prisma:studio

# Resetar banco de dados
pnpm prisma migrate reset

# Ver logs do servidor
pnpm dev
```

### Frontend
```bash
# Build para produção
pnpm build

# Iniciar em produção
pnpm start

# Lint
pnpm lint
```

## 🐛 Solução de Problemas

### Backend não conecta ao banco
- Verifique se o PostgreSQL está rodando
- Confirme a string de conexão em `DATABASE_URL`
- Teste a conexão: `psql -U postgres -d portfolio_db`

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 5000
- Confirme `NEXT_PUBLIC_API_URL` em `.env.local`
- Verifique CORS no backend (`FRONTEND_URL`)

### Erro ao fazer upload
- Verifique o tamanho do arquivo (máx. 100MB)
- Confirme que o tipo de arquivo é suportado
- Verifique permissões da pasta `uploads/`

### Erro de autenticação
- Limpe o localStorage do navegador
- Faça login novamente
- Verifique `JWT_SECRET` no backend

## 📚 Próximos Passos

1. **Personalize o design**: Edite `frontend/app/globals.css`
2. **Adicione mais tipos de arquivo**: Atualize `fileValidation.ts`
3. **Configure deploy**: Veja READMEs individuais
4. **Adicione analytics**: Integre Google Analytics
5. **Configure domínio**: Use Vercel + Railway

## 🎉 Pronto!

Seu portfólio está configurado e funcionando! Agora você pode:
- ✅ Criar projetos
- ✅ Fazer upload de arquivos
- ✅ Visualizar dados
- ✅ Compartilhar seu trabalho

Para mais detalhes, consulte:
- `backend/README.md` - Documentação do backend
- `frontend/README.md` - Documentação do frontend
- `implementation_plan.md` - Plano de implementação completo
