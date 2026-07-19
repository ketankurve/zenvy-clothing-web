// Create this new file to hold the fixed background
export const BackgroundDelivery = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden will-change-transform">
    <div className="absolute inset-0 w-full h-full">
      <img 
        src="https://images.pexels.com/photos/7985813/pexels-photo-7985813.jpeg"
        alt="Background"
        className="w-full h-full object-cover object-top opacity-80"
      />
      <div className="absolute inset-0 bg-black/70"/>
    </div>
  </div>
);