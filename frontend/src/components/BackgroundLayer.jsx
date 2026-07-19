// Create this new file to hold the fixed background
export const BackgroundLayer = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden will-change-transform">
    <div className="absolute inset-0 w-full h-full">
      <img 
        src="https://images.pexels.com/photos/8311882/pexels-photo-8311882.jpeg?_gl=1*1a397bu*_ga*MjE4MDQyODQ1LjE3ODQyNjczOTE.*_ga_8JE65Q40S6*czE3ODQyOTA1MjEkbzIkZzEkdDE3ODQyOTA2NzEkajE3JGwwJGgw"
        alt="Background"
        className="w-full h-full object-cover object-top opacity-80"
      />
      <div className="absolute inset-0 bg-black/70" />
    </div>
  </div>
);