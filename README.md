# Partycule

Website for the Partycule DJ collective — built with Next.js and Sanity CMS.

---
## Prerequisites

Before you start, make sure you have installed:

- **Node.js** v20 or later — [nodejs.org](https://nodejs.org) (download the "LTS" version)
- **npm** — comes bundled with Node.js, no extra install needed

To check your versions, open a terminal and run:

```bash
node -v   # should print v20.x.x or higher
npm -v    # should print 10.x.x or higher
```

---

## 1. Clone the project

```bash
git clone <repo-url>
cd partycule-next
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Set up environment variables

The project needs a few secret keys to connect to Sanity (the CMS) and YouTube.

Create a file named `.env.local` at the root of the project:

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_write_token
YOUTUBE_API_KEY=your_youtube_api_key   # optional — only needed for YouTube metadata
```

Ask the project owner for the actual values. Never commit this file to Git (it is already in `.gitignore`).

---

## 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser — you should see the site.

The server hot-reloads: any file you save is reflected in the browser instantly without restarting.

---

## 5. Edit content via Sanity Studio

Sanity Studio is the visual back-office that lets you create and edit content **without touching any code**.

### Open the Studio

With the dev server running, go to:

[http://localhost:3000/studio](http://localhost:3000/studio)

You will be prompted to log in with your Sanity account. If you don't have one, create a free account
at [sanity.io](https://www.sanity.io) and ask the project owner to add you to the project.

### Navigate the Structure

On the left sidebar you will find the content sections (called **document types**):

| Section           | What it contains                                        |
|-------------------|---------------------------------------------------------|
| **Template**      | DJ set templates (title, description, schema, tutorial) |
| **Gallery Entry** | Videos shown in the gallery pages                       |
| **Media Asset**   | Reusable images / files                                 |

Click a section to see the list of existing documents. Click a document to open and edit it.

### Create a new document

1. Click the section you want (e.g. **Gallery Entry**).
2. Click the **pencil / create** button (top-right of the list).
3. Fill in the fields.
4. Click **Publish** (top-right of the editor) — until you publish, changes are saved as a draft and won't appear on the
   site.

### Edit an existing document

1. Click the section, then the document.
2. Make your changes.
3. Click **Publish** to apply them to the live site.

> **Tip:** The site fetches content at build time (static generation). In development (`npm run dev`) changes appear
> after a page refresh. In production a new deployment is needed.

---

## Useful commands

| Command         | What it does                             |
|-----------------|------------------------------------------|
| `npm run dev`   | Start local dev server at localhost:3000 |
| `npm run build` | Build the production bundle              |
| `npm run lint`  | Run the linter to catch code errors      |

---

## Project structure (quick map)

```
src/
  app/           # Next.js pages and routes
  sanity/        # Sanity client, config, and schema definitions
  lib/           # Data helpers (templates, gallery fixtures)
  components/    # Shared React components
sanity.config.ts # Sanity Studio configuration
```

---

## Troubleshooting

**The site loads but shows no content**
→ Check that `.env.local` exists and contains the correct `NEXT_PUBLIC_SANITY_PROJECT_ID` and
`NEXT_PUBLIC_SANITY_DATASET` values.

**Studio shows "Unauthorized"**
→ Make sure your Sanity account has been added to the project by the owner, and that `SANITY_WRITE_TOKEN` is set in
`.env.local`.

**`npm install` fails**
→ Make sure you are using Node.js v20+. Run `node -v` to check.
