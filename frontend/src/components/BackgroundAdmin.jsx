import React from 'react';

export const BackgroundAdmin = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden will-change-transform">
    <div className="absolute inset-0 w-full h-full">
      <img 
        src="https://images.pexels.com/photos/8749403/pexels-photo-8749403.jpeg"
        alt="Warehouse Background"
        className="w-full h-full object-cover object-center opacity-80"
      />
      {/* Dark overlay with slight blur to make the form pop */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  </div>
);