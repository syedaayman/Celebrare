import React, { useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos.js';
import {
  favouritesReducer,
  getInitialFavourites,
  TOGGLE_FAVOURITE,
} from '../reducers/favouritesReducer.js';
import PhotoCard from './PhotoCard.jsx';

function Gallery() {
  // ---------- Data fetching ----------
  const { photos, loading, error } = useFetchPhotos();

  // ---------- Search ----------
  const [query, setQuery] = useState('');

  // useCallback: memoises the input change handler so it is not recreated
  // on every render. Dependency array is empty because the handler only
  // calls the state setter, which is stable.
  const handleSearchChange = useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  // useMemo: recalculates the filtered list only when photos or query change.
  // This avoids filtering the full array on every unrelated re-render.
  const filteredPhotos = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return photos;
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    );
  }, [photos, query]);

  // ---------- Favourites (managed with useReducer, NOT useState) ----------
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,          // we skip the plain initialState argument…
    getInitialFavourites // …and use this initialiser function instead
  );

  // Persist favourites to localStorage whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem('favourites', JSON.stringify(favourites));
    } catch {
      // Ignore write failures (e.g. private browsing with storage disabled)
    }
  }, [favourites]);

  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: TOGGLE_FAVOURITE, payload: id });
  }, []);

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
        {/* Spinning circle */}
        <svg
          className="animate-spin w-10 h-10 text-rose-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <p className="text-sm">Loading photos…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2 text-center text-gray-600">
        <p className="text-lg font-medium text-red-600">Could not load photos</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm text-gray-400">
          Check your internet connection and refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search input */}
      <div className="mb-6">
        <label htmlFor="author-search" className="block text-sm font-medium text-gray-700 mb-1">
          Search by author
        </label>
        <input
          id="author-search"
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="e.g. Alejandro"
          className="w-full sm:w-72 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
        />
      </div>

      {/* No results message */}
      {filteredPhotos.length === 0 && (
        <p className="text-gray-500 text-sm py-8">
          {photos.length === 0
            ? 'No photos were returned by the API.'
            : `No photos found matching "${query.trim()}".`}
        </p>
      )}

      {/* Photo grid: 1 column on mobile, 2 on tablet (sm), 4 on desktop (lg) */}
      {filteredPhotos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourited={favourites.includes(photo.id)}
              onToggle={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
