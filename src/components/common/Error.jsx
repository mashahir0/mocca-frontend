import React from 'react';

function Error({error}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Animated Emoji */}
      <div className="text-6xl animate-bounce">😢</div>

      {/* Error Message */}
      <h1 className="text-3xl font-bold text-gray-800 mt-4">Oops! Something went wrong.</h1>
      {error &&    <p className="text-gray-500 mt-2 text-center">
        {error}
      </p>}
      <p className="text-gray-500 mt-2 text-center">
        We're having some trouble processing your request. <br />
        Please try again later.
      </p>

      {/* Retry Button */}
      <button
        className="mt-6 px-6 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition-all duration-300"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}

export default Error;
