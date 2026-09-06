# 📋 Production Deployment Checklist

## Pre-Deployment (Before uploading to cPanel)

### Code Quality
- [ ] All linting errors fixed: `npm run lint`
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors in development: `npm run dev`
- [ ] No TypeScript errors
- [ ] All imports are correct
- [ ] Sensitive data removed from code

### Environment Setup
- [ ] `.env.local` created and NOT committed
- [ ] `.env.example` updated with all required variables
- [ ] `.gitignore` includes `.env.local` and `.next`
- [ ] `.gitignore` includes `node_modules`
- [ ] No API keys in code comments

### Content & Branding
- [ ] Logo updated (✓ logo.png in place)
- [ ] Favicon set (✓ configured in layout.tsx)
- [ ] Contact number updated (✓ 0757692495)
- [ ] All text is accurate and spell-checked
- [ ] Images optimized for web
- [ ] Social media links verified

### Security
- [ ] HTTPS certificate ready
- [ ] Security headers configured (in .htaccess)
- [ ] Rate limiting configured
- [ ] Form validation working
- [ ] XSS protection enabled
- [ ] CSRF protection implemented

### Testing
- [ ] Booking form tested locally
- [ ] Form validation working
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed
- [ ] All links working
- [ ] Images loading correctly
- [ ] Performance acceptable (Lighthouse score > 80)

---

## Hosting Setup (cPanel Configuration)

### Domain & DNS
- [ ] Domain registered and active
- [ ] cPanel account created
- [ ] Domain added to cPanel as Addon Domain
- [ ] DNS records configured
  - [ ] A record pointing to server IP
  - [ ] CNAME for www subdomain
- [ ] DNS propagation verified (use `nslookup` or online checker)

### SSL Certificate
- [ ] SSL certificate installed (AutoSSL or Let's Encrypt)
- [ ] HTTPS working without errors
- [ ] Certificate auto-renewal enabled
- [ ] Intermediate certificates installed
- [ ] Mixed content warnings resolved

### Node.js Configuration
- [ ] Node.js 18+ installed on hosting
- [ ] npm available and updated
- [ ] Node.js application created in cPanel
- [ ] Port assigned and noted
- [ ] Startup file set to `server.js` or `npm start`

### File Permissions
- [ ] `public_html` directory permissions: 755
- [ ] `.env.local` file permissions: 600
- [ ] `server.js` executable
- [ ] `node_modules` directory accessible

---

## Deployment Steps (To cPanel)

### Upload Files
- [ ] Source code uploaded/cloned to public_html
- [ ] `.env.local` created with production values
  - [ ] WHATSAPP_PHONE_NUMBER_ID set
  - [ ] WHATSAPP_ACCESS_TOKEN set
  - [ ] NODE_ENV set to `production`
  - [ ] NEXT_PUBLIC_APP_URL set
- [ ] All necessary files copied

### Dependencies & Build
- [ ] `npm install --production` completed
- [ ] `npm run build` completed without errors
- [ ] `.next` directory generated successfully
- [ ] No build warnings

### Application Start
- [ ] Application started via cPanel or SSH
- [ ] No errors in startup logs
- [ ] Application responding to requests
- [ ] Health check endpoint working: `/api/health`

---

## Post-Deployment Verification

### Website Functionality
- [ ] Website loads at https://berakhahgardens.co.ke
- [ ] All pages accessible
- [ ] Navigation working
- [ ] Mobile responsive on all screen sizes
- [ ] No JavaScript errors in console

### Booking Form
- [ ] Form displays correctly
- [ ] Form validation working
- [ ] Required fields enforced
- [ ] Submit button functional
- [ ] Success message displays after submit
- [ ] WhatsApp message received on 0757692495

### Performance
- [ ] Page load time < 3 seconds
- [ ] Images loading properly
- [ ] Animations smooth
- [ ] No broken links
- [ ] CSS and JavaScript fully loaded

### Security
- [ ] HTTPS redirect working
- [ ] Security headers present (check with curl)
- [ ] No directory listing
- [ ] Sensitive files protected
- [ ] Form submissions secure

---

## WhatsApp Integration

### API Credentials
- [ ] Meta Developer account active
- [ ] WhatsApp Business app created
- [ ] Phone number registered with WhatsApp
- [ ] Phone Number ID obtained
- [ ] Access Token generated
- [ ] Access Token added to `.env.local`
- [ ] Test API credentials with test request

### Testing
- [ ] Submit test booking from form
- [ ] Verify message received on WhatsApp
- [ ] Message contains all booking details
- [ ] Formatting is correct
- [ ] Links in message clickable (if any)

### Monitoring
- [ ] Check API usage dashboard
- [ ] Monitor for rate limit issues
- [ ] Set up error notifications
- [ ] Test fallback if API unavailable

---

## Monitoring & Maintenance

### Setup Monitoring
- [ ] cPanel Resource Monitor checked
- [ ] Error logs reviewed
- [ ] Access logs monitored
- [ ] CPU usage acceptable
- [ ] Memory usage acceptable
- [ ] Disk space sufficient

### Backups
- [ ] Automated backups configured
- [ ] Backup frequency: Daily
- [ ] Off-site backup locations verified
- [ ] Restore process tested
- [ ] Backup retention policy set

### Updates
- [ ] npm packages reviewed for updates
- [ ] Security patches applied
- [ ] Next.js updated if needed
- [ ] Node.js LTS version current
- [ ] SSL certificate auto-renewal working

---

## Documentation

### Server Information
- [ ] Server IP documented
- [ ] SSH access credentials saved securely
- [ ] cPanel login saved securely
- [ ] Domain registrar info documented
- [ ] Hosting provider support contact info saved

### Application Information
- [ ] Environment variables documented
- [ ] Database credentials stored securely (if used)
- [ ] API credentials stored securely
- [ ] Deployment process documented
- [ ] Rollback process documented

### Incident Response
- [ ] Escalation contacts identified
- [ ] Emergency rollback plan prepared
- [ ] Support documentation gathered
- [ ] Contact info for Meta support saved

---

## Sign-Off

- [ ] All items checked
- [ ] Ready for production deployment
- [ ] No known issues remaining

**Deployment Date**: _______________

**Deployed By**: _______________

**Verified By**: _______________

**Notes**: 
_________________________________________________________________
_________________________________________________________________

---

## Emergency Contacts

**Hosting Support**: 
**Domain Registrar**: 
**Meta Business Support**: https://www.facebook.com/business/help
**Emergency**: 

---

**Last Updated**: September 1, 2026
**Version**: 1.0
