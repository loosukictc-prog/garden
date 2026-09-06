# 🔧 cPanel Deployment Troubleshooting Guide

## Common Issues & Solutions

### 🔴 CRITICAL - Application Won't Start

#### Symptom: 502 Bad Gateway or "Application Error"

**Step 1: Check Application Logs**
```bash
# Via SSH
ssh username@your-host
tail -f ~/public_html/logs/error.log
# Or view via cPanel > Error Log
```

**Step 2: Verify Node.js is Running**
```bash
# Check if process is running
ps aux | grep node

# Check listening ports
netstat -tuln | grep 3000
```

**Step 3: Common Causes & Fixes**

| Issue | Solution |
|-------|----------|
| Node.js not installed | cPanel > Node.js Manager > Install Node.js |
| Missing `.env.local` | Create `.env.local` from `.env.example` |
| Port already in use | cPanel Node.js Manager will assign new port |
| npm not found | Use full path: `/usr/local/bin/npm install` |
| Permission denied on server.js | Run: `chmod +x ~/public_html/server.js` |

**Step 4: Restart Application**
```bash
# Via cPanel Node.js Manager: Click "Restart"
# Or via SSH:
cd ~/public_html
npm start
```

---

### 🟠 WhatsApp Bookings Not Working

#### Symptom: Form submits but no WhatsApp message received

**Cause 1: Missing API Credentials**
```bash
# Check .env.local exists
test -f ~/.env.local && echo "✓ File exists" || echo "✗ File missing"

# Verify it has credentials
grep WHATSAPP ~/.env.local
# Should show:
# WHATSAPP_PHONE_NUMBER_ID=xxxxx
# WHATSAPP_ACCESS_TOKEN=xxxxx
```

**Solution:**
```bash
# Create/update .env.local
nano ~/.env.local

# Add these lines with your actual credentials:
WHATSAPP_PHONE_NUMBER_ID=your_id_here
WHATSAPP_ACCESS_TOKEN=your_token_here
WHATSAPP_RECIPIENT_PHONE=254757692495

# Save: Ctrl+O, Enter, Ctrl+X
# Restart application
```

**Cause 2: Invalid API Credentials**

**Test API Directly:**
```bash
curl -X POST https://graph.instagram.com/v20.0/YOUR_PHONE_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "254757692495",
    "type": "text",
    "text": {"body": "Test message"}
  }'
```

**Solution:**
1. Go to Meta Developer Dashboard
2. Verify Phone Number ID is correct
3. Generate new Access Token if expired
4. Update `.env.local` with new credentials
5. Restart application

**Cause 3: API Rate Limited or Network Issues**

**Solution:**
```bash
# Check cPanel firewall isn't blocking outbound HTTPS
# Contact hosting provider to enable:
# - HTTPS outbound (port 443)
# - graph.instagram.com domain

# Check API dashboard for rate limits:
# https://developers.facebook.com/apps
```

**Cause 4: Phone Number Not WhatsApp Business Approved**

**Solution:**
1. Go to Meta Business Manager
2. Verify phone is registered with WhatsApp Business
3. Complete phone verification process
4. Wait 24 hours for approval
5. Test again

---

### 🟠 HTTPS/SSL Certificate Issues

#### Symptom: Browser shows "Not Secure" or SSL error

**Step 1: Verify Certificate in cPanel**
```bash
# Via cPanel:
# 1. Home > SSL/TLS Status
# 2. Look for your domain
# 3. Should show green checkmark
```

**Step 2: Check Certificate Validity**
```bash
# Via SSH
openssl s_client -connect your-domain.com:443 -servername your-domain.com | grep -E "subject|Issuer|not"
```

**Step 3: Common Causes & Solutions**

| Issue | Solution |
|-------|----------|
| No certificate | cPanel > AutoSSL or Let's Encrypt > Install |
| Expired certificate | cPanel > AutoSSL > Auto-renewal enable |
| www vs no-www mismatch | Ensure all redirects to HTTPS in .htaccess |
| Mixed content | Ensure all resources load as HTTPS |

