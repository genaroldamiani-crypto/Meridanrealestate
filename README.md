# Meridian — Property Atelier

A multi-page static website for a fictional luxury real-estate agency. No build
step, no dependencies — HTML, CSS, and vanilla JavaScript. Deploys to Vercel as-is.

## Pages

| File            | Tab        | What's on it                                                   |
| --------------- | ---------- | -------------------------------------------------------------- |
| `index.html`    | Home       | Hero, live search, featured listings, services, testimonials   |
| `listings.html` | Properties | Search/filter grid with save-to-favourites                     |
| `property.html` | (detail)   | Gallery, mortgage calculator, book-a-viewing form              |
| `agents.html`   | Our Agents | Agent profiles                                                 |
| `contact.html`  | Contact    | Inquiry form + free-valuation form                             |
| `dashboard.html`| Portal     | Agent dashboard: leads, viewings, valuations, saved properties |

Shared styling lives in `assets/styles.css`; shared behaviour (search, filters,
favourites, mortgage calc, forms, dashboard) lives in `assets/app.js`.

Bookings, valuations, messages, and saved properties are demo-only — they
validate and persist to `localStorage`, and the dashboard aggregates them.

## Run locally

Static, so open `index.html`, or serve with `npx serve .`.

## Deploy to Vercel via GitHub

1. Create a GitHub repo and push (this folder is already a Git repo):

   ```bash
   git push -u origin main
   ```

2. Import at <https://vercel.com/new> — Framework: Other, Root Directory: `./`,
   build/output empty. Every push to `main` redeploys.
