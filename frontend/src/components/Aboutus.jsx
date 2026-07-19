import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Eye, ShieldCheck, ArrowUpRight } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const AboutPage = () => {
  const coreValues = [
    {
      icon: <Leaf className="text-[#008ecc]" size={24} />,
      title: "Sustainable Focus",
      desc: "We prioritize eco-friendly sourcing and low-impact production methods to keep your wardrobe green."
    },
    {
      icon: <Eye className="text-[#008ecc]" size={24} />,
      title: "Radical Clarity",
      desc: "From supply chains to structural pricing, we believe our community deserves complete transparency."
    },
    {
      icon: <ShieldCheck className="text-[#008ecc]" size={24} />,
      title: "Premium Quality",
      desc: "Every dynamic stitch is double-inspected to guarantee lasting comfort and durable daily utility."
    }
  ];

  const team = [
    {
      name: "Sumedh Boudh",
      role: "Founder",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Shrutika Tirpude",
      role: "Co-Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="w-full bg-white text-gray-800 font-sans overflow-hidden">
      
      {/* 1. Hero / Vision Section */}
      <section className="relative w-full bg-[#f3f9fb] py-20 px-4 md:px-12 flex flex-col items-center justify-center text-center border-b border-gray-100">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl flex flex-col items-center"
        >
          <motion.span 
            variants={fadeInUp}
            className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#008ecc] mb-4 bg-white px-4 py-2 rounded-full shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" /> Our Story
          </motion.span>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-light tracking-tight text-gray-900 mb-6"
          >
            Redefining Contemporary Comfort
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-sm md:text-lg text-gray-600 font-light leading-relaxed max-w-2xl"
          >
            Zenvy was born out of a simple idea: premium, minimal clothing shouldn't compromise the planet. We craft versatile wardrobe essentials that move effortlessly with your rhythm.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. Brand Value Split Layout */}
      <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[2.5rem] overflow-hidden aspect-[4/3] bg-slate-100 shadow-md"
        >
          <img 
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800" 
            alt="Zenvy Studio Crafting" 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
          />
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900">
            Driven by Intention
          </h2>
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            We don't believe in fast fashion seasons. Instead, we focus on modular drops designed to be layered, shared, and treasured across years. Everything we build follows careful operational blueprints.
          </p>
          <div className="w-full h-px bg-gray-200 my-2" />
          
          {/* Stats Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#f3f9fb] rounded-2xl border border-gray-100">
              <span className="block text-2xl font-bold text-[#008ecc]">100%</span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">Organic Cotton Traceability</span>
            </div>
            <div className="p-4 bg-[#f3f9fb] rounded-2xl border border-gray-100">
              <span className="block text-2xl font-bold text-[#008ecc]">25k+</span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">Happy Global Minds</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="bg-slate-50 py-20 px-4 md:px-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-xl font-light tracking-[0.15em] uppercase mb-16 text-gray-800">
            Our Core Pillars
          </h2>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {coreValues.map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start"
              >
                <div className="p-3 bg-[#f3f9fb] rounded-2xl mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Leadership / Creative Team Section */}
      <section className="py-20 px-4 md:px-12 max-w-5xl mx-auto">
        <h2 className="text-center text-xl font-light tracking-[0.15em] uppercase mb-16 text-gray-800">
          The Leadership Team
        </h2>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16"
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="group flex flex-col items-center bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 bg-[#f3f9fb] border-2 border-transparent group-hover:border-[#008ecc]/30 transition-all duration-300">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 tracking-wide transition-colors group-hover:text-[#008ecc]">
                {member.name}
              </h3>
              <p className="text-xs text-[#008ecc] font-semibold tracking-widest uppercase mt-1">
                {member.role}
              </p>
              <button className="mt-4 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium">
                View Profile <ArrowUpRight size={12} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
};

export default AboutPage;