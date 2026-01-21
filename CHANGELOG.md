# Changelog

All notable changes to the **MapleLeaf Resume** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] / Work in Progress
- Support for PDF export (currently DOCX only).
- Additional resume templates (Creative, Modern).
- Full French language localization.

## [1.0.0] - 2026-01-20
### Added
- **AI Integration**: implemented `src/services/ai/actions.ts` using Vercel AI SDK to offer "Canadianizer" improvements for resume text.
- **Google Drive Sync**: Implemented `DriveService` for secure, private backups to the user's AppData folder on Google Drive.
- **Export Functionality**: Client-side generation of `.docx` files using the `docx` library.
- **Onboarding Wizard**: Complete 6-step guided form for creating a new profile.
- **Dashboard**: CRUD operations for managing multiple resumes.
- **Experience Section**:
  - Dynamic list management for job achievements.
  - "STAR Method" (Situation, Task, Action, Result) helper tooltips.
  - Flexible location fields (Country, State, City) for international compatibility.
- **Design System**: "Northern Aurora" theme implementation with Tailwind CSS 4 variables and glassmorphism effects.
- **Onboarding Improvements**:
  - Implemented auto-redirect to Dashboard for returning users.
  - Added "Clean Slate" functionality: "Create My Profile" now ensures a fresh start by clearing previous local data.

### Fixed
- Resolved Tailwind CSS `@tailwind` directive errors in `globals.css` configuration.
- Improved color contrast on dropdown menus for better accessibility.
- Fixed layout issues in the Experience section form fields.

### Changed
- Migrated local storage to `Dexie.js` for robust IndexedDB management.
- Standardized UI components (Buttons, Inputs, Cards) in `src/components/ui`.
