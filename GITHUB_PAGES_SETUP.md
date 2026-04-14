# GitHub Pages Setup Instructions

This PR enables GitHub Pages for the copilot-workshop repository. After merging this PR, follow these steps to complete the setup:

## 1. Enable GitHub Pages in Repository Settings

1. Go to the repository settings: `https://github.com/Customer-Workshops/copilot-workshop/settings/pages`
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Save the settings

## 2. Trigger the Deployment

The deployment workflow will automatically run when:
- Changes are pushed to the `main` branch
- Or manually triggered via the Actions tab

To manually trigger:
1. Go to Actions tab: `https://github.com/Customer-Workshops/copilot-workshop/actions`
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

## 3. Access the Workshop

Once deployed, the workshop will be accessible at:
**https://customer-workshops.github.io/copilot-workshop/**

## What This PR Includes

✅ **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
   - Automatically deploys to GitHub Pages on push to main
   - Uses the official GitHub Pages actions
   - Can be manually triggered via workflow_dispatch

✅ **.nojekyll File**
   - Prevents Jekyll processing of the static site
   - Ensures all files are served correctly

✅ **Updated README**
   - Added prominent link to the GitHub Pages URL
   - Updated "Getting Started" section to prioritize online access

## Verification

After deployment, verify:
- [ ] Main page loads: `https://customer-workshops.github.io/copilot-workshop/`
- [ ] Path 1 loads: `https://customer-workshops.github.io/copilot-workshop/github-copilot-workshop/start-coding.html`
- [ ] Path 2 loads: `https://customer-workshops.github.io/copilot-workshop/github-copilot-workshop/pro-features.html`
- [ ] All CSS/JS assets load correctly
- [ ] All images display correctly
- [ ] Navigation between pages works
- [ ] Theme toggle works
- [ ] Mobile responsiveness works

## Technical Details

- **No build process required**: Pure HTML/CSS/JS static site
- **All paths are relative**: Works both locally and on GitHub Pages
- **Deployment source**: Entire repository root
- **Branch**: Deploys from `main` branch
- **Assets**: All CSS, JS, and images are local (no CDN dependencies except Google Fonts)
