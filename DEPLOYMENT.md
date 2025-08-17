# Deployment Guide for Wealth Management System

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Prepare your repository:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Add Database:**
   - In Vercel dashboard, go to Storage tab
   - Add PostgreSQL database (Neon or Supabase integration)
   - Copy the DATABASE_URL to environment variables

4. **Set Environment Variables:**
   - In Vercel project settings → Environment Variables
   - Add: `DATABASE_URL` (from your database provider)
   - Add: `NEXTAUTH_SECRET` (generate a random string)
   - Add: `NEXTAUTH_URL` (your vercel app URL)

### Option 2: Railway

1. **Deploy:**
   - Go to [railway.app](https://railway.app)
   - Sign up and connect GitHub
   - Deploy your repository
   - Railway will auto-detect Next.js

2. **Add Database:**
   - In Railway dashboard, add PostgreSQL service
   - Connect it to your app
   - Copy DATABASE_URL to environment variables

### Option 3: Netlify

1. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Deploy with automatic settings

2. **Database:**
   - Use external database (Supabase, PlanetScale, etc.)
   - Add DATABASE_URL to environment variables

## Database Setup

### Migration from SQLite to PostgreSQL

1. **Install new dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Run migrations on production database:**
   ```bash
   npx prisma db push
   ```

4. **Seed database (optional):**
   ```bash
   npx prisma db seed
   ```

## Environment Variables Needed

Copy `env.example` to `.env` and fill in:

```
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

## Free Database Options

1. **Supabase** (Recommended)
   - Free tier: 500MB, 2GB bandwidth
   - Go to [supabase.com](https://supabase.com)
   - Create project → Get DATABASE_URL

2. **Neon**
   - Free tier: 512MB
   - Go to [neon.tech](https://neon.tech)
   - Create database → Copy connection string

3. **PlanetScale**
   - Free tier: 5GB
   - Go to [planetscale.com](https://planetscale.com)
   - Create database → Get connection string

## Build Commands

For most platforms, these are auto-detected:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Install Command:** `npm install`

## Custom Domain (Optional)

Once deployed, you can add a custom domain:

1. Purchase domain from any registrar
2. In your deployment platform, go to domains section
3. Add your domain and follow DNS instructions
4. Update NEXTAUTH_URL environment variable

## Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Check DATABASE_URL format
   - Ensure database is accessible from deployment platform
   - Run `npx prisma db push` to sync schema

2. **Build Errors:**
   - Check all environment variables are set
   - Ensure dependencies are installed
   - Review build logs for specific errors

3. **Runtime Errors:**
   - Check server logs in deployment platform
   - Verify all API routes are working
   - Test database connections

### Local Testing Before Deployment:

```bash
# Test production build locally
npm run build
npm start

# Test database connection
npx prisma studio
```

## Security Considerations

- Never commit `.env` files
- Use strong, unique NEXTAUTH_SECRET
- Enable HTTPS (automatic on most platforms)
- Consider rate limiting for production
- Review and secure API endpoints

Your wealth management system will be accessible worldwide once deployed!
