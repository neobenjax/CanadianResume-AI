# MapleLeaf Resume 🍁

**MapleLeaf Resume** (codenamed `CanadianResume-AI`) is a modern, privacy-first Progressive Web Application (PWA) designed to help users create impactful resumes tailored for the Canadian job market. 

Built with **Next.js 16**, **Tailwind CSS 4**, and **Local-First** principles, it ensures your data stays on your device while offering powerful AI enhancements and cloud backups when you need them.

## 🚀 Features

- **🍁 The Canadianizer**: AI-powered content enhancements to align with Canadian resume standards (Clarity, Brevity, Impact).
- **🔒 Local-First Privacy**: All data is stored locally in your browser using IndexedDB (via Dexie.js). No account required to start.
- **☁️ Google Drive Sync**: Optional secure backup and synchronization to your personal Google Drive.
- **✨ Northern Aurora Design**: A stunning, responsive UI featuring glassmorphism and smooth animations.
- **📝 Smart Editor**: 
  - 6-step Onboarding Wizard.
  - Real-time validation using Zod.
  - Dynamic "STAR Method" guidance for experience entries.
- **📄 Export to DOCX**: Generate ATS-friendly Word documents directly from the browser.
- **📶 Offline Capable**: Fully functional without an internet connection (except for AI features).

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Database**: Dexie.js (IndexedDB)
- **AI**: Vercel AI SDK (OpenAI)
- **Forms**: React Hook Form, Zod
- **Sync**: Google Drive API

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed.
- (Optional) OpenAI API Key for AI features.
- (Optional) Google Cloud Client ID for Drive sync.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/CanadianResume-AI.git
    cd CanadianResume-AI
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```bash
    # For Google Drive Sync (Optional)
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

    # For AI Features (Optional)
    OPENAI_API_KEY=sk-your-openai-key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚧 Project Status & Roadmap

**Status**: ✅ Core V1.0 Complete

The fundamental architecture and planned feature set for the initial release are complete.

### Work in Progress (WIP) / Missing Features

While the app is fully functional, the following features are identified for future updates:

- [ ] **PDF Export**: Currently supports DOCX. Native PDF generation is a planned addition.
- [ ] **Multiple Templates**: Currently "Standard Professional". Adding "Creative" and "Academic" layouts.
- [ ] **Cover Letter Generator**: AI-assisted cover letter creation based on the resume content.
- [ ] **French Language Support**: Localization for full English/French bilingual support.
- [ ] **Mobile View Optimization**: Further refinement for complex editing on small screens.

## 📄 License

This project is open-source and available under the MIT License.
