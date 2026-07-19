import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from "react-router-dom";

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import backgroundVideo from '../assets/Background.mp4';

// Register ScrollTrigger so GSAP knows how to track the scrollbar
gsap.registerPlugin(ScrollTrigger);

// Animation variants for reusability
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.215, 0.61, 0.355, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const imageReveal = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 1.5, ease: "easeOut" } 
  }
};

const HomePage = () => {
  // Refs for GSAP scroll tracking
  const heroRef = useRef();
  const videoRef = useRef();
  
  // Refs for Horizontal Scroll Section
  const horizontalSectionRef = useRef();
  const horizontalScrollRef = useRef();

  useGSAP(() => {
    // 1. GSAP Parallax effect for the video background
    gsap.to(videoRef.current, {
      yPercent: 25, 
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true, 
      }
    });

    // 2. Pinned Horizontal Scroll Physics
    const scrollContainer = horizontalScrollRef.current;
    gsap.to(scrollContainer, {
      x: () => -(scrollContainer.scrollWidth - window.innerWidth) + "px",
      ease: "none",
      scrollTrigger: {
        trigger: horizontalSectionRef.current,
        pin: true, 
        scrub: 1,  
        end: () => "+=" + scrollContainer.scrollWidth, 
      }
    });
  }); 

  const categories = [
    { name: 'SHIRTS', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400' },
    { name: 'DENIM', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400' },
    { name: 'TEES', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400' },
    { name: 'PANTS', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400' },
    { name: 'SWEATERS', image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=400' },
    { name: 'OUTERWEAR', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400' },
  ];

  // Expanded array with 8 distinct categories
  const collections = [
    { title: "Winter Outerwear", discount: "40-70% OFF", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600" },
    { title: "Premium Handbags", discount: "40-80% OFF", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600" },
    { title: "Cozy Knitwear", discount: "UP TO 60% OFF", image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600" },
    { title: "Fine Jewellery", discount: "UP TO 80% OFF", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600" },
    { title: "Size-Inclusive Styles", discount: "UP TO 60% OFF", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600" },
    { title: "Minimalist Footwear", discount: "30-60% OFF", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600" },
    { title: "Loungewear Essentials", discount: "UP TO 50% OFF", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" },
    { title: "Aesthetic Home Decor", discount: "40-70% OFF", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600" }
  ];

  return (
    <div className="w-full bg-[#2C2420] text-[#F5F1E8] font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={imageReveal}
          className="absolute inset-0 w-full h-full"
        >
          <div ref={videoRef} className="absolute inset-0 w-full h-full">
            <video
              src={backgroundVideo} 
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-top origin-top scale-[1.1] opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420] via-black/40 to-transparent" />
          </div>
        </motion.div>

        {/* Content Box */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center px-4 flex flex-col items-center max-w-2xl mt-12"
        >
          <motion.span 
            variants={fadeInUp}
            className="flex items-center gap-3 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold text-[#F5F1E8] mb-6 bg-[#A05D46]/20 px-5 py-2 rounded-full backdrop-blur-md border border-[#A05D46]/30"
          >
            <Sparkles size={14} className="text-[#D2B48C]" /> Winter Season '26
          </motion.span>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-light tracking-tighter mb-6 text-[#F5F1E8] drop-shadow-2xl"
          >
            Your Cozy Era
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-sm md:text-base text-[#F5F1E8]/70 font-light max-w-md mb-10 leading-relaxed"
          >
            Get peak comfy-chic with our fresh, sustainably crafted winter essentials.
          </motion.p>
          
          <motion.button 
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden bg-[#A05D46] text-[#F5F1E8] px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_40px_rgba(160,93,70,0.3)] transition-all duration-300 hover:bg-[#844935]"
          >
           <Link to="/zenvy-apparel"> 
             <span className="relative z-10 flex items-center gap-3">
               Shop The Collection <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
             </span>
           </Link>
          </motion.button>
        </motion.div>

        {/* UX Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#F5F1E8]/50">Scroll</span>
          <div className="w-px h-12 bg-[#F5F1E8]/20 overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-1/2 bg-[#D2B48C]"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. INFINITE MARQUEE */}
      <div className="w-full py-8 md:py-10 bg-[#363636] overflow-hidden border-y border-[#F5F1E8]/5">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="whitespace-nowrap flex gap-12"
        >
          <h1 className="text-2xl md:text-4xl font-light uppercase tracking-[0.2em] text-[#F5F1E8]/60">
            SUSTAINABLE FABRICS <span className="text-[#A05D46] mx-4">✦</span> PREMIUM COMFORT <span className="text-[#A05D46] mx-4">✦</span> ORGANIC COTTON <span className="text-[#A05D46] mx-4">✦</span> RADICAL CLARITY <span className="text-[#A05D46] mx-4">✦</span>
          </h1>
          <h1 className="text-2xl md:text-4xl font-light uppercase tracking-[0.2em] text-[#F5F1E8]/60">
            SUSTAINABLE FABRICS <span className="text-[#A05D46] mx-4">✦</span> PREMIUM COMFORT <span className="text-[#A05D46] mx-4">✦</span> ORGANIC COTTON <span className="text-[#A05D46] mx-4">✦</span> RADICAL CLARITY <span className="text-[#A05D46] mx-4">✦</span>
          </h1>
        </motion.div>
      </div>

      {/* 3. Shop by Category (Editorial Overlays) */}
      <section className="py-32 px-4 md:px-12 flex flex-col justify-center relative z-10 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-[#D2B48C] mb-4">The Essentials</h2>
          <h3 className="text-3xl md:text-4xl font-light tracking-wide text-[#F5F1E8]">Shop by Category</h3>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 w-full"
        >
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              className="group relative cursor-pointer w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#363636] shadow-lg"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420] via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-[#F5F1E8] transition-transform duration-500 group-hover:translate-x-2">
                  {cat.name}
                </span>
                <ArrowRight size={14} className="text-[#A05D46] opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

    {/* 4. PINNED HORIZONTAL COLLECTIONS (High-End Gallery Layout) */}
      <section 
        ref={horizontalSectionRef} 
        className="h-screen w-full flex flex-col justify-center overflow-hidden border-t border-[#F5F1E8]/5 bg-[#1f1916]"
      >
        <div className="px-12 mb-12 max-w-[1400px] mx-auto w-full">
          {/* Enhanced Typography Hierarchy */}
          <div className="flex flex-col gap-3 border-b border-[#F5F1E8]/10 pb-6">
             <h2 className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-[#D2B48C]">
              Curated Collections
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-[#F5F1E8] tracking-wide">
              Seasonal Offers
            </h3>
          </div>
        </div>

        {/* Pinned Timeline Container */}
        <div 
          ref={horizontalScrollRef} 
          className="flex gap-8 px-12 w-[450vw] sm:w-[300vw] md:w-[220vw]"
        >
          {collections.map((item, idx) => (
            <div 
              key={idx} 
              // Thinner padding (p-3) and a darker, more translucent background for the "Gallery Frame" look
              className="group flex flex-col w-[75vw] sm:w-[45vw] md:w-[23vw] shrink-0 border border-[#F5F1E8]/5 bg-[#2C2420]/40 backdrop-blur-sm p-3 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)] hover:border-[#A05D46]/40 hover:-translate-y-2"
            >
              {/* Image Frame Container - Adjusted inner radius to compliment the outer frame */}
              <div className="w-full aspect-[4/5] overflow-hidden bg-black rounded-[1.25rem] relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  // Image starts slightly desaturated and dark, popping into full color on hover
                  className="w-full h-full object-cover opacity-80 saturate-[0.8] transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-20" />
              </div>

              {/* Text Meta Container - Increased padding for breathing room */}
              <div className="flex flex-col items-center text-center pt-8 pb-6 px-4 flex-grow justify-between relative">
                <div className="space-y-4 w-full">
                  <h3 className="text-[9px] md:text-[10px] font-bold text-[#D2B48C] tracking-[0.25em] uppercase">
                    {item.title}
                  </h3>
                  {/* Made discount text lighter and wider for an editorial look */}
                  <p className="text-xl md:text-2xl font-light text-[#F5F1E8] tracking-widest uppercase">
                    {item.discount}
                  </p>
                </div>
                
                {/* Refined Interactive Shop Link */}
                <div className="mt-8 flex items-center justify-center gap-2 cursor-pointer">
                  <span className="relative text-[10px] font-bold text-[#F5F1E8]/60 tracking-[0.2em] uppercase transition-colors duration-300 group-hover:text-[#A05D46]">
                    Shop Collection
                    <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[#A05D46] transition-all duration-500 group-hover:w-full" />
                  </span>
                  <ArrowRight size={14} className="text-[#A05D46] opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Banner / Zoom Image Viewport Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="px-4 md:px-12 py-32 max-w-[1400px] mx-auto"
      >
        <div className="relative rounded-[2.5rem] overflow-hidden h-[400px] md:h-[600px] flex items-center justify-center group shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-[#F5F1E8]/10">
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200" 
              alt="Sustainability Mission" 
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-[#2C2420]/70 transition-colors duration-700 group-hover:bg-[#2C2420]/50" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light tracking-wide mb-6 text-[#F5F1E8] drop-shadow-lg leading-tight">
              We're on a Mission To Clean Up the Industry
            </h2>
            <p className="text-xs md:text-sm text-[#D2B48C] font-bold mb-10 tracking-[0.2em] uppercase drop-shadow-md">
              Read about our progress in our latest Impact Report.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border border-[#F5F1E8] text-[#F5F1E8] px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#F5F1E8] hover:text-[#2C2420]"
            >
              Read The Report
            </motion.button>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default HomePage;