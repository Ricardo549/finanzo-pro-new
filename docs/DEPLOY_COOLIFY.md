# Deploying Finanzo Pro to Coolify

This guide details how to deploy the application using your self-hosted Coolify instance.

## 1. Preparation
Ensure your code is pushed to your Git repository (GitHub/GitLab).

## 2. Create Resource in Coolify
1.  Go to your **Project** in Coolify.
2.  Click **+ New** -> **Git Repository**.
3.  Select your repository and branch (`main`).

## 3. Configuration
Coolify should automatically detect the `Dockerfile`. Check the following settings:

-   **Build Pack**: `Docker` (or `Docker Compose` if you prefer).
-   **Ports Exposes**: `80` (The Dockerfile exposes port 80).
-   **Domains**: Set your domain (e.g., `https://app.finanzo.pro`).

## 4. Environment Variables (Critical)
You MUST add the environment variables from your `.env.local` into the **Environment Variables** tab in Coolify.

| Key | Value Example | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://xyz.supabase.co` | Database URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Public API Key |
| `VITE_PLUGGY_CLIENT_ID` | `your_id` | Open Finance ID |
| `VITE_PLUGGY_CLIENT_SECRET` | `your_secret` | Open Finance Secret |
| `VITE_GOOGLE_ANALYTICS_ID` | `G-XXXXXX` | Google Analytics |
| `VITE_GOOGLE_ADSENSE_ID` | `ca-pub-XXXX` | AdSense Publisher ID |
| `VITE_GEMINI_API_KEY` | `AIza...` | Google Gemini AI Key |

> **Note**: Since this is a Vite app, these variables are needed at **BUILD TIME**.
> In Coolify, ensure these are available during the build phase. If "Build Variable" option exists, check it.

## 5. Deploy
1.  Click **Deploy**.
2.  Watch the "Build Logs".
3.  Once "Healthy", open your domain.

## Troubleshooting
-   **White Screen?** Check browser console. Likely missing env vars or base URL issues.
-   **Routing 404?** The `Dockerfile` is configured with `try_files` for React Router, so this should work automatically.
