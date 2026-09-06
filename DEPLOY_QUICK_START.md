# ⚡ Quick Start: Deploy to cPanel in 5 Minutes

## Prerequisites
- cPanel hosting with Node.js 18+ support
- Domain pointed to cPanel
- SSH access enabled
- WhatsApp API credentials (optional but recommended)

## 5-Step Deployment

### 1️⃣ Connect via SSH (1 min)
```bash
ssh username@your-hosting-ip
# or
ssh username@berakhahgardens.co.ke
```

### 2️⃣ Navigate & Download (1 min)
```bash
cd ~/public_html

# Option A: Clone from Git
git clone https://github.com/yourusername/berakhah-gardens.git .

# Option B: Upload via FTP/cPanel File Manager
# Download project as ZIP and extract to public_html
```

### 3️⃣ Configure Environment (1 min)
```bash
# Copy template
cp .env.example .env.local

# Edit with your credentials
nano .env.local

# Add these critical variables:
# WHATSAPP_PHONE_NUMBER_ID=your_id
# WHATSAPP_ACCESS_TOKEN=your_token
# NODE_ENV=production
# NEXT_PUBLIC_APP_URL=https://berakhahgardens.co.ke

# Press Ctrl+O to save, Ctrl+X to exit
```

### 4️⃣ Install & Build (1-2 min)
```bash
# Install dependencies
npm install --production

# Build application
npm run build

# Verify build succeeded - should say "✓ Compiled successfully"
```

### 5️⃣ Start Application (2 min)

**Option A: Using cPanel Node.js Manager (Recommended)**
1. Log into cPanel
2. Go to **Node.js Manager**
3. Click **Create Application**
   - Node.js version: 18.x
   - Application root: `/home/username/public_html`
   - Application URL: `https://berakhahgardens.co.ke`
   - Startup file: `server.js`
4. Click **Create**
5. Click **Start**

**Option B: Using Command Line**
```bash
npm start
# Or if using PM2:
# npm install -g pm2
# pm2 start npm --name "berakhah-gardens" -- start
# pm2 save
```

---

## ✅ Verify It Works

```bash
# Check health endpoint
curl -s http://127.0.0.1:3000/api/health | json_pp

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2026-09-01T...",
#   "environment": "production"
# }
```

**Visit in browser**: https://berakhahgardens.co.ke

---

## 📊 What's Running Now?

- ✅ Next.js application on production build
- ✅ Static optimization enabled
- ✅ API routes working
- ✅ WhatsApp integration ready
- ✅ SSL/HTTPS secured
- ✅ Performance optimized

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` again |
| Port already in use | cPanel Node.js Manager will assign different port |
| HTTPS not working | Check SSL certificate in cPanel |
| WhatsApp not sending | Verify .env.local has API credentials |
| 502 Bad Gateway | Check application logs in cPanel |

---

## 📚 Next Steps

1. **Test Everything**: Submit test booking, verify WhatsApp message
2. **Setup Monitoring**: Enable cPanel Resource Monitor
3. **Backups**: Configure daily backups in cPanel
4. **Domain Email**: Setup hello@berakhahgardens.co.ke
5. **Analytics**: Add Google Analytics if desired

---

## 📖 Full Documentation

- **Detailed Guide**: See `CPANEL_DEPLOYMENT.md`
- **Complete Checklist**: See `PRODUCTION_CHECKLIST.md`
- **WhatsApp Setup**: See `WHATSAPP_SETUP.md`

---

## 🎉 You're Live!

Your Berakhah Gardens website is now running on production!

**Access**: https://berakhahgardens.co.ke  
**Admin Support**: Your cPanel Account  
**24/7 Availability**: Configured with auto-restart  

Enjoy! 🚀
