import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';

// Import the BackgroundLayer we extracted earlier to prevent flickering
import { BackgroundCart } from '../components/BackgroundCart'; 

const CartPage = () => {
  // Dummy data representing cart items (Replace with your actual state/context)
  const cartItems = [
    { 
      id: 1, 
      name: "Mens Casual Premium Slim Fit T-Shirts", 
      price: 22.30, 
      qty: 1, 
      img: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg", 
      category: "Men's Wear" 
    },
    { 
      id: 2, 
      name: "Fjallraven - Foldsack No. 1 Backpack", 
      price: 109.95, 
      qty: 1, 
      img: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", 
      category: "Men's Wear" 
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* 1. FIXED BACKGROUND LAYER */}
      <BackgroundCart />

      {/* 2. FOREGROUND CONTENT LAYER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 pt-32 pb-24 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-b border-white/20 pb-8 mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-4 flex items-center gap-4 drop-shadow-2xl">
            Your Bag <ShoppingBag size={48} strokeWidth={1} className="text-[#A05D46]" />
          </h1>
          <p className="text-xs md:text-sm text-zinc-300 tracking-[0.3em] uppercase font-semibold drop-shadow-md">
            {cartItems.length} Items / Carefully Curated
          </p>
        </motion.div>

        {/* Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {cartItems.length === 0 ? (
              <div className="text-white/60 text-sm tracking-widest uppercase py-12">
                Your bag is currently empty.
              </div>
            ) : (
              cartItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] p-4 pr-6 flex flex-col sm:flex-row gap-6 items-center shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  {/* Product Image with Blend Mode Trick */}
                  <div className="w-full sm:w-32 aspect-[3/4] bg-[#f8f8f8] rounded-xl p-4 overflow-hidden shrink-0 border border-gray-100">
                    <img 
                      src={item.img} 
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col w-full">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                        {item.category}
                      </span>
                      <p className="text-lg font-bold text-zinc-900 hidden sm:block">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <h3 className="text-sm font-medium text-zinc-800 line-clamp-2 leading-relaxed mb-6">
                      {item.name}
                    </h3>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-auto">
                      {/* Premium Quantity Toggle */}
                      <div className="flex items-center gap-4 bg-zinc-100 rounded-full px-4 py-2 border border-zinc-200">
                        <button className="text-zinc-400 hover:text-black transition-colors">
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="text-xs font-bold text-zinc-900 w-4 text-center">
                          {item.qty}
                        </span>
                        <button className="text-zinc-400 hover:text-black transition-colors">
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button className="text-zinc-400 hover:text-[#A05D46] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                      </button>

                      {/* Mobile Price */}
                      <p className="text-lg font-bold text-zinc-900 sm:hidden">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary (Glassmorphism) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-4 sticky top-32"
          >
            <div className="bg-[#A05D46]/20 backdrop-blur-xl border border-[#A05D46]/30 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
              <h2 className="text-xs tracking-[0.3em] uppercase font-bold text-[#F5F1E8] mb-8">
                Order Summary
              </h2>
              
              <div className="flex flex-col gap-5 text-sm text-[#F5F1E8]/80 border-b border-[#A05D46]/30 pb-6 mb-6 font-medium">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-[#F5F1E8]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estimated Shipping</span>
                  <span className="text-[#F5F1E8]">Complimentary</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxes</span>
                  <span className="text-[#F5F1E8]/50 text-xs">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold tracking-widest uppercase text-[#F5F1E8]">Total</span>
                <span className="text-3xl font-light tracking-tighter text-[#F5F1E8]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Terracotta Action Button */}
              <button className="w-full group relative overflow-hidden bg-[#A05D46] text-[#F5F1E8] px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase shadow-lg shadow-[#A05D46]/20 transition-colors duration-300 hover:bg-[#844935] flex justify-center items-center gap-3">
                Secure Checkout 
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="mt-6 text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/50">
                  Carbon Neutral Delivery
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;