import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  // Track which dropdown is currently active ('men', 'woman', or null)
  const [activeMenu, setActiveMenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 50) {
        setIsHidden(true);
        setActiveMenu(null); // Close dropdowns on scroll hide
      } else {
        setIsHidden(false);
      }
    };

    // Close dropdowns if the user clicks outside the navigation container
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null); // Close if clicked again
    } else {
      setActiveMenu(menuName); // Open targeted menu
    }
  };

  // Mock structures matching the column layouts in your reference image
  const menCategories = [
    { title: "Topwear", items: ["T-Shirts", "Casual Shirts", "Formal Shirts", "Sweatshirts", "Jackets"] },
    { title: "Bottomwear", items: ["Jeans", "Casual Trousers", "Formal Trousers", "Shorts"] },
    { title: "Footwear", items: ["Casual Shoes", "Sports Shoes", "Formal Shoes", "Sneakers"] },
    { title: "Accessories", items: ["Wallets", "Belts", "Perfumes", "Watches"] }
  ];

  const womanCategories = [
    { title: "Indian & Festive", items: ["Kurtas & Suits", "Sarees", "Ethnic Wear", "Lehengas"] },
    { title: "Western Wear", items: ["Dresses", "Tops", "Tshirts", "Jeans", "Trousers & Skirts"] },
    { title: "Footwear", items: ["Flats", "Heels", "Casual Shoes", "Sports Shoes"] },
    { title: "Lingerie & Sleepwear", items: ["Bra", "Briefs", "Sleepwear", "Loungewear"] }
  ];

  return (
    <>
      <header 
        // Added a subtle dark gradient at the top so the header text is always readable over images
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-8 py-6 transition-all duration-500 ease-in-out ${
          isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        
        {/* Navigation Links */}
        <nav ref={navRef} className="flex items-center space-x-8 text-sm font-medium text-[#F5F1E8]/90">
          
          {/* Men Navigation Item */}
          <div 
            onClick={() => toggleMenu('men')} 
            className={`relative cursor-pointer flex items-center gap-1.5 transition-colors hover:text-white select-none ${activeMenu === 'men' ? 'text-white' : ''}`}
          >
            <span className="tracking-wide">Men</span>
            <span className={`text-[10px] text-white/60 transition-transform duration-300 ${activeMenu === 'men' ? 'rotate-180 text-[#D2B48C]' : ''}`}>▼</span>
            
            {/* Mega Dropdown Panel for Men */}
            {activeMenu === 'men' && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                // Luxury dark frosted glass theme with deep shadows
                className="absolute top-full left-0 mt-8 bg-[#2C2420]/95 backdrop-blur-2xl text-[#F5F1E8] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-[#F5F1E8]/10 p-10 grid grid-cols-4 gap-12 w-[800px] pointer-events-auto rounded-[1rem] cursor-default transform origin-top animate-in fade-in slide-in-from-top-4 duration-300"
              >
                {menCategories.map((col, idx) => (
                  <div key={idx} className="flex flex-col space-y-4 text-left">
                    {/* Editorial Eyebrow Header */}
                    <h5 className="text-[#D2B48C] font-bold text-[10px] tracking-[0.25em] uppercase border-b border-[#F5F1E8]/10 pb-2 mb-2">
                      {col.title}
                    </h5>
                    {col.items.map((item, itemIdx) => (
                      <Link 
                        to={`/shop/men/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        key={itemIdx} 
                        onClick={() => setActiveMenu(null)}
                        // Subtle animated underline effect for luxury feel
                        className="text-sm text-[#F5F1E8]/70 hover:text-white font-light transition-colors duration-300 relative group/link w-fit"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#A05D46] transition-all duration-300 group-hover/link:w-full" />
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Woman Navigation Item */}
          <div 
            onClick={() => toggleMenu('woman')} 
            className={`relative cursor-pointer flex items-center gap-1.5 transition-colors hover:text-white select-none ${activeMenu === 'woman' ? 'text-white' : ''}`}
          >
            <span className="tracking-wide">Woman</span>
            <span className={`text-[10px] text-white/60 transition-transform duration-300 ${activeMenu === 'woman' ? 'rotate-180 text-[#D2B48C]' : ''}`}>▼</span>

            {/* Mega Dropdown Panel for Woman */}
            {activeMenu === 'woman' && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                // Luxury dark frosted glass theme with deep shadows
                className="absolute top-full left-0 mt-8 bg-[#2C2420]/95 backdrop-blur-2xl text-[#F5F1E8] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-[#F5F1E8]/10 p-10 grid grid-cols-4 gap-12 w-[800px] pointer-events-auto rounded-[1rem] cursor-default transform origin-top animate-in fade-in slide-in-from-top-4 duration-300"
              >
                {womanCategories.map((col, idx) => (
                  <div key={idx} className="flex flex-col space-y-4 text-left">
                    {/* Editorial Eyebrow Header */}
                    <h5 className="text-[#D2B48C] font-bold text-[10px] tracking-[0.25em] uppercase border-b border-[#F5F1E8]/10 pb-2 mb-2">
                      {col.title}
                    </h5>
                    {col.items.map((item, itemIdx) => (
                      <Link 
                        to={`/shop/woman/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        key={itemIdx} 
                        onClick={() => setActiveMenu(null)}
                        // Subtle animated underline effect for luxury feel
                        className="text-sm text-[#F5F1E8]/70 hover:text-white font-light transition-colors duration-300 relative group/link w-fit"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#A05D46] transition-all duration-300 group-hover/link:w-full" />
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer absolute left-1/2 -translate-x-1/2">
          <Link to="/"> 
            <span className="text-2xl font-light tracking-[0.2em] text-[#F5F1E8] drop-shadow-md hover:text-[#D2B48C] transition-colors duration-300">
              ZENVY
            </span>
          </Link> 
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-white/5 border border-white/10 backdrop-blur-md text-xs px-5 py-2 rounded-full focus:bg-white/10 focus:border-[#A05D46]/50 focus:outline-none w-52 text-[#F5F1E8] placeholder-[#F5F1E8]/50 transition-all duration-300"
            />
          </div>
          
          {/* Icons */}
          <div className="flex items-center space-x-4 text-[#F5F1E8]/90">
            <button className="hover:text-[#D2B48C] transition-colors p-1.5 rounded-full hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            
            <Link to="/Cart" className="hover:text-[#D2B48C] transition-colors p-1.5 rounded-full hover:bg-white/5 relative">  
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {/* Optional: Tiny notification dot for items in cart */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#A05D46] rounded-full border border-black"></span>
            </Link>
            
            <button className="hover:text-[#D2B48C] transition-colors p-1.5 rounded-full hover:bg-white/5">
              <Link to="/wishlist"> 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </Link>  
            </button>
            
            <div className="w-px h-4 bg-white/20 mx-2" /> {/* Delicate separator */}

            <button className="hover:text-[#D2B48C] transition-colors flex items-center gap-1.5 p-1.5 rounded-full hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-[10px] text-white/60">▼</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}