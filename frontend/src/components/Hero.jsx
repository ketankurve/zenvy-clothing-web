import React from 'react';

export default function Hero() {
  return (
    <section className="relative w-full h-[75vh] bg-gray-100 overflow-hidden">
      {/* Background Image (Placeholder - Replace src with your actual image asset URL) */}
      <img 
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600" 
        alt="Fashion Banner" 
        className="w-full h-full object-cover object-center"
      />
      
      {/* Overlay Text Content */}
      <div className="absolute inset-0 bg-black/5 flex items-end justify-between px-12 pb-16">
        <h1 className="text-white text-4xl font-light tracking-wide drop-shadow-sm">
          Fashion Make Simple
        </h1>
        <button className="bg-white text-black text-xs font-medium tracking-wider px-8 py-3 uppercase hover:bg-black hover:text-white transition duration-300">
          Shop Now
        </button>
      </div>
    </section>
  );
}