# Notes Frontend (Nuxt 3)

A modern, minimalistic notes organizer app with authentication, notes CRUD, search & filter, responsive layout, and organization via folders and tags.

- Sidebar for navigation and filters (All, Pinned, Untagged, Folders, Tags)
- Main area for note list and editor
- Header with global search and quick actions
- Light theme with primary (#1976d2), secondary (#424242), and accent (#e91e63)

## Features

- User authentication (demo): local storage-based login/registration
- Create, edit, delete notes
- Tags and folders organization
- Search by title/content/tag
- Pinned notes
- Responsive design

## Environment Variables

Create a `.env` file using the template below:

```
cp .env.example .env
```

Available variables:

- `NUXT_PUBLIC_APP_NAME` – App name shown in header
- `NUXT_PUBLIC_SITE_URL` – Base site URL (for metadata)
- `NUXT_PUBLIC_STORAGE_PREFIX` – Prefix for localStorage keys
- `NUXT_PUBLIC_DEMO_MODE` – Optional boolean flag (reserved)

## Setup

Install dependencies:

```bash
# npm
npm install
```

Run dev server at http://localhost:3000:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Security Notice

This frontend uses client-side localStorage for demo authentication and data persistence. Do not store real credentials or sensitive information. Integrate with a secure backend for production use.

## Project Structure

- `layouts/default.vue` – App shell (header, sidebar, main)
- `pages/login.vue` – Auth page
- `pages/index.vue` – Main page (content rendered via layout)
- `components/` – UI components (HeaderBar, SidebarNav, NoteList, NoteEditor)
- `composables/` – `useAuth`, `useNotes`, `useStorage`
- `types/` – TypeScript models
- `assets/css/main.css` – Global styles and theme

## License

MIT
