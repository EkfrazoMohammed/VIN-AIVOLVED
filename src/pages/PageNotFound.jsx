import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;