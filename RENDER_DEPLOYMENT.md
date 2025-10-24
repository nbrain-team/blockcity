# BlockCity - Render Deployment Guide

## Render Environment Variables Configuration

Set these environment variables in your Render dashboard for workspace: **tea-d3roc1odl3ps73fjksu0**

### Dynamic.xyz Configuration

```
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=83bd25a3-bccf-4d2b-be7e-b550baa982db
DYNAMIC_API_KEY=dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH
NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID=dc325555-d402-4246-a4cb-ea66444afeb2
DYNAMIC_JWKS_ENDPOINT=https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks
```

### Database Configuration

```
DATABASE_URL=<your-render-postgresql-connection-string>
```

Render will automatically provide this when you create a PostgreSQL database.

### Application URLs

```
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
NEXTAUTH_URL=https://your-app-name.onrender.com
```

Replace `your-app-name` with your actual Render service name.

### Bitcoin Network

```
BITCOIN_NETWORK=mainnet
NEXT_PUBLIC_BITCOIN_NETWORK=mainnet
```

For production, use `mainnet`. For testing, use `testnet`.

### Security

```
NEXTAUTH_SECRET=<generate-a-secure-random-string>
```

Generate a secure secret with: `openssl rand -base64 32`

### Node Environment

```
NODE_ENV=production
```

## Complete Environment Variables List

Copy and paste these into your Render dashboard, replacing values as needed:

```env
# Dynamic.xyz Authentication
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=83bd25a3-bccf-4d2b-be7e-b550baa982db
DYNAMIC_API_KEY=dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH
NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID=dc325555-d402-4246-a4cb-ea66444afeb2
DYNAMIC_JWKS_ENDPOINT=https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks

# Database (auto-populated by Render)
DATABASE_URL=<your-render-postgresql-connection-string>

# Application URLs (update with your Render URL)
NEXT_PUBLIC_APP_URL=https://blockcity.onrender.com
NEXTAUTH_URL=https://blockcity.onrender.com

# Bitcoin Configuration
BITCOIN_NETWORK=mainnet
NEXT_PUBLIC_BITCOIN_NETWORK=mainnet

# Security
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Node Environment
NODE_ENV=production
```

## Render Service Configuration

### Build Settings

- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

### Database Setup

1. Create a new PostgreSQL database in Render
2. Name it: `blockcity-db`
3. The `DATABASE_URL` will be automatically added to your environment variables

### Deployment Steps

1. **Connect GitHub Repository**
   - Go to Render Dashboard
   - Create New Web Service
   - Connect to repository: `https://github.com/nbrain-team/blockcity`
   - Select branch: `main`
   - Root directory: `bcity`

2. **Configure Build Settings**
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Copy all variables from the list above
   - Add each one in the Render dashboard

4. **Create PostgreSQL Database**
   - Create a new PostgreSQL database
   - Link it to your web service
   - Run migrations after first deployment

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Run database migrations

### Post-Deployment Tasks

After your first successful deployment:

1. **Run Database Migrations**
   
   In Render Shell:
   ```bash
   npx prisma migrate deploy
   ```

2. **Verify Dynamic.xyz Configuration**
   
   In your Dynamic.xyz dashboard:
   - Add your Render URL to allowed origins
   - Update redirect URLs to include your Render domain

3. **Test the Application**
   - Visit your Render URL
   - Try connecting a wallet
   - Verify authentication works

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
- Verify `DATABASE_URL` is correctly set
- Ensure Prisma client is generated during build
- Check that migrations have been run

### Dynamic.xyz Authentication Issues

If wallet connection fails:
- Verify all Dynamic.xyz environment variables are set
- Check that your Render URL is added to Dynamic.xyz allowed origins
- Ensure JWKS endpoint is accessible

### Build Failures

If build fails:
- Check Node version is 18+
- Verify all dependencies are in package.json
- Review build logs for specific errors

## Monitoring

Set up monitoring in Render:
- Enable "Auto-Deploy" for automatic deployments on GitHub push
- Set up health checks
- Configure logging and alerts

## Scaling

For production use:
- Upgrade to Render's Standard plan or higher
- Enable auto-scaling based on traffic
- Consider upgrading database plan for better performance
- Set up connection pooling for database

## Security Checklist

- ✅ NEXTAUTH_SECRET is a strong random value
- ✅ DATABASE_URL is secure and not exposed
- ✅ API keys are stored in environment variables
- ✅ CORS is properly configured
- ✅ HTTPS is enabled (automatic on Render)
- ✅ Dynamic.xyz allowed origins are restricted to your domain

## Support

For issues:
- Check Render logs in the dashboard
- Review Dynamic.xyz documentation: https://docs.dynamic.xyz/
- Check application logs for errors

