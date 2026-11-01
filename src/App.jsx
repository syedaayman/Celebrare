import React from 'react';
import Gallery from './components/Gallery.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Photo Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Browse and favourite photos from Picsum
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Gallery />
      </main>
    </div>
  );
}

export default App;
