# Google Integrations Setup

To enable Google Analytics and Google AdSense, you must provide your keys in the environment variables.

## 1. Google Analytics (GA4)
1. Go to [Google Analytics](https://analytics.google.com/).
2. Create a property or select an existing one.
3. Go to **Admin > Data Streams > Web**.
4. Copy the **Measurement ID** (Format: `G-XXXXXXXXXX`).
5. Add it to your `.env.local` file:
   ```bash
   VITE_GOOGLE_ANALYTICS_ID=G-AB12345678
   ```

## 2. Google AdSense
1. Go to [Google AdSense](https://adsense.google.com/).
2. Go to **Account > Settings > Account Information**.
3. Copy the **Publisher ID** (Format: `ca-pub-XXXXXXXXXXXXXXXX`).
4. Add it to your `.env.local` file:
   ```bash
   VITE_GOOGLE_ADSENSE_ID=ca-pub-1234567890123456
   ```

## 3. Google Gemini (AI)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key**.
3. Create a key for "Gemini API".
4. Add it to your `.env.local` file:
   ```bash
   VITE_GEMINI_API_KEY=AIzaSy...
   ```

## Security
- **Never commit `.env.local` to Git.** It is already ignored in `.gitignore`.
- If keys are missing, the scripts will **not** be loaded, preventing errors during development.
