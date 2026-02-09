# 📖 Guia Passo a Passo - Portfólio de Analista de Dados

Este guia irá te ajudar a configurar e usar o portfólio do zero, mesmo sem experiência prévia.

---

## 🎯 O que você vai conseguir fazer

Ao final deste guia, você terá:
- ✅ Um site de portfólio rodando localmente
- ✅ Capacidade de criar projetos
- ✅ Sistema de upload de arquivos funcionando
- ✅ Visualização de CSV e imagens
- ✅ Área administrativa protegida

---

## 📋 Parte 1: Preparar o Computador

### Passo 1.1: Instalar Node.js

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador
4. Clique em "Next" até finalizar
5. **Teste a instalação**:
   ```powershell
   node --version
   # Deve mostrar algo como: v20.x.x
   ```

### Passo 1.2: Instalar pnpm

1. Abra o PowerShell como **Administrador**
2. Execute:
   ```powershell
   npm install -g pnpm
   ```
3. **Teste a instalação**:
   ```powershell
   pnpm --version
   # Deve mostrar algo como: 9.x.x
   ```

### Passo 1.3: Instalar PostgreSQL

1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o instalador
3. Durante a instalação:
   - **Senha do postgres**: Anote! Você vai precisar (ex: `postgres123`)
   - **Porta**: Deixe `5432` (padrão)
   - Marque todas as opções
4. **Teste a instalação**:
   ```powershell
   psql --version
   # Deve mostrar: psql (PostgreSQL) 14.x
   ```

---

## 📁 Parte 2: Configurar o Banco de Dados

### Passo 2.1: Criar o Banco de Dados

1. Abra o PowerShell
2. Execute:
   ```powershell
   # Conectar ao PostgreSQL
   psql -U postgres
   
   # Você verá: postgres=#
   # Digite a senha que você criou
   ```

3. Dentro do psql, execute:
   ```sql
   CREATE DATABASE portfolio_db;
   \q
   ```

### Passo 2.2: Verificar se funcionou

```powershell
psql -U postgres -d portfolio_db
# Se conectar sem erro, está tudo certo!
# Digite \q para sair
```

---

## ⚙️ Parte 3: Configurar o Backend

### Passo 3.1: Navegar até a pasta do backend

```powershell
cd C:\Users\natan\OneDrive\Documentos\GitHub\Portifolio\skills\web.Portifolio\backend
```

### Passo 3.2: Instalar dependências

```powershell
pnpm install
```

**Aguarde**: Isso pode levar alguns minutos ☕

### Passo 3.3: Configurar variáveis de ambiente

1. Copie o arquivo de exemplo:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Abra o arquivo `.env` no VS Code ou Notepad
3. **Edite as seguintes linhas**:

```env
# Substitua 'password' pela senha que você criou no PostgreSQL
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/portfolio_db"

# Pode deixar como está ou mudar
JWT_SECRET="meu-super-secret-key-123"
ADMIN_PASSWORD="admin123"
```

**Exemplo real**:
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/portfolio_db"
JWT_SECRET="portfolio-secret-2024"
ADMIN_PASSWORD="MinhaSenha@123"
```

4. **Salve o arquivo** (Ctrl + S)

### Passo 3.4: Configurar o banco de dados

```powershell
# Gerar o Prisma Client
pnpm prisma:generate

# Criar as tabelas no banco
pnpm prisma:migrate

# Quando perguntar o nome da migration, digite: init
```

### Passo 3.5: Popular com dados de exemplo

```powershell
pnpm seed
```

Você verá:
```
✅ Admin user created: admin
✅ Sample projects created
   - Sales Dashboard Analysis
   - Customer Segmentation Study
   - Financial Reporting Automation
