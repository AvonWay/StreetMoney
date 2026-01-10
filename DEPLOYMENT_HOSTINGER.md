# Deploying to Hostinger (Shared Hosting)

Hostinger's "Shared" and "Cloud" hosting plans often include a "Node.js" feature in hPanel. This guide assumes you are using that feature.

## 1. Preparation (Done automatically by me)
I have updated `server.js` to be robust for Hostinger's environment.

## 2. Build the Project
Before uploading, you need a fresh production build.
1. Open your terminal in VS Code.
2. Run:
   ```powershell
   npm run build
   ```
   *This creates a `dist` folder with your optimized site.*

## 3. Zip Your Files
Select the following files/folders and zip them into `site.zip`:
- `dist` (folder)
- `public` (folder)
- `server.js` (file)
- `database.js` (file)
- `package.json` (file)
- `.env` (file - *optional if you want to set env vars in hPanel instead*)

**Do NOT zip `node_modules`.** You will install dependencies on likely Hostinger.

## 4. Hostinger hPanel Setup
1. Log in to Hostinger hPanel.
2. Go to **Websites** -> **Manage** for your domain.
3. Search for **Node.js** in the sidebar.
4. **Create Application**:
   - **Node.js Version**: Choose `18` or `20` (Recommend 20).
   - **Application Mode**: `Production`.
   - **Application Root**: `public_html/api` (or just `public_html` if it's the only thing on the site). *Let's assume `public_html` for root domain.*
   - **Startup File**: `server.js`
   - Click **Create**.

## 5. Upload & Install
1. Click **File Manager** (in hPanel).
2. Navigate to your Application Root (e.g., `public_html`).
3. Delete any default files if empty.
4. Upload `site.zip` and **Extract** it there.
5. Go back to the **Node.js** page in hPanel.
6. Click the **NPM Install** button. This will read your `package.json` and install dependencies.

## 6. Access Your Site
Visit your domain. Your site should be live!

## "Do I have to remove from free plans?"
**No.** Leaving your site on Render (or other free tiers) is fine.
- **DNS**: The only thing that matters is where your Domain (GoDaddy/Hostinger) points.
- If you update your Nameservers to Hostinger, traffic goes there. The old Render site just sits idle.
- You can delete the Render service later if you want to tidy up, but it's not required for the new site to work.
