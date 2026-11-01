// Actions the reducer handles
export const TOGGLE_FAVOURITE = 'TOGGLE_FAVOURITE';

/**
 * Reads the initial favourites list from localStorage.
 * Returns an empty array if the stored value is missing, not valid JSON,
 * or not an array — so malformed data never crashes the app.
 */
export function getInitialFavourites() {
  try {
    const stored = localStorage.getItem('favourites');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Reducer for the favourites list.
 * State is an array of photo id strings.
 * TOGGLE_FAVOURITE adds the id if it is not present; removes it if it is.
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVOURITE: {
      const id = action.payload;
      const alreadyFavourited = state.includes(id);
      return alreadyFavourited
        ? state.filter((favId) => favId !== id)
        : [...state, id];
    }
    default:
      return state;
  }
}