**Step 4: Force HTTPS Redirect**
```bash
# Verify in .htaccess
grep -A2 "RewriteCond.*HTTPS" ~/public_html/.htaccess

# Should show HTTP to HTTPS redirect
# If missing, check .htaccess is properly uploaded
```

---

### 🟠 Domain Not Resolving

#### Symptom: "Cannot find server" or "ERR_NAME_NOT_RESOLVED"

**Step 1: Check DNS Configuration**
```bash
# From local computer (not SSH):
nslookup your-domain.com
# Should show hosting provider's IP

# Specific to provider:
nslookup your-domain.com 8.8.8.8
```

**Step 2: Verify DNS in cPanel**
```bash
# In cPanel:
# 1. Home > Addon Domains
# 2. Find your domain
# 3. Note the Document Root
# 4. Check DNS Zone Editor for A records
```

**Step 3: Verify Domain DNS**
```bash
# DNS should point to:
# A record: your.hosting.provider.ip
# CNAME www: your-domain.com
```

**Step 4: Common Causes**

| Issue | Solution |
|-------|----------|
| DNS still propagating | Wait 24-48 hours, clear browser cache |
| Wrong IP in DNS | Update DNS at domain registrar |
| Domain not added to cPanel | cPanel > Addon Domains > Add domain |
| Not an "Addon Domain" | Check it's properly configured in cPanel |

---

### 🟠 High CPU/Memory Usage

#### Symptom: Website slow, hosting provider warns about resources

**Step 1: Check Resource Usage**
```bash
# Via cPanel:
# Home > Resource Monitor > Current Status

# Or via SSH:
top -b -n 1 | head -20
ps aux --sort=-%cpu | head -10
```

**Step 2: Identify Problem Process**
```bash
# Find Node.js processes
ps aux | grep node

# Check memory usage
free -h
```

**Step 3: Common Causes & Solutions**

| Issue | Solution |
|-------|----------|
| Node process using too much memory | Increase Node.js heap: `NODE_OPTIONS="--max-old-space-size=1024"` |
| Too many concurrent requests | Implement rate limiting in .htaccess |
| Infinite loop in code | Check app logs for errors, review recent changes |
| Memory leak | Restart application, check for background tasks |

**Step 4: Optimization**

```bash
# Set memory limit in cPanel Node.js settings:
# NODE_OPTIONS: --max-old-space-size=1024

# Or add to .htaccess or startup script
```

---

### 🟠 404 Not Found Errors

#### Symptom: Pages work, but routes like `/gallery` show 404

**Cause: .htaccess not redirecting to Next.js**

**Solution: Update .htaccess**
```bash
# Verify .htaccess exists
test -f ~/public_html/.htaccess && echo "✓ Found" || echo "✗ Missing"

# Check RewriteRule
grep "RewriteRule.*index.html" ~/public_html/.htaccess

# Should show:
# RewriteRule ^(.*)$ index.html [L]
```

**If Still Not Working:**
```bash
# Ensure mod_rewrite is enabled
# Contact hosting provider to enable mod_rewrite

# Or configure in Node.js instead of Apache:
# Update next.config.ts with rewrites
```

---

### 🟠 File Upload Fails

#### Symptom: Cannot upload files via FTP or cPanel File Manager

**Step 1: Check File Permissions**
```bash
# View permissions
ls -la ~/public_html/

# Should show drwxr-xr-x for directories
# Should show -rw-r--r-- for files
```

**Step 2: Fix Permissions**
```bash
# Directories: 755
chmod 755 ~/public_html

# Files: 644
chmod 644 ~/public_html/*.{js,ts,json}

# Sensitive files: 600
chmod 600 ~/public_html/.env.local
```

**Step 3: Check Disk Space**
```bash
# Check available space
df -h ~/

# If low on space:
# 1. Delete node_modules: npm install will restore it
# 2. Clear npm cache: npm cache clean --force
# 3. Remove .next.backup files
# 4. Archive old logs
```

---

### 🟠 npm Commands Fail

#### Symptom: "npm: command not found" or permission errors

**Step 1: Locate npm**
```bash
# Find npm location
which npm
# Or
find /usr -name npm 2>/dev/null
```

**Step 2: Use Full Path**
```bash
# Instead of:
npm install

# Use:
/usr/local/bin/npm install
```

