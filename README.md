# Food Expiration Checker (Hackathon Project)

A hackathon app that helps decide whether food is still safe to donate, and
then points you to somewhere to donate it. Pick products from the catalog,
have an AI judge their safety past expiration, and find nearby food pantries
on a map.

## How it works

1. **Pick products** — the home page lists products stored in MongoDB
   (name, category, price, stock, expiration date). Categories are Dairy,
   Produce, Meat, Bakery, Starch, Beverages, Snacks, Frozen Foods, Medicine,
   and Poultry. Click items to move them into "Products to Validate".
2. **Validate** — "Validate Food Items" sends the selection to the backend,
   which asks OpenAI (`gpt-4o-mini`, structured output via Zod) to judge each
   item: safe or not, a "safe until" date, and a 3–5 sentence explanation
   considering refrigerability and donation (food can be safe to donate after
   its printed expiration). The judgments are returned to the frontend and
   shown with a green/red indicator per item; clicking a row shows its
   explanation.
3. **Find a pantry** — "Find Nearby Food Pantries" uses the browser's
   geolocation and the Google Places API (via the backend) to list nearby
   food pantries and soup kitchens, plotted on a Leaflet map.

## Demo mode (no backend needed)

If the app cannot reach the API, it falls back to built-in sample data
(`src/data/demoCatalog.js`) and the whole flow stays demonstrable: 8 sample
products with expiration dates relative to today, sample judgments in the
exact shape the backend returns, and 3 sample pantry pins near Washington
Square Park, New York. A banner across the top says the app is in demo mode.

The sample judgments are canned examples, **not safety assessments** — the
results section and the banner both say so. Never decide whether food is safe
to eat or donate from the demo. The live path (MongoDB catalog, OpenAI judge,
Google Places search) is unchanged and takes over whenever the backend
answers.

If the browser has no geolocation (denied or unavailable), the map centers on
the demo location instead of failing, and the pantry search falls back to it
as well.

## Layout

```
├── src/            React frontend (single Home page + components/hooks)
│   ├── pages/Home.jsx
│   ├── components/ ItemList, map (Leaflet), header, button, hoverBox
│   └── customHooks/ useFetchProducts, useCheckProducts, useFetchLocations
├── backend/        Express API on port 3000
│   ├── index.js              Auth0 login (express-openid-connect), MongoDB
│   ├── routes/               /product (list/create/check), /maps (nearby search)
│   ├── controllers/          productController, mapController
│   ├── schemas/              Product, ExpirationInfo (Mongoose)
│   └── OpenAI/checkProductExpiration.js   the GPT-4o-mini safety judge
└── public/         logo.webp, stock photos
```

The frontend talks to the backend at `http://localhost:3000` by default
(`src/config.js`; override with `VITE_API_URL` in `.env`). Auth0 login state
is shown at the backend root (`/` reports "Logged in" / "Logged out") and a
`/profile` route returns the Auth0 user.

> **Auth0 secret: rotate it.** `backend/index.js` contains a hardcoded Auth0
> client secret. Treat that value as leaked: rotate it in the Auth0
> dashboard, then move the Auth0 settings into environment variables (see
> `.env.example`). Do not reuse the committed value anywhere.

## Stack

- Frontend: React 18, Vite 6, Tailwind CSS 3, React Router 7, Leaflet,
  Motion, Font Awesome.
- Backend: Express 4, Mongoose 8 (MongoDB), OpenAI API, Google Places API,
  Auth0 (`express-openid-connect`).

## Run it locally

```bash
npm install
npm run dev        # Vite dev server, http://localhost:5173

# Backend (second terminal)
npm run server     # nodemon backend/index.js, http://localhost:3000
```

Other scripts: `npm run build` (`vite build`), `npm run preview`,
`npm run lint`.

### Environment variables

Put them in a `.env` at the repo root (`.env` is gitignored — never commit
it; see `.env.example`). The backend reads:

| Variable | Used for |
| --- | --- |
| `MONGO_URI_CONNECTION_STRING` | MongoDB connection string |
| `OPENAI_KEY` | OpenAI API key for the expiration judge |
| `VITE_GOOGLE_API_KEY` | Google Places API key for the pantry search |

The frontend reads `VITE_API_URL` (backend base URL, default
`http://localhost:3000`).

The Auth0 settings (client ID, issuer, secret) are currently hardcoded in
`backend/index.js`; they belong in environment variables instead — rotate
the secret in the Auth0 dashboard first, then wire it up (see the note
above).

### Tests

`backend/test/controllers.test.js` (Node's built-in test runner, no extra
deps) covers the backend fixes: the Places URL shape, the `_id` on
judgments, the empty-selection 400, and the judge-failure 500. Run it with
`npm test` from `backend/`.
It stubs `node-fetch` and `openai`, so no keys or database are needed.
