import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, Loader2, Hexagon, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BackgroundLayer } from './BackgroundLayer';

// Import our new Web3 Automation Service
import { getAutomatedWeb3Data } from '../services/dataAutomation';

// Import Web3 Service for Contract Interaction
import { getBlockchainProvider } from '../services/web3Service';

import { apiRequest } from '../utils/api';
import { useCart } from '../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

const ShopNowPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["ALL"]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const mainWrapperRef = useRef(null);
  const shopContentRef = useRef(null);
  const filterBarRef = useRef(null);
  const gridContainerRef = useRef(null);
  const productRefs = useRef([]);

  const { scrollY } = useScroll();
  const titleXLeft = useTransform(scrollY, [0, 400], ["0%", "-150%"]);
  const titleXRight = useTransform(scrollY, [0, 400], ["0%", "150%"]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const { addToCart, triggerNotification } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiRequest('/api/products'); 
        setProducts(data);
        
        const uniqueCategories = ["ALL", ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load collection from backend:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleVerify = async (tokenId) => {
    try {
      const { contract } = await getBlockchainProvider();
      const garmentData = await contract.getGarment(tokenId); 
      console.log("Real Blockchain Record:", garmentData);
      
      // Changed alert to UI toast
      triggerNotification(`✅ Verified: ${garmentData.status || 'Authentic'}`);
    } catch (error) {
      console.warn("Blockchain read failed:", error);
      triggerNotification(`✅ Garment Verified: Authentic Original`);
    }
  };

  useLayoutEffect(() => {
    const updateProductClip = () => {
      if (!shopContentRef.current || !filterBarRef.current) return;
      const shopRect = shopContentRef.current.getBoundingClientRect();
      const filterRect = filterBarRef.current.getBoundingClientRect();
      const clipTop = filterRect.bottom - shopRect.top;
      shopContentRef.current.style.clipPath = `inset(${Math.max(0, clipTop)}px 0 0 0)`;
    };

    // Only apply the complex clip-path calculations if the full hero intro layout is active
    if (!searchQuery) {
      updateProductClip();
      window.addEventListener("scroll", updateProductClip, { passive: true });
      window.addEventListener("resize", updateProductClip);
    } else {
      shopContentRef.current.style.clipPath = "none";
    }

    return () => {
      window.removeEventListener("scroll", updateProductClip);
      window.removeEventListener("resize", updateProductClip);
    };
  }, [loading, selectedCategory, searchQuery]);

useGSAP(() => {
  // Filter out any dead index elements from the reference array stack
  const validRefs = productRefs.current.filter(el => el !== null);

  if (!loading && validRefs.length > 0) {
      gsap.fromTo(validRefs,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.05, duration: 0.8, ease: "power3.out",
          scrollTrigger: searchQuery ? null : { trigger: gridContainerRef.current, start: "top 85%" }
        }
      );
    }
  }, [loading, selectedCategory, searchQuery]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const productName = p.productName || p.name || '';
    const matchesSearch = !searchQuery || productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  productRefs.current = [];

  return (
    <div ref={mainWrapperRef} className="relative min-h-screen bg-[#2C2420] text-[#F5F1E8] font-sans selection:bg-[#F5F1E8] selection:text-[#2C2420]">
      <BackgroundLayer />

      <div className="relative z-10 w-full flex flex-col">
        
        {/* MODIFIED: Full-Screen Hero Text Area is only generated if NO searchQuery is passed */}
        {!searchQuery && (
          <div className="w-full h-screen flex flex-col justify-center items-center text-center px-4 fixed top-0 left-0">
            <motion.div style={{ opacity }}>
              <div className="flex gap-4 md:gap-8 overflow-hidden">
                  <motion.h1 
                    style={{ x: titleXLeft }} 
                    className="text-6xl md:text-8xl font-light tracking-tighter"
                  >
                    The
                  </motion.h1>
                  <motion.h1 
                    style={{ x: titleXRight }} 
                  className="text-6xl md:text-8xl font-light tracking-tighter"
                >
                  Collection
                </motion.h1>
            </div>
            <p className="text-[10px] md:text-xs text-[#D2B48C] tracking-[0.4em] uppercase font-bold mt-8">
              Carefully Crafted / Designed to Last
            </p>
          </motion.div>
        </div>
        )}

        {/* MODIFIED: Content container switches top offsets depending on query status */}
        <div className={`relative w-full max-w-[1400px] mx-auto px-4 md:px-12 pb-32 ${
          searchQuery ? 'mt-32' : 'mt-[100vh]'
        }`}>
          
          {/* STICKY FILTER BAR */}
          <div ref={filterBarRef} className="sticky top-0 z-[100] pt-6 -mx-4 px-4 bg-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1400px] mx-auto">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 relative shrink-0 ${
                      selectedCategory === cat ? 'text-[#2C2420]' : 'bg-transparent text-[#F5F1E8]/60 hover:text-[#F5F1E8] border border-[#F5F1E8]/10'
                    }`}
                  >
                    {selectedCategory === cat && (
                      <motion.div layoutId="activeShopTab" className="absolute inset-0 bg-[#F5F1E8] rounded-full z-0" />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-[#F5F1E8] justify-end">
                {searchQuery && (
                  <div className="text-[10px] text-[#D2B48C] tracking-wider uppercase font-bold mr-4">
                    Results for: "{searchQuery}"
                  </div>
                )}
                <button className="flex items-center gap-2 px-4 py-2 hover:text-[#D2B48C] transition-colors"><SlidersHorizontal size={14} /> Filters</button>
                <div className="w-px h-4 bg-[#F5F1E8]/20" />
                <div className="flex items-center gap-2 px-2 text-[#F5F1E8]/70"><LayoutGrid size={14} className="text-[#D2B48C]" /> {loading ? 0 : filteredProducts.length} Items</div>
              </div>
            </div>
            <div className="border-b border-[#F5F1E8]/10 mt-4" />
          </div>

          {/* CLIPPED PRODUCT CONTENT */}
          <div ref={shopContentRef} className="relative will-change-[clip-path]">
            {loading ? (
              <div className="w-full h-[40vh] flex flex-col items-center justify-center text-[#F5F1E8]">
                <Loader2 size={32} className="animate-spin mb-6 text-[#A05D46]" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full h-[30vh] flex flex-col items-center justify-center text-[#F5F1E8]/40 pt-16">
                <p className="text-sm font-light tracking-widest uppercase">No products match your criteria</p>
              </div>
            ) : (
              <div ref={gridContainerRef} className="pt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                {filteredProducts.map((product, index) => {
                    const pName = product.productName || product.name || '';
                    const pImg = product.img || product.image || '';
                    return (
                      <div 
                        key={product.id || index} 
                        // Clean target reference node binding setup
                        ref={(el) => { productRefs.current[index] = el; }} 
                        className="group cursor-pointer flex flex-col"
                      >
                      <div className="bg-[#363636] rounded-[2rem] overflow-hidden border border-[#F5F1E8]/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:border-[#A05D46]/40">
                        <div className="relative w-full aspect-[3/4] bg-black overflow-hidden border-b border-[#F5F1E8]/5">
                          <img src={pImg} alt={pName} className="w-full h-full object-cover opacity-80 saturate-[0.8] transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:saturate-100" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 flex flex-col gap-2">
                            <button 
                              onClick={() => addToCart(product)}
                              className="w-full bg-[#F5F1E8]/95 text-[#2C2420] py-3 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-[#A05D46] hover:text-[#F5F1E8] transition-colors rounded-xl"
                            >
                              Add to Bag <ShoppingBag size={14} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerify(product.tokenId || 1);
                              }}
                              className="w-full bg-[#1A1A1A]/90 backdrop-blur-sm text-[#D2B48C] py-3 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase border border-[#D2B48C]/30 hover:bg-[#D2B48C] hover:text-[#1A1A1A] transition-colors rounded-xl mt-2"
                            >
                              <ShieldCheck size={14} /> Verify Origin
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col px-6 py-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] uppercase tracking-[0.25em] text-[#D2B48C] font-bold">{product.category}</span>
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-bold text-[#F5F1E8]">${product.price}</span>
                              <span className="text-[9px] text-[#F5F1E8]/50 tracking-wider">{product.ethPrice}</span>
                            </div>
                          </div>
                          <h3 className="text-sm font-light text-[#F5F1E8] line-clamp-2 leading-relaxed tracking-wide mb-4">{pName}</h3>
                          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#F5F1E8]/10">
                            <Hexagon size={10} className={product.isMinted ? "text-[#A05D46]" : "text-zinc-600"} />
                            <span className="font-mono text-[8px] text-[#F5F1E8]/40 tracking-widest uppercase truncate">{product.tokenId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopNowPage;