# Photo Gallery — Celebrare Frontend Intern Pre-Screening Assignment

A responsive photo gallery built with React, Vite, and Tailwind CSS.

## Features

- Fetches 30 photos from the [Picsum Photos API](https://picsum.photos/v2/list?limit=30)
- Real-time author name search (case-insensitive, partial match)
- Favourite / unfavourite photos with a heart button
- Favourites persist across page refreshes via `localStorage`
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
- Loading spinner, error message, and empty-results message

## Technology Stack

| Concern | Technology |
|---------|-----------|
| UI framework | React 19 (functional components) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| HTTP requests | Native Fetch API |
| State — favourites | `useReducer` |
| State — photos / loading / error | Custom hook `useFetchPhotos` (`useState` + `useEffect`) |
| Memoisation | `useCallback` (search handler), `useMemo` (filtered list) |
| Persistence | `localStorage` |

## Project Structure

```
src/
├── components/
│   ├── Gallery.jsx          # Main gallery with search, favourites, grid
│   └── PhotoCard.jsx        # Single photo card
├── hooks/
│   └── useFetchPhotos.js    # Custom hook — API call
├── reducers/
│   └── favouritesReducer.js # useReducer logic for favourites
├── App.jsx                  # Root component / layout
├── main.jsx                 # React entry point
└── index.css                # Tailwind import
```

## Installation and Local Development

**Prerequisites:** Node.js 18 or later.

```bash
# 1. Clone the repository
git clone <repo-url>
cd celebrare-photo-gallery

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Production Build

```bash
npm run build
npm run preview   # optional: serve the built files locally
```

## Key Implementation Notes

- **`useFetchPhotos`** (`src/hooks/useFetchPhotos.js`): fetches photos once on mount; uses `AbortController` to cancel the request if the component unmounts before it completes.
- **`favouritesReducer`** (`src/reducers/favouritesReducer.js`): handles `TOGGLE_FAVOURITE` action; read from / written to `localStorage` outside the reducer to keep reducer logic pure.
- **`useCallback`** (`Gallery.jsx`, `handleSearchChange`): stabilises the search input handler across renders.
- **`useMemo`** (`Gallery.jsx`, `filteredPhotos`): recomputes the filtered photo list only when `photos` or `query` changes.
