import React from 'react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Spinner Animation */}
        <div className="flex justify-center items-center space-x-2 animate-bounce">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
        </div>

        {/* Branding */}
        <p className="text-xl font-semibold text-gray-800 mt-4">
          Loading <span className="text-orange-500">MOCCA</span>...
        </p>
        <p className="text-sm text-gray-500">Your stylish men's clothing awaits!</p>
      </div>
    </div>
  );
}

export default Loading;