🎉 Database seeded successfully!
```

### Passo 3.6: Iniciar o servidor backend

```powershell
pnpm dev
```

Você verá:
```
🚀 Server running on port 5000
📝 Environment: development
🔗 API: http://localhost:5000/api
```

**✅ Backend está rodando!** Deixe esta janela aberta.

---

## 🎨 Parte 4: Configurar o Frontend

### Passo 4.1: Abrir NOVO PowerShell

**Importante**: Não feche o PowerShell do backend!

1. Abra uma **nova janela** do PowerShell
2. Navegue até o frontend:

```powershell
cd C:\Users\natan\OneDrive\Documentos\GitHub\Portifolio\skills\web.Portifolio\frontend
```

### Passo 4.2: Instalar dependências

```powershell
pnpm install
```

**Aguarde**: Isso pode levar alguns minutos ☕

### Passo 4.3: Configurar variáveis de ambiente

```powershell
Copy-Item .env.local.example .env.local
```

**Não precisa editar**, o padrão já está correto!

### Passo 4.4: Iniciar o servidor frontend

```powershell
pnpm dev
```

Você verá:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

**✅ Frontend está rodando!**

---

## 🎉 Parte 5: Usar o Portfólio

### Passo 5.1: Acessar o site

1. Abra seu navegador
2. Acesse: **http://localhost:3000**
3. Você verá a página inicial com 3 projetos de exemplo

### Passo 5.2: Fazer login como administrador

1. Clique em **"Admin Login"** (canto superior direito)
2. Digite:
   - **Username**: `admin`
   - **Password**: `admin123` (ou a senha que você definiu em `ADMIN_PASSWORD`)
3. Clique em **"Entrar"**

### Passo 5.3: Criar um novo projeto

1. No Dashboard, clique em **"Novo Projeto"**
2. Preencha:
   - **Título**: `Análise de Vendas 2024`
   - **Descrição**: `Dashboard interativo mostrando vendas por região`
   - **Tags**: `Power BI, SQL, Excel`
3. Clique em **"Criar Projeto"**

### Passo 5.4: Fazer upload de arquivos

1. No dropdown, selecione o projeto que você criou
2. Arraste arquivos ou clique para selecionar
3. **Tipos aceitos**:
   - 📊 Power BI: `.pbix`
   - 📈 Planilhas: `.csv`, `.xlsx`, `.xls`
   - 🖼️ Imagens: `.png`, `.jpg`, `.jpeg`
   - 📄 Documentos: `.pdf`, `.txt`
4. Clique em **"Fazer Upload"**

### Passo 5.5: Visualizar o projeto

1. Clique em **"Home"** no menu
2. Clique no card do seu projeto
3. Você verá todos os arquivos
4. **Teste as funcionalidades**:
   - 📊 CSV: Clique em "Pré-visualizar CSV"
   - 🖼️ Imagem: Clique em "Ver Imagem"
   - ⬇️ Download: Clique em "Download"

---

## 🔍 Parte 6: Verificar se está tudo funcionando

### ✅ Checklist de Teste

- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 3000
- [ ] Página inicial mostra projetos
- [ ] Login funciona
- [ ] Dashboard abre
- [ ] Consigo criar projeto
- [ ] Consigo fazer upload de arquivo
- [ ] CSV abre em tabela
- [ ] Imagem é exibida
- [ ] Download funciona

---

## 🛠️ Parte 7: Solução de Problemas

### ❌ Erro: "Cannot find module"

**Solução**:
```powershell
# No backend ou frontend
pnpm install
```

### ❌ Erro: "Port 5000 already in use"

**Solução**:
```powershell
# Matar processo na porta 5000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Ou mudar a porta no backend/.env
PORT=5001
```

### ❌ Erro: "Database connection failed"

**Solução**:
1. Verifique se o PostgreSQL está rodando
2. Confirme a senha em `backend/.env`
3. Teste a conexão:
   ```powershell
   psql -U postgres -d portfolio_db
   ```

### ❌ Erro: "Invalid credentials" ao fazer login

**Solução**:
1. Verifique o username: `admin`
2. Verifique a senha no `backend/.env` (campo `ADMIN_PASSWORD`)
3. Se mudou a senha, rode novamente:
   ```powershell
   cd backend
   pnpm seed
   ```

### ❌ Frontend não conecta ao backend

**Solução**:
1. Verifique se o backend está rodando
2. Acesse http://localhost:5000/api/health
3. Deve retornar: `{"status":"ok"}`

---

## 📊 Parte 8: Comandos Úteis

### Ver o banco de dados visualmente

```powershell
cd backend
pnpm prisma:studio
```

Abre em: http://localhost:5555

### Resetar o banco de dados

```powershell
cd backend
pnpm prisma migrate reset
pnpm seed
```

### Parar os servidores

- **Backend/Frontend**: Pressione `Ctrl + C` no PowerShell

### Reiniciar tudo

```powershell
# Backend
cd backend
pnpm dev

# Frontend (novo PowerShell)
cd frontend
pnpm dev
```

---

## 🚀 Parte 9: Próximos Passos

### Personalizações Básicas

1. **Mudar cores**: Edite `frontend/app/globals.css`
2. **Adicionar mais projetos**: Use o dashboard
3. **Mudar senha admin**: Edite `backend/.env` e rode `pnpm seed`

### Adicionar mais tipos de arquivo

1. Abra: `backend/src/utils/fileValidation.ts`
2. Adicione a extensão em `ALLOWED_EXTENSIONS`
3. Adicione o MIME type em `MIME_TYPE_MAP`

### Deploy (Publicar na internet)

**Opções recomendadas**:
- **Frontend**: Vercel (grátis)
- **Backend**: Railway (grátis até certo limite)
- **Banco**: Railway PostgreSQL ou Supabase

---

## 📞 Ajuda Adicional

### Documentação Completa

- [README.md](README.md) - Visão geral
- [QUICK_START.md](QUICK_START.md) - Guia rápido
- [backend/README.md](backend/README.md) - Detalhes do backend
- [frontend/README.md](frontend/README.md) - Detalhes do frontend

### Estrutura de Pastas

```
web.Portifolio/
├── backend/          ← Servidor API
│   ├── src/          ← Código fonte
│   ├── prisma/       ← Banco de dados
│   └── uploads/      ← Arquivos enviados
│
└── frontend/         ← Site
    ├── app/          ← Páginas
    ├── components/   ← Componentes
    └── lib/          ← Utilitários
```

---

## ✨ Resumo dos Comandos

```powershell
# SETUP INICIAL (só uma vez)
cd backend
pnpm install
cp .env.example .env
# Editar .env
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed

cd ../frontend
pnpm install
cp .env.local.example .env.local

# RODAR DIARIAMENTE
# Terminal 1:
cd backend
pnpm dev

# Terminal 2:
cd frontend
pnpm dev

# Acessar: http://localhost:3000
# Login: admin / admin123
```

---

## 🎊 Pronto!

Agora você tem um portfólio profissional funcionando! 

**Dicas finais**:
- 💾 Salve seus arquivos importantes
- 🔄 Faça backup do banco regularmente
- 🔐 Mude a senha padrão
- 📝 Documente seus projetos bem
- 🎨 Personalize as cores e estilos

**Boa sorte com seu portfólio!** 🚀
