import { useState, useEffect } from 'react';

const API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Interleaves photos from different authors using a round-robin strategy.
 *
 * The Picsum API returns photos sorted by ID, which causes photos from the
 * same author to appear in long consecutive runs (e.g. IDs 0-9 are all
 * "Alejandro Escamilla", IDs 10-19 are all "Paul Jarvis").
 *
 * This function groups photos by author and then picks one from each group
 * in turn, so different authors are distributed across the grid.
 *
 * No photo is added, removed, or duplicated — only the display order changes.
 */
function interleaveByAuthor(photos) {
  // Build a map of author -> [photos by that author]
  const authorGroups = new Map();
  photos.forEach((photo) => {
    if (!authorGroups.has(photo.author)) {
      authorGroups.set(photo.author, []);
    }
    authorGroups.get(photo.author).push(photo);
  });

  // Collect the groups as an array of queues
  const queues = Array.from(authorGroups.values());

  // Round-robin: take one photo from each queue in turn until all are empty
  const result = [];
  let remaining = queues.filter((q) => q.length > 0);
  while (remaining.length > 0) {
    remaining.forEach((queue) => {
      if (queue.length > 0) {
        result.push(queue.shift());
      }
    });
    remaining = remaining.filter((q) => q.length > 0);
  }

  return result;
}

/**
 * Custom hook that fetches 30 photos from the Picsum API once on mount.
 * Returns { photos, loading, error }.
 *
 * Photos are reordered using interleaveByAuthor() so that the same author
 * does not appear in long consecutive runs in the grid.
 *
 * Uses an AbortController so the in-flight request is cancelled if the
 * component using this hook unmounts before the fetch completes.
 */
function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to load photos (HTTP ${response.status})`);
        }

        const data = await response.json();

        // Guard against the API returning something that is not an array.
        // Interleave by author so the same author is not shown consecutively.
        setPhotos(Array.isArray(data) ? interleaveByAuthor(data) : []);
      } catch (err) {
        // AbortError is not a real failure — the component simply unmounted
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong. Please try again.');
        }
      } finally {
        // Only clear the loading flag when the request was not aborted
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    // Cancel the request if the component unmounts while it is still in flight
    return () => controller.abort();
  }, []); // Empty array: fetch runs exactly once on mount

  return { photos, loading, error };
}

export default useFetchPhotos;
