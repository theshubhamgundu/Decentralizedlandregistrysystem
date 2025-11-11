# Decentralized Land Registry System - Deployment Guide

## Overview
This guide covers deploying the DLRS frontend to Vercel with Supabase as the database backend.

## Architecture
- **Frontend**: React + TypeScript (hosted on Vercel)
- **Database**: Supabase (PostgreSQL)
- **Backend**: Java Spring Boot (optional - can be hosted separately or use Supabase Edge Functions)
- **Blockchain**: SHA-256 cryptographic hashing with proof-of-work

## Prerequisites
1. A Supabase account (https://supabase.com)
2. A Vercel account (https://vercel.com)
3. Node.js 18+ installed locally
4. Git repository for your code

## Step 1: Set Up Supabase

### 1.1 Create a New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - Project name: `dlrs-database`
   - Database password: (choose a strong password)
   - Region: (choose closest to your users)
4. Wait for the project to be created (~2 minutes)

### 1.2 Run the Database Schema
1. In your Supabase dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy the entire contents of `/supabase/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. You should see success messages for all tables created

### 1.3 Get Your Supabase Credentials
1. In Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Save these values - you'll need them for Vercel

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository
1. Go to https://vercel.com/dashboard
2. Click "Add New..." > "Project"
3. Import your Git repository
4. Vercel will auto-detect it's a React/Vite project

### 2.2 Configure Environment Variables
In the Vercel project settings, add these environment variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2.3 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your application
3. You'll get a URL like `https://dlrs-xxx.vercel.app`

## Step 3: Configure Supabase Authentication (Optional)

If you want to use Supabase Auth instead of your Spring Boot backend:

1. In Supabase dashboard, go to Authentication > Settings
2. Configure your authentication providers:
   - Enable Email authentication
   - Configure OAuth providers (Google, GitHub, etc.) if needed
3. Update your frontend to use Supabase Auth API

## Step 4: Set Up Java Spring Boot Backend (Optional)

If you're using a separate Spring Boot backend:

### 4.1 Configure Spring Boot
Add these properties to `application.properties`:

```properties
# Supabase Configuration
spring.datasource.url=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-database-password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# CORS Configuration (for local development)
cors.allowed.origins=http://localhost:5173,https://your-vercel-app.vercel.app
```

### 4.2 Deploy Spring Boot Backend
You can deploy your Spring Boot backend to:
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **AWS Elastic Beanstalk**
- **Google Cloud Run**
- **Azure App Service**

### 4.3 Update Frontend API URL
Once your backend is deployed, update the `VITE_API_BASE_URL` in Vercel:
```bash
VITE_API_BASE_URL=https://your-spring-boot-app.railway.app/api
```

## Step 5: Configure CORS

### For Spring Boot Backend:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:5173",
                        "https://your-app.vercel.app"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## Step 6: Production Checklist

- [ ] Supabase database schema is deployed
- [ ] Genesis block is created in the blocks table
- [ ] Environment variables are set in Vercel
- [ ] CORS is properly configured
- [ ] Spring Boot backend is deployed (if using)
- [ ] Test authentication flow
- [ ] Test property registration
- [ ] Test transaction approval and blockchain creation
- [ ] Test blockchain verification
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Set up database backups in Supabase
- [ ] Configure custom domain in Vercel (optional)
- [ ] Set up monitoring and error tracking

## Monitoring and Maintenance

### Supabase
- Go to Database > Backups to configure automatic backups
- Monitor database usage in Dashboard
- Check logs in Logs Explorer

### Vercel
- Monitor deployments in Deployments tab
- Check function logs for errors
- Set up analytics

### Blockchain Verification
- Regularly verify blockchain integrity through the UI
- Monitor block creation and transaction approval
- Check for any tampered blocks

## Troubleshooting

### Issue: CORS errors
**Solution**: Make sure your backend allows requests from your Vercel domain

### Issue: Database connection errors
**Solution**: Check that your Supabase credentials are correct and the database is accessible

### Issue: Blockchain verification fails
**Solution**: 
1. Check if all blocks have valid hashes
2. Ensure previousHash links are intact
3. Verify nonce values are correct

### Issue: Transactions not creating blocks
**Solution**: Check that the mining function is working correctly and the difficulty isn't too high

## Security Considerations

1. **Never expose sensitive keys**: Keep service role keys secret
2. **Enable RLS**: Use Supabase Row Level Security policies
3. **Validate inputs**: Always validate data on both frontend and backend
4. **Use HTTPS**: Ensure all communications are encrypted
5. **Regular audits**: Periodically audit blockchain integrity
6. **Access control**: Implement proper role-based access control

## Scaling Considerations

As your application grows:
1. Consider upgrading Supabase plan for more connections
2. Implement caching for frequently accessed data
3. Use CDN for static assets (Vercel does this automatically)
4. Optimize database queries and add indexes
5. Consider sharding for large blockchain datasets

## Support

For issues:
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Spring Boot: https://spring.io/projects/spring-boot

## Local Development

To run locally:

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials

# Run development server
npm run dev

# Open http://localhost:5173
```

## Testing the Blockchain

1. Log in with any credentials (demo mode)
2. Navigate to Properties and register a new property
3. Create a transaction for the property
4. As an Inspector, approve the transaction
5. Go to Blockchain page and verify the new block was created
6. Click "Verify Chain Integrity" to ensure the blockchain is valid

The blockchain uses SHA-256 hashing and proof-of-work with difficulty 4, meaning each block hash must start with "0000".
