# Deployment Guide: StreetMoney Site

Follow these steps to deploy your site and connect it to your GoDaddy domain.

## 1. Hosting Options
Since this site uses a custom Node.js/Express backend and a SQLite database, you need a host that supports long-running processes.

### Recommended: Render.com (Simple & Free Tier available)
1. **GitHub**: Push your code to a private GitHub repository.
2. **Create Web Service**: In Render, click "New" -> "Web Service".
3. **Connect Repo**: Connect your StreetMoney repository.
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `node server.js`
6. **Persistence**: Under "Disk", create a persistent disk at `/mount/db` and update `database.js` to use that path (I can help you adjust this if you choose Render).

## 2. Connecting to GoDaddy
Once your site is live on Render (it will have a URL like `streetmoney.onrender.com`), connect your domain:

1. **GoDaddy DNS**: Log in to GoDaddy and open the **DNS Management** for your domain.
2. **Add CNAME Record**:
   - **Type**: CNAME
   - **Name**: `www`
   - **Value**: `your-subdomain.onrender.com` (rendered URL)
3. **Add A Record** (Optional, to point the root `@` to the non-www version):
   - Render will provide an IP address if you follow their custom domain setup guide.

## 3. Maintenance
- **Admin Dashboard**: Access via `yourdomain.com/admin`
- **Password**: Securely manage your password in the `AdminDashboard.jsx` or move it to a `.env` file for production.
- **Backups**: Periodically download `music.db` and the `public/uploads` folder to keep your data safe.

## 4. Environment Variables
On your hosting provider, set these variables:
- `PORT`: `3000` (or leave as default)
- `NODE_ENV`: `production`