**Step 3: Check Node.js Version**
```bash
# Verify Node.js 18+
/usr/local/bin/node -v

# If version < 18, request upgrade from host
```

**Step 4: SSH as Correct User**
```bash
# Ensure SSH as same user that cPanel uses
# Usually: ssh username@host

# Not as root
```

---

### 🟠 Database Connection Errors (Future Feature)

#### Symptom: "Cannot connect to database"

**For Future Implementation:**
```bash
# When database is added:
1. Verify database name in .env.local
2. Check credentials
3. Verify database user has permissions
4. Test connection: mysql -u user -p db_name
5. Check firewall allows database port
```

---

## Performance Issues

### Slow Page Load

**Diagnosis:**
```bash
# Check response time
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/

# Monitor server load
while true; do ps aux | grep node; sleep 1; done
```

**Solutions:**
1. Verify Node.js process is running
2. Check CPU/memory aren't maxed
3. Clear Node cache: `npm cache clean --force`
4. Rebuild: `npm run build`
5. Restart: via cPanel Node.js Manager

### Intermittent Timeouts

**Causes:**
- Process crashing and auto-restarting
- Memory leaks
- Database timeouts (if database added)

**Solution:**
```bash
# Check logs for errors
tail -f ~/public_html/logs/error.log

# Monitor memory usage
watch -n 1 'ps aux | grep node | grep -v grep'

# Increase Node.js memory allocation
NODE_OPTIONS=--max-old-space-size=2048
```

---

## Debugging Commands Reference

```bash
# SSH into hosting
ssh username@host

# Navigate to app
cd ~/public_html

# View recent errors
tail -20 logs/error.log

# View all errors
cat logs/error.log | less

# View access log
tail -20 logs/access.log

# Check if Node running
ps aux | grep node

# Check port 3000 is open
netstat -tuln | grep 3000

# Test local connection
curl http://127.0.0.1:3000

# Restart application
npm start  # or use cPanel Node.js Manager

# Check disk space
du -sh ./*

# View environment
echo $PATH
echo $NODE_ENV

# Verify .env.local
cat .env.local | head

# Rebuild application
npm run build

# Clear cache
npm cache clean --force
rm -rf .next
npm run build
```

---

## When to Contact Support

**Contact Your Hosting Provider When:**
- [ ] Node.js won't install
- [ ] "Permission denied" even with chmod 755
- [ ] Port assignments failing
- [ ] cPanel features not working
- [ ] Need SSH key-based auth setup

**Contact Meta When:**
- [ ] WhatsApp API returns errors
- [ ] Phone Number ID issues
- [ ] Access Token repeatedly fails
- [ ] Account limitations/approvals

**Check Resources First:**
- Node.js Docs: https://nodejs.org/docs
- Next.js Docs: https://nextjs.org/docs
- cPanel Docs: https://documentation.cpanel.net
- Meta Business Help: https://www.facebook.com/business/help

---

## Emergency Procedures

### Application Crashed

**Immediate Action:**
```bash
# SSH in and restart
ssh username@host
cd ~/public_html
npm start
```

### Rollback Previous Version

```bash
# If you have backups
cPanel > Backups > Restore

# Or manually rollback files from backup
tar -xzf ~/backups/berakhah-20260831.tar.gz -C ~/public_html
npm install --production
npm run build
npm start
```

### Manual Kill & Restart

```bash
# Find process
ps aux | grep node
# Get PID (e.g., 12345)

# Kill it
kill -9 12345

# Restart via cPanel or:
npm start
```

---

## Monitoring Setup

### Set Up Alerts (cPanel Recommended Features)

1. **CPU Alert**: cPanel > Resource Monitor > Threshold
2. **Disk Alert**: Automatically in cPanel
3. **Application Restart**: Use PM2 with auto-restart
4. **Email Alerts**: cPanel > Email > Alerts

### Monitoring Tools

```bash
# Monitor in real-time
watch -n 5 'ps aux | grep node; echo "---"; df -h ~/'

# Continuously check logs
tail -f logs/error.log
```

---

**Need More Help?**  
See: [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md) for complete guide  
Version: 1.0 | Last Updated: September 1, 2026
