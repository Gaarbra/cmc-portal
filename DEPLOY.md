# Deploying to Namecheap

The app builds to plain static files (`dist/`), so it runs on any Namecheap
shared-hosting plan. `public/.htaccess` is copied into the build and handles
HTTPS redirects and page routing on Apache.

## Option A: upload by hand (5 minutes)

1. `npm install && npm run build`
2. In Namecheap, open **cPanel → File Manager → `public_html/`** (or the folder for
   your subdomain, e.g. `public_html/portal/` if you set up `portal.yourdomain.com`).
3. Upload **everything inside `dist/`**, including the hidden `.htaccess` file.
   (In File Manager, *Settings → Show Hidden Files* to see it.)
4. Turn on free SSL: **cPanel → SSL/TLS Status → Run AutoSSL**.

## Option B: deploy automatically from GitHub

`.github/workflows/deploy.yml` builds the site and uploads it over FTPS every
time `main` changes (or when you run it from the Actions tab).

1. In cPanel → **FTP Accounts**, create an account (e.g. `deploy@yourdomain.com`)
   whose directory is the site folder's parent (usually your home directory).
2. In GitHub → repo **Settings → Secrets and variables → Actions**, add:
   - `FTP_SERVER`: e.g. `ftp.yourdomain.com`
   - `FTP_USERNAME`: the FTP account name
   - `FTP_PASSWORD`: its password
3. Optional: add a repository **variable** `FTP_DIR` if the site isn't in
   `public_html/` (e.g. `public_html/portal/`).
4. Merge to `main`, or run **Actions → Deploy to Namecheap → Run workflow**.

Without the secrets the workflow still builds (so you'll know if something
broke) and skips the upload.

## Before going public

- The site runs in **preview mode on sample data**. It deliberately has no
  password field: a site outside cmc.edu must never collect CMC credentials.
- Fill in the real portal paths in `src/lib/links.ts` so the "Official portal"
  buttons go straight to the right pages.
- Real data needs a server-side component. Namecheap's Stellar Plus / Business
  plans include **cPanel → Setup Node.js App**, which can run it, but check CMC IT's
  policy before building it.
