# ESSFMB — English Speaking Skills For My BuBu

A personal, iPad-friendly English practice app for 25 October–31 December 2026, recreated with React, TypeScript and Vite after the original application source was missing from the repository.

The app includes a 68-day topic curriculum, ten checkpoint reflections, listening examples, browser speech recognition with typing fallback, vocabulary familiarity and favourites, review dates, a session checklist and timer, confidence ratings, a progress calendar, journal reflections, and JSON/CSV exports. Every lesson remains available after the programme ends. Programme dates use the Europe/Riga time zone.

## Development

Use Node.js 22.12 or newer (Node 24 is supported).

```sh
npm ci
netlify dev --port 8889
```

Open http://localhost:8889. Netlify Dev runs the Vite frontend and the progress API together. Running Vite alone does not emulate the progress API.

```sh
npm run typecheck
npm test
```

Netlify uses `npm run build` and publishes `dist`, as configured in `netlify.toml`. The production command runs TypeScript checks and Vite. Application sources are in `src`, with the entry point at `src/main.tsx`. Keep the complete source directory in the repository.

## Progress and backups

Saved sessions and vocabulary are stored in Netlify Database. An HttpOnly, same-site browser cookie links a browser to its records; there are no accounts or automatic cross-device synchronisation. Clearing cookies loses that browser's link to its records. Export a JSON backup regularly and import it on another browser to transfer progress. Import replaces saved data after confirmation and validates the file before sending it to the server. Backups are limited to 500 KB.

Select **Complete & save practice** to persist the timer, checklist, response, confidence rating and journal. Practice can be completed early or marked skipped. Leaving a lesson with unsaved changes prompts for confirmation. Word familiarity and favourites save when changed. Failed saves show an error and keep the current practice available for retry; initial loading failures block editing to avoid overwriting saved data.

The schema is in `db/schema.ts`, with generated migrations in `netlify/database/migrations`. Netlify applies migrations during deployment. Do not apply migrations manually. To add a future schema migration, edit the schema and run `npx drizzle-kit generate --name describe_the_change`.

## Speech and installation

Listening uses browser speech synthesis. Recognition requires browser support and microphone permission; a text area is always available. Browser speech recognition may use the browser provider's processing service. This app saves transcripts, not audio. A transcript is not a pronunciation score.

On iPad Safari, use **Share → Add to Home Screen**. The manifest and service worker provide an installable shell and cache previously loaded assets. Loading and saving progress require an internet connection. Google Fonts enhance typography; local serif and sans-serif fallbacks work if they cannot load.

## Validation

`npm run typecheck` checks the frontend, Vite configuration, database schema and server function without generating build artifacts. `npm test` checks all curriculum dates, assessment dates and valid/invalid backups. Full production builds and database migration application are performed by Netlify's deployment pipeline.
