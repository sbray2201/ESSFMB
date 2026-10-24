# ESSFMB — English Speaking Skills For My BuBu ❤️

A personal, iPad-friendly English practice app for October 25–December 31, 2026. Built with React, TypeScript and Vite. It includes a 68-day topic curriculum, speaking/listening practice, vocabulary status cards, session checklist and timer, assessments, progress calendar, journal, and local JSON/CSV exports.

## Run locally

1. Install Node.js 20 or newer.
2. Unzip this project and open a terminal in the `essfmb` folder.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL printed by Vite.
5. Before publishing, run `npm run build`. The production site is generated in `dist/`.

## Publish with GitHub and Netlify

1. Create a new empty repository on GitHub, for example `essfmb-english-learning`.
2. In this project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Build ESSFMB English learning app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/essfmb-english-learning.git
   git push -u origin main
   ```

3. Sign in to Netlify, choose **Add new site → Import an existing project**, and connect the GitHub repository.
4. Build command: `npm run build`. Publish directory: `dist`.
5. Deploy. Netlify will redeploy when you push later changes to GitHub.
6. Open the published URL on the iPad in Safari. Use **Share → Add to Home Screen** where available. The PWA manifest and service worker support installation/offline caching where the browser permits it.

## Data and privacy

Learning data is stored in this browser's local storage. It is not synced between devices. Clearing browser/site data can remove progress, so use **Settings & Backup → Download full JSON backup** regularly. Importing a backup replaces current local records after confirmation. CSV export is provided for session records.

Speech synthesis and speech recognition depend on the iPad browser, installed voices and permissions. The app feature-detects speech recognition and allows typing when it is unavailable. A transcript is not a pronunciation score. The app does not continuously record or upload audio.

## Important implementation notes

- Dates are represented as ISO calendar dates for the October 25–December 31 program and the current program date is read with the `Europe/Riga` time zone.
- The app remains accessible after December 31 so historic lessons can still be reviewed.
- The initial version uses local storage rather than cross-device sync or a backend.
- `netlify.toml` configures the Vite build, single-page app routing, and basic security headers.

## Testing checklist

After `npm install`, run `npm run build` and fix any TypeScript/build errors before deployment. Then test:

- The 68 dates from October 25 through December 31, 2026, and the checkpoint dates October 31, November 7/14/21/28, December 5/12/19/26 and December 31.
- Start, pause/resume, activity completion, early completion and skip status.
- Refreshing the browser and confirming local records persist.
- JSON export/import and CSV export.
- Vocabulary statuses, favourites, due dates and notebook search.
- Speech synthesis, speech recognition where supported, and manual typing fallback.
- iPad portrait and landscape layouts, PWA installation and offline reload.
- Netlify deep-link routing and access to historic lessons after December 31.

The source archive was generated in this environment, but a production build and live Netlify deployment have **not** been verified here. Run the build and test checklist above before relying on it.
