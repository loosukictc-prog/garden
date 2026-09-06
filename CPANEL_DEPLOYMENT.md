# 🚀 Berakhah Gardens - cPanel Production Deployment Guide

## Pre-Deployment Checklist

- [ ] Node.js 18+ available on hosting
- [ ] npm installed on hosting
- [ ] SSH access enabled
- [ ] SSL/TLS certificate installed
- [ ] Domain DNS configured
- [ ] WhatsApp API credentials obtained (see WHATSAPP_SETUP.md)
- [ ] Email configuration setup
- [ ] Database backups created

## Deployment Steps

### Step 1: Prepare Your cPanel Host

1. **Purchase/Setup Hosting**
   - Ensure Node.js support (v18+)
   - Select appropriate plan for traffic
   - Verify SSH access is available

2. **Configure Domain in cPanel**
   - Go to cPanel → Addon Domains
   - Add domain: `berakhahgardens.co.ke`
   - Point to public directory

3. **Install SSL Certificate**
   - Go to cPanel → AutoSSL or Let's Encrypt
   - Install free SSL certificate
   - Enable auto-renewal

### Step 2: Connect via SSH

```bash
# On your local machine
ssh username@your-hosting-ip
# or
ssh username@berakhahgardens.co.ke
```

### Step 3: Deploy Application

```bash
# Navigate to your domain directory
cd ~/public_html

# Clone or upload your repository
git clone https://github.com/yourusername/berakhah-gardens.git .
# OR unzip your project files

# Install dependencies
npm install --production

# Create .env.local from .env.example
cp .env.example .env.local

# Edit with your credentials
nano .env.local
# Add WhatsApp API credentials and other environment variables

# Build the application
npm run build
```

### Step 4: Configure Node.js Application in cPanel

1. **Setup Node.js App**
   - Go to cPanel → Node.js Manager
   - Click "Create Application"
   - Select version: 18.x or higher
   - Application root: `/home/username/public_html`
   - Application URL: `https://berakhahgardens.co.ke`
   - Application startup file: `server.js` or `npm start`
   - Click "Create"

2. **Note the Port** (usually 3000+)
   - cPanel will assign a port
   - Update proxy configuration if needed

### Step 5: Create Reverse Proxy (if needed)

If using traditional Apache, create `.htaccess` in public_html:

```apache
<IfModule mod_proxy.c>
  ProxyPreserveHost On
  ProxyPassMatch ^/(.*) http://127.0.0.1:3000/$1
  ProxyPassReverse ^/(.*) http://127.0.0.1:3000/$1
</IfModule>
```

### Step 6: Environment Variables Setup

Add these in cPanel or `.env.local`:

```
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_RECIPIENT_PHONE=254757692495
NEXT_PUBLIC_APP_URL=https://berakhahgardens.co.ke
NODE_ENV=production
```

### Step 7: Start Application

```bash
# Via Node.js Manager in cPanel (recommended)
# Or via SSH:
npm start
# or
node server.js
```

### Step 8: Setup Auto-Restart (using PM2)

```bash
# Install PM2 globally (if allowed)
npm install -g pm2

# Create ecosystem config
pm2 start npm --name "berakhah-gardens" -- start

# Save PM2 process list
pm2 save

# Setup startup hook
pm2 startup
```

## File Structure After Deployment

```
public_html/
├── .env.local                 # Environment variables (create this)
├── .htaccess                  # Apache rewrite rules
├── server.js                  # Node.js entry point
├── package.json               # Dependencies
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind CSS config
├── .next/                     # Built application
├── public/                    # Static assets
│   ├── logo.png              # Your logo
│   ├── favicon.ico           # Favicon
│   └── ...                   # Other assets
├── app/                      # Next.js app directory
│   ├── api/
│   │   └── send-booking/    # WhatsApp booking API
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── node_modules/            # Dependencies (after npm install)
```

## cPanel Monitoring

### Check Application Logs

```bash
# Via cPanel
1. Go to cPanel → Error Log
2. Check for Node.js application errors

# Or via SSH
tail -f ~/public_html/logs/error.log
```

### Monitor Performance

- **CPU Usage**: cPanel → Resource Monitor
- **Disk Space**: cPanel → Disk Usage
- **Bandwidth**: cPanel → Bandwidth

## Post-Deployment Steps

### 1. Test Application
- [ ] Visit https://berakhahgardens.co.ke
- [ ] Test booking form
- [ ] Verify WhatsApp messages received
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify contact information

### 2. Setup Backups
```bash
# In cPanel → Backup
- Enable automated daily backups
- Store off-site backup copies
```

### 3. Configure Email (if needed)

```bash
# Contact email for bookings
- Setup forwarder for hello@berakhahgardens.co.ke
- Configure SPF/DKIM records
```

### 4. Setup Auto-Renewal

```bash
# SSL Certificate
- cPanel → AutoSSL: Enable auto-renewal

# Node.js Dependencies
- Set up cron job to update packages monthly
```

### 5. Performance Optimization

```bash
# Enable caching
- cPanel → MultiPHP Cache
- Enable OPcache

# Enable Gzip compression
- Already configured in .htaccess
```

## Troubleshooting

### Application Won't Start
1. Check SSH logs: `tail -f ~/public_html/logs/error.log`
2. Verify Node.js version: `node -v`
3. Check port conflicts: `netstat -tuln`
4. Reinstall dependencies: `npm install --production`

### WhatsApp API Not Working
1. Verify .env.local has credentials
2. Check firewall rules allow outbound HTTPS
3. Test API directly: `curl -X POST https://graph.instagram.com/v20.0/...`
4. See WHATSAPP_SETUP.md for detailed configuration

### Domain Not Resolving
1. Check DNS records in cPanel
2. Verify A record points to hosting IP
3. Wait for DNS propagation (up to 48 hours)
4. Clear browser cache and restart

### High CPU/Memory Usage
1. Check for infinite loops in code
2. Review application logs for errors
3. Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=1024`
4. Contact hosting support for resource limit increase

## Security Best Practices

### 1. Secure Environment Variables
```bash
# Never commit .env.local
echo ".env.local" >> .gitignore

# Restrict file permissions
chmod 600 .env.local
```

### 2. Update Dependencies Regularly
```bash
# Check for updates
npm audit

# Update packages
npm update

# Deploy updated version
npm run build
npm start
```

### 3. Monitor Access Logs
```bash
# Check for suspicious activity
tail -f ~/public_html/logs/access.log | grep -E "POST|PUT|DELETE"
```

### 4. Enable Rate Limiting
Configure in your hosting provider's firewall to limit:
- API requests per IP
- Login attempts
- Form submissions

## Scaling (Future)

If traffic increases:

1. **Upgrade Plan**
   - Increase RAM allocation
   - Upgrade to dedicated resources

2. **Implement Caching**
   - Use Redis for session caching
   - Implement HTTP caching headers

3. **Database Optimization**
   - If adding database later, use indexes
   - Archive old booking records

4. **CDN Integration**
   - Use Cloudflare for static assets
   - Reduces server load

## Support & Resources

- **cPanel Docs**: https://documentation.cpanel.net/
- **Next.js Production**: https://nextjs.org/docs/production
- **Node.js Guide**: https://nodejs.org/en/docs/
- **WhatsApp API**: https://developers.facebook.com/docs/whatsapp

## Contact Support

- Hosting Provider Support: Check your cPanel welcome email
- Meta WhatsApp Support: https://www.facebook.com/business/help
- Next.js Community: https://github.com/vercel/next.js/discussions

---

**Last Updated**: September 1, 2026
**Version**: 1.0
**Status**: Ready for Production
