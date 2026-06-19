<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/dda391d7-cf69-495d-9479-c67db4db1779

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Joomla deployment

This project is a static React + Vite site. The simplest way to publish it in Joomla is:

1. Build the site:
   `npm run build`
2. Upload the contents of `dist/` to a folder inside Joomla, for example:
   `/public_html/cbdas/`
3. In Joomla, choose one of these options:
   - Add a menu item pointing directly to `/cbdas/`
   - Embed `/cbdas/` in an iframe inside an article or custom module

Notes:

- The build now uses relative asset paths by default, which is safer for Joomla subfolders.
- If you want to force a specific base path, build with:
  `VITE_BASE_PATH=/cbdas/ npm run build`
- This project does not require a Node.js server in production if you only use the static frontend.
