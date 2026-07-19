import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const navRef = useRef(null);
  const navigate = useNavigate(); 

  // Unified Search Execution Logic
  const executeSearch = () => {
    if (searchQuery.trim()) {
      // Changed destination to /search matching your App.jsx configuration
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 50) {
        setIsHidden(true);
        setActiveMenu(null); 
      } else {
        setIsHidden(false);
      }
    };

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
      setActiveMenu(null); 
    } else {
      setActiveMenu(menuName); 
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-8 py-6 transition-all duration-500 ease-in-out ${
          isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Navigation Links */}
        <nav ref={navRef} className="flex items-center space-x-8 text-sm font-medium text-[#F5F1E8]/90">
          <Link to="/admin" className="tracking-wide hover:text-[#D2B48C] transition-colors duration-300">
            Admin Panel
          </Link>
          <Link to="/track-orders" className="tracking-wide hover:text-[#D2B48C] transition-colors duration-300">
            My Orders
          </Link>
          <Link to="/admin-logistics" className="tracking-wide hover:text-[#D2B48C] transition-colors duration-300">
            Logistics
          </Link>
          <Link to="/verify-delivery" className="tracking-wide hover:text-[#D2B48C] transition-colors duration-300">
            Verify Delivery
          </Link>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} // Trigger via enter key press
              className="bg-white/5 border border-white/10 backdrop-blur-md text-xs px-5 py-2 rounded-full focus:bg-white/10 focus:border-[#A05D46]/50 focus:outline-none w-52 text-[#F5F1E8] placeholder-[#F5F1E8]/50 transition-all duration-300"
            />
          </div>
          
          {/* Icons Menu Option Items */}
          <div className="flex items-center space-x-4 text-[#F5F1E8]/90">
            {/* Clickable Search Icon Button */}
            <button 
              onClick={executeSearch} // Trigger via manual icon click
              className="hover:text-[#D2B48C] transition-colors p-1.5 rounded-full hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <Link to="/Cart" className="hover:text-[#D2B48C] transition-colors p-1.5 rounded-full hover:bg-white/5 relative">  
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#A05D46] rounded-full border border-black"></span>
            </Link>
            
            <div className="w-px h-4 bg-white/20 mx-2" /> 

            <button className="hover:text-[#D2B48C] transition-colors flex items-center gap-1.5 p-1.5 rounded-full hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] text-white/60">▼</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}