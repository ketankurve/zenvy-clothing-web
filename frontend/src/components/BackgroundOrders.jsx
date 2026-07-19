// Create this new file to hold the fixed background
export const BackgroundOrders = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden will-change-transform">
    <div className="absolute inset-0 w-full h-full">
      <img 
        src="https://images.pexels.com/photos/9176084/pexels-photo-9176084.jpeg"
        alt="Background"
        className="w-full h-full object-cover object-top opacity-80"
      />
      <div className="absolute inset-0 bg-black/80" />
    </div>
  </div>
);