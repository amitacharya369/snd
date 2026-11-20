# Signs & Decal Corp. (S+D) — Production Deployment & Rollback Guide

This guide details deployment options, environment configuration, SSL/TLS setup, and rollback procedures for Signs & Decal Corp.

---

## 1. Hosting Target Options

The Signs & Decal Corp. web platform is a standard Next.js application designed to run on any modern cloud hosting environment:

### Option A: Vercel (Recommended for Automated Edge Delivery)
1. Link the repository (`SND`) to your Vercel organization.
2. Set Framework Preset: `Next.js`.
3. Add Production Environment Variables (see Section 2 below).
4. Deploy with automatic SSL, Edge caching, and zero-configuration SSR.

### Option B: Self-Hosted Node.js / Docker on Linux (Ubuntu / RHEL)
1. Provision a Linux VPS or container (AWS EC2 / ECS / DigitalOcean).
2. Install Node.js 22.x and PM2 process manager:
   ```bash
   sudo npm install -g pm2
   ```
3. Clone repository and install dependencies:
   ```bash
   cd /var/www/signsanddecal
   npm ci --production
   npm run build
   ```
4. Start with PM2:
   ```bash
   pm2 start npm --name "snd-web" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```
5. Configure Nginx as an SSL reverse proxy with HTTP to HTTPS redirection (see Section 3).

---

## 2. Production Environment Variables

Configure these variables in your hosting provider's dashboard (never commit these to Git):

| Variable | Required | Example / Description |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.signsanddecal.com` |
| `SMTP_HOST` | Recommended | `smtp.sendgrid.net` (or Postmark / AWS SES) |
| `SMTP_PORT` | Recommended | `587` |
| `SMTP_SECURE` | Recommended | `false` |
| `SMTP_USER` | Recommended | `apikey` |
| `SMTP_PASS` | Recommended | `SG.xxxxxxxxxxxxxxxxxxxx` |
| `MAIL_FROM` | Recommended | `inquiries@signsanddecal.com` |
| `MAIL_TO` | Recommended | `salesteam@signsanddecal.com` |

> [!NOTE]
> If SMTP credentials are not yet supplied at launch, the application operates safely in **Audit Logging Mode**, writing all submitted inquiries to `.inquiries_log/inquiries_audit.jsonl` and presenting an honest message to the submitter.

---

## 3. Reverse Proxy & SSL Configuration (Nginx Example)

```nginx
server {
    listen 80;
    server_name signsanddecal.com www.signsanddecal.com;
    return 301 https://www.signsanddecal.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.signsanddecal.com;

    ssl_certificate /etc/letsencrypt/live/signsanddecal.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/signsanddecal.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Rollback & Disaster Recovery Procedures

### Instant Rollback via Vercel
- Navigate to Deployments in the Vercel dashboard.
- Select the previous stable deployment and click **Promote to Production**. Rollback takes effect in under 5 seconds.

### Self-Hosted PM2 Rollback
1. Keep the previous build folder or Git tag:
   ```bash
   git checkout tags/v1.0.0-stable
   npm ci
   npm run build
   pm2 restart snd-web
   ```
2. Verify production status:
   ```bash
   curl -I https://www.signsanddecal.com
   node scratch/verify_all.mjs
   ```

---

## 5. Google Search Console & DNS Launch Checklist

1. **DNS Verification:** Configure `@` and `www` CNAME / A records to point to the designated hosting provider.
2. **Canonical Hostname:** Ensure `http://` redirects to `https://` and non-www (`signsanddecal.com`) redirects to `https://www.signsanddecal.com`.
3. **Google Search Console (GSC):**
   - Add property: `https://www.signsanddecal.com/`.
   - Submit sitemap: `https://www.signsanddecal.com/sitemap.xml`.
   - Monitor URL inspection and mobile indexing coverage.
