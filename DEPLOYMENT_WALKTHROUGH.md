# Deployment & Configuration Walkthrough

This guide provides a comprehensive, step-by-step walkthrough for deploying the **Canadian Resume AI** application to Vercel, linking it with GitHub, and configuring the necessary third-party services (OpenAI and Google).

---

## Prerequisites

Before starting, ensure you have accounts with:
1.  **[GitHub](https://github.com)** (for hosting your code)
2.  **[Vercel](https://vercel.com)** (for deploying the app)
3.  **[OpenAI Platform](https://platform.openai.com)** (for AI generation)
4.  **[Google Cloud Console](https://console.cloud.google.com)** (for Google Login/Drive)

---

## Phase 1: Getting Your API Keys

You need to gather your secrets before deploying.

### 1. Google Gemini API Key (for AI Features)
1.  Log in to [Google AI Studio](https://aistudio.google.com/).
2.  Click **Get API key** (usually on the left sidebar).
3.  Click **Create API key** -> **Create API key in new project** (or existing).
4.  **Important**: Copy the key. It starts with `AIza...` or similar.

### 2. Google OAuth Client ID (for Login & Drive)
1.  Go to the [Google Cloud Console](https://console.cloud.google.com).
2.  Create a **New Project** (e.g., "Resume Builder").
3.  Navigate to **APIs & Services > Credentials**.
4.  Click **+ CREATE CREDENTIALS** -> **OAuth client ID**.
5.  *If prompted, configure the "OAuth consent screen" first:*
    *   **User Type**: External.
    *   **App Name**: Canadian Resume AI.
    *   **User Support Email**: Your email.
    *   **Developer Contact Email**: Your email.
    *   Click **Save and Continue** (you can skip Scopes/Test Users for now).
6.  Back in "Create OAuth client ID":
    *   **Application type**: Web application.
    *   **Name**: "Vercel Deployment".
    *   **Authorized JavaScript origins**: Add `http://localhost:3000` (for local testing).
    *   **Authorized redirect URIs**: Add `http://localhost:3000` (Google does not allow just the domain here).
    *   *Note: We will add the Vercel URL here in Phase 4.*
7.  Click **Create**.
8.  Copy the **Client ID** (ends in `.apps.googleusercontent.com`).

---

## Phase 2: Connecting to GitHub

If your code is not yet on GitHub:

1.  Open your terminal in the project folder.
2.  Initialize Git (if not done): `git init`
3.  Commit your code:
    ```bash
    git add .
    git commit -m "Initial commit"
    ```
4.  Create a new repository on [GitHub.com](https://github.com/new).
5.  Follow the instructions to push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## Phase 3: Deploying to Vercel

1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  In the "Import Git Repository" list, find your repo (`CanadianResume-AI`) and click **Import**.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (Default).
    *   **Root Directory**: ./ (Default).
5.  **Environment Variables** (Crucial Step):
    Expand the "Environment Variables" section and add the keys you got in Phase 1:

    | Key | Value |
    | :--- | :--- |
    | `GOOGLE_GENERATIVE_AI_API_KEY` | Paste your Google Gemini API key here |
    | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Paste your Google Client ID here |

6.  Click **Deploy**.
7.  Wait for the build to complete (approx. 1-2 minutes).
8.  Once done, you will see a success screen with your **Deployment URL** (e.g., `https://canadian-resume-ai-xi.vercel.app`). **Copy this URL.**

---

## Phase 4: Finalizing Google Configuration

Now that you have your live URL, you need to tell Google it's safe.

1.  Return to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
2.  Click the **Pencil icon** to edit your OAuth 2.0 Client ID.
3.  **Authorized JavaScript origins**:
    *   Click "ADD URI".
    *   Paste your Vercel URL (e.g., `https://canadian-resume-ai-xi.vercel.app`).
    *   *Ensure there are no trailing slashes.*
4.  **Authorized redirect URIs**:
    *   Click "ADD URI".
    *   Paste your Vercel URL again (e.g., `https://canadian-resume-ai-xi.vercel.app`).
5.  Click **Save**.

---

## Phase 5: Testing

1.  Open your Vercel URL in a browser.
2.  **Test AI**: Create a resume and use the "Canadianize" feature.
3.  **Test Login**: Click "Sign in with Google".
    *   *If you see "Error 400: redirect_uri_mismatch", wait a few minutes for Google's settings to propagate, or double-check the URL in Console.*

**Congratulations! Your application is now live.**
