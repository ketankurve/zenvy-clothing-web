import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, HeartCrack, Loader2, ShoppingBag, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundWishlist } from './BackgroundWishlist'; 
import { getAutomatedWeb3Data } from '../services/dataAutomation';

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const savedWishlist = JSON.parse(localStorage.getItem('zenvy_wishlist')) || [];
      if (savedWishlist.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const allWeb3Products = await getAutomatedWeb3Data();
        const formattedProducts = allWeb3Products.filter(item => savedWishlist.includes(item.id));
        
        setWishlistProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistItems();
  }, []);

  const removeFromWishlist = (productId) => {
    setWishlistProducts(prev => prev.filter(item => item.id !== productId));
    const savedWishlist = JSON.parse(localStorage.getItem('zenvy_wishlist')) || [];
    const updatedWishlist = savedWishlist.filter(id => id !== productId);
    localStorage.setItem('zenvy_wishlist', JSON.stringify(updatedWishlist));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C2420] flex flex-col items-center justify-center pt-20">
        <Loader2 size={32} className="animate-spin text-[#A05D46] mb-4" />
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#F5F1E8]/50">Curating your selection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C2420] text-[#F5F1E8] relative selection:bg-[#F5F1E8] selection:text-[#2C2420]">
      <BackgroundWishlist />

      <div className="relative z-10 px-8 md:px-12 py-32 max-w-[1400px] mx-auto">
        
        <div className="mb-20 border-b border-[#F5F1E8]/10 pb-8">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-[#F5F1E8] mb-6 drop-shadow-lg">
            Wishlist
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#F5F1E8]/50">
              Your personal curation
            </p>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#A05D46]">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <HeartCrack size={48} className="text-[#A05D46] mb-8 opacity-50" />
            <h2 className="text-2xl md:text-4xl font-light text-[#F5F1E8] mb-4">Nothing here yet</h2>
            <p className="text-xs text-[#F5F1E8]/60 mb-10 max-w-xs leading-relaxed tracking-wide">
              Discover silhouettes designed for modern elegance.
            </p>
            <Link to="/zenvy-apparel" className="border border-[#F5F1E8] text-[#F5F1E8] text-[10px] font-bold tracking-[0.2em] uppercase px-10 py-4 hover:bg-[#F5F1E8] hover:text-[#2C2420] transition-colors rounded-full">
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {wishlistProducts.map((product) => (
                <motion.div
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  className="group flex flex-col relative"
                >
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 z-20 bg-[#2C2420]/80 backdrop-blur p-2.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#A05D46] text-[#F5F1E8] hover:border-[#A05D46]"
                  >
                    <X size={14} />
                  </button>

                  <Link to={`/product/${product.id}`} className="block overflow-hidden bg-[#363636] aspect-[3/4] mb-6 flex items-center justify-center rounded-[2rem] border border-[#F5F1E8]/5 transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.3)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] group-hover:border-[#A05D46]/40">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover opacity-80 saturate-75 transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:saturate-100"
                    />
                  </Link>

                  <div className="flex flex-col space-y-3 px-2">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[9px] uppercase tracking-[0.25em] text-[#D2B48C] font-bold truncate">
                         {product.category}
                       </h4>
                       <span className="text-xs font-bold text-[#F5F1E8]">
                         {product.price}
                       </span>
                    </div>
                    
                    <h3 className="text-sm font-light text-[#F5F1E8] line-clamp-1 tracking-wide">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 pt-1">
                      <Hexagon size={10} className={product.isMinted ? "text-[#A05D46]" : "text-zinc-600"} />
                      <span className="font-mono text-[8px] text-[#F5F1E8]/40 tracking-widest uppercase truncate">
                        {product.tokenId}
                      </span>
                    </div>

                    <button className="mt-4 border border-[#F5F1E8]/20 bg-transparent text-[#F5F1E8] text-[9px] font-bold tracking-[0.2em] py-3.5 rounded-full uppercase hover:bg-[#A05D46] hover:border-[#A05D46] hover:text-[#F5F1E8] transition-all duration-300 flex items-center justify-center gap-2">
                      Add to Bag <ShoppingBag size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;