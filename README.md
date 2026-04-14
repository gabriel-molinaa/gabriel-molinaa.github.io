<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy this app

This project can be deployed to GitHub Pages as a static Vite app.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Optionally set `GEMINI_API_KEY` in `.env.local` if you add Gemini usage in the frontend
3. Run the app:
   `npm run dev`

## GitHub Pages

This repository is configured to publish with GitHub Actions.

1. Push the repository to GitHub
2. In GitHub, open `Settings > Pages`
3. Set `Source` to `GitHub Actions`
4. Push to `main`

The workflow will build the app and publish the generated `dist` folder.

### Base path

- If the repository is a user site like `gabriel-molinaa.github.io`, no extra configuration is needed
- If the repository is a project site like `my-repo`, add a repository variable named `VITE_BASE_PATH` with value `/my-repo/`

### Routing

The app uses `HashRouter` so internal routes work on GitHub Pages without server-side rewrites.
