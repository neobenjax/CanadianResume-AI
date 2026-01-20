# MapleLeaf Resume - Project Walkthrough

## 1. Project Overview
MapleLeaf Resume is a local-first, privacy-focused PWA designed to help users build Canadian-style resumes. It uses **Next.js 14**, **Tailwind CSS** (Northern Aurora Theme), and **Dexie.js** for offline storage.

## 2. Key Features Implemented

### User Interface (UI)
- **Theme**: "Northern Aurora" design language (Violet/Teal/Glassmorphism).
- **Components**: `GlassCard`, `NorthernButton`, `GlowInput`, `WizardShell`.
- **Layout**: Responsive sidebar layout for the dashboard.

### Data Layer
- **Local Database**: IndexedDB powered by `Dexie.js`.
- **Schema**: `UserProfile` (singleton) and `Resume` (one-to-many).
- **Hooks**: `useProfile`, `useResumes`, `useDebounce` for auto-saving.

### Onboarding Wizard
- **Step 1: Contact**: Validation for Canadian phone numbers, Province selector.
- **Step 2: Experience**: Dynamic list (add/remove) with STAR method prompts.
- **Step 3: Education**: Dynamic list for degrees/institutions.
- **Step 4: Skills**: Predictive autocomplete.

### Dashboard & Editor
- **Resume Management**: Create, Delete, List resumes.
- **Resume Editor**: `/dashboard/resumes/[id]`
    - **Header**: Title editing, AI toggle, Export button.
    - **Cloud Sync**: Google Drive integration (Backup/Restore).
    - **Export**: Client-side `.docx` generation.
    - **AI Tools**: "Canadianizer" UI (currently using mock data) to rewrite descriptions.

### Integration Services
- **Google Drive**: `DriveService` class for AppData folder access.
- **AI Service**: `generateResumeContent` (Client-side mock).
- **Export**: `DocxGenerator` using `docx` library.

## 3. How to Run
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## 4. Configuration
- **Google Drive Sync**: Requires `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`.

## 5. Next Steps
- Implement real AI API connection (OpenAI/Gemini).
- Finalize UI animations and mobile responsiveness.
- Verify offline capabilities.
