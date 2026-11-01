import React from 'react';

/**
 * Displays a single photo with its author name and a favourite toggle button.
 * Props:
 *   photo        - the photo object from the API { id, author, download_url, ... }
 *   isFavourited - boolean, whether this photo is currently in the favourites list
 *   onToggle     - callback called with the photo id when the heart button is clicked
 */
function PhotoCard({ photo, isFavourited, onToggle }) {
  // Use a sized Picsum URL so images load quickly and render at a consistent
  // resolution. The download_url on the API response points to the original
  // full-resolution file (up to 5000 × 3333 px), which is unnecessarily large
  // for a thumbnail grid. Building the URL from photo.id gives the same image
  // at a card-appropriate size.
  const imgSrc = `https://picsum.photos/id/${photo.id}/400/300`;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col">
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={`Photo by ${photo.author}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex items-center justify-between px-3 py-2 gap-2">
        <p
          className="text-sm text-gray-800 font-medium truncate"
          title={photo.author}
        >
          {photo.author}
        </p>

        <button
          type="button"
          onClick={() => onToggle(photo.id)}
          aria-label={
            isFavourited
              ? `Remove ${photo.author} from favourites`
              : `Add ${photo.author} to favourites`
          }
          aria-pressed={isFavourited}
          className="flex-shrink-0 p-1 rounded focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors"
        >
          {isFavourited ? (
            /* Filled heart — photo is favourited */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-rose-500"
              aria-hidden="true"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            /* Outlined heart — photo is not favourited */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400 hover:text-rose-400 transition-colors"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default PhotoCard;
