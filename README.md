# Leadedge Consults

Multi-page marketing site for Leadedge Consults, built with Vite (vanilla HTML/CSS/JS).

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Contact form

The form posts to Formspree. To activate it:

1. Create a free form at https://formspree.io (point it at leadedge.Consult@aol.com).
2. Copy the endpoint (`https://formspree.io/f/xxxxxxxx`) into `FORM_ENDPOINT` at the top
   of the contact-form section in `src/main.js`.
3. Rebuild and redeploy.

Until the endpoint is configured, the form validates input and shows the thank-you
panel without sending anything.

## Deploying to a VPS (Contabo)

The build output in `dist/` is fully static — serve it with nginx.

```bash
# on your machine
npm run build

# copy dist/ to the server
scp -r dist/* user@YOUR_VPS_IP:/var/www/leadedge/
```

Nginx site config (`/etc/nginx/sites-available/leadedge`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/leadedge;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # long cache for hashed assets, standard for images
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/leadedge /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# free HTTPS via Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Notes

- Page images live in `public/assets/` and are copied into `dist/assets/` on build.
  To swap any image, replace the file (same name) and rebuild.
- The intro loader plays in full on the first visit of a browser session and as a
  short version on subsequent page loads (see `le-return` logic in `src/main.js`).
