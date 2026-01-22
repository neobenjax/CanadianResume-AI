# Project Documentation & Development Journey

## 1. Project Vision & Source Prompt

**Project Name**: MapleLeaf Resume (Codenamed: `CanadianResume-AI`)

### The Source Idea
The project was initiated with the goal of creating a **Local-First, Privacy-Focused Progressive Web Application (PWA)** specifically tailored for the Canadian job market. 

**Key Requirements from Initial Prompt:**
- **Privacy First**: No server-side storage of user data by default. Everything lives in the browser (IndexedDB).
- **Canadian Context**: "The Canadianizer" feature to ensure clarity, brevity, and standard Canadian spelling/formatting.
- **Offline Capability**: The app must function fully without an internet connection (editing, saving, exporting).
- **Google Drive Sync**: purely optional cloud backup to the user's own Drive (AppData folder).
- **Aesthetics**: "Northern Aurora" design theme—premium, glassmorphism, responsive.

## 2. Implementation Plan

The project was executed in distinct phases to ensure stability and feature completeness:

### Phase 1: Foundation (Completed)
- **Tech Stack**: Next.js 16, Tailwind CSS 4, Dexie.js (IndexedDB).
- **Design System**: Creation of the "Northern Aurora" theme variables, fonts, and core UI components (`GlassCard`, `NorthernButton`).
- **Routing**: Setup of the App Router structure (`/onboarding`, `/dashboard`, `/editor`).

### Phase 2: Core Logic (Completed)
- **Local Database**: Implementation of `db.ts` with Dexie for offline persistence.
- **Forms**: Complex multi-step wizard using `react-hook-form` and `zod` validation.
- **Resume Editor**: A live editor allowing users to modify specific sections of their resume.

### Phase 3: Advanced Features (Completed)
- **Google Drive Sync**: Implementation of `DriveService` for authenticating and syncing JSON backups.
- **Export Engine**: Client-side generation of `.docx` files formatted for ATS systems.
- **AI Integration**: Integration of Vercel AI SDK to power "The Canadianizer" (rewriting text for impact).

## 3. Development Journey: Interactions & Improvements

This section documents the specific challenges encountered and solved during the pair-programming sessions.

### 🐛 Bug Fixes & Technical Challenges

#### 1. Tailwind CSS Configuration
*   **Issue**: Initial setup encountered "Unknown at rule @tailwind" errors in `globals.css` due to Next.js 16 / Tailwind 4 compatibility.
*   **Resolution**: Updated `postcss.config.mjs` and ensured the correct Tailwind 4 alpha/beta dependencies were installed and configured in `next.config.ts`.

#### 2. Google Drive API Setup
*   **Issue**: Complexity in setting up the OAuth consent screen and obtaining the correct Client ID for a client-side only application.
*   **Resolution**:
    *   Walked through the creation of a Google Cloud Console project.
    *   Configured specific scopes (`https://www.googleapis.com/auth/drive.appdata`).
    *   Implemented the `DriveService` to handle token management and invisible file creation in the hidden App Data folder.

#### 3. Wizard State Management & Persistence
*   **Issue**: Users experienced data loss when navigating between wizard steps rapidly. The debounced "auto-save" mechanism created a race condition with the "load-on-mount" database logic, causing empty default states to overwrite existing data.
*   **Resolution**:
    *   **Architecture Shift**: Moved from "Auto-save as you type" to "Explicit Save on Navigation".
    *   **Refactor**: Updated `Contact`, `Experience`, `Education`, and all other steps/forms.
    *   **Logic**: Data is now strictly loaded on mount (with robust guards against accidental overwrites) and only saved to DexieDB when "Next" or "Back" buttons are clicked.

### 💡 Refinements & Improvements

#### 1. Experience Section Polish
*   **Context**: The initial experience form was too rigid.
*   **Improvements**:
    *   **Dynamic Locations**: Split "Location" into flexible Country/State/City fields to accommodate international work history (common for Canadian newcomers).
    *   **STAR Method**: Added dynamic tooling to guide users to write "Situation, Task, Action, Result" bullet points.
    *   **UI Cleanup**: Fixed contrast issues on dropdowns and spacing inconsistencies in the form array.

#### 2. AI Server Actions
*   **Context**: Initial AI features were mocked.
*   **Improvements**: Implemented real server actions using `src/services/ai/actions.ts`.
    *   Connects to OpenAI via Vercel AI SDK.
    *   Prompts specifically tuned to "Canadianize" text (British spelling, objective tone, removing personal pronouns).

#### 3. Profile Completeness
*   **Context**: Missing key sections like Volunteering and Certifications.
*   **Improvements**:
    *   Added `volunteering` and `certifications` arrays to the `UserProfile` schema (v3 migration).
    *   Implemented dedicated UI cards and Edit Modals for these sections in `ProfileView`.
    *   Integrated into the Wizard flow.

## 4. Current State

The application has reached **Version 1.1.0**. 

- **Status**: Stable & Deployment Ready.
- **Missing/WIP**: 
    - PDF Export native generation.
    - Additional Templates (Creative/Academic).
    - French Localization.

## 5. How to Contribute / Modify
Refer to `README.md` for installation instructions. This document serves as the historical context for *why* layout and architectural decisions were made.
