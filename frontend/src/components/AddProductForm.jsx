import React, { useState } from 'react';
import { apiRequest } from '../utils/api';

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'TEES',
    price: '',
    ethPrice: '',
    img: '',
    tokenId: '',
    isMinted: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify({
        ...formData,
        price: Number(formData.price)
        })
    });
    
    alert('🚀 Product added dynamically to MongoDB Atlas!');
    
    // Clear the actual React state values completely
    setFormData({
        name: '',
        category: 'TEES',
        price: '',
        ethPrice: '',
        img: '',
        tokenId: '',
        isMinted: true
    });
    
    if (onProductAdded) onProductAdded();
    e.target.reset(); // Wipe the visible inputs
    } catch (err) {
      console.error(err);
      alert('Error adding product: ' + err.message);
    }
  };

  // Shared theme styling classes for sleek luxury inputs
  const inputClasses = "w-full bg-transparent border border-[#F5F1E8]/20 focus:border-[#A05D46] text-[#F5F1E8] placeholder:text-[#F5F1E8]/30 px-4 py-3 rounded-lg outline-none transition-all duration-300 font-light text-sm tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="w-full bg-[#1A1512] border border-[#F5F1E8]/10 p-8 rounded-2xl flex flex-col gap-5 text-[#F5F1E8] shadow-2xl backdrop-blur-md">
      <div>
        <label className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 font-medium block mb-2">Garment Label</label>
        <input 
          type="text" 
          placeholder="e.g. Minimalist Sherpa Hoodie" 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className={inputClasses} 
          required 
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 font-medium block mb-2">Collection Category</label>
        <select 
          onChange={e => setFormData({...formData, category: e.target.value})} 
          className={`${inputClasses} appearance-none cursor-pointer`}
          style={{ colorScheme: 'dark' }}
        >
          <option value="TEES" className="bg-[#1A1512]">TEES</option>
          <option value="SHIRTS" className="bg-[#1A1512]">SHIRTS</option>
          <option value="OUTERWEAR" className="bg-[#1A1512]">OUTERWEAR</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 font-medium block mb-2">Fiat Value ($)</label>
          <input 
            type="number" 
            placeholder="e.g. 4500" 
            onChange={e => setFormData({...formData, price: e.target.value})} 
            className={inputClasses} 
            required 
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 font-medium block mb-2">Crypto Equiv (ETH)</label>
          <input 
            type="text" 
            placeholder="e.g. 0.015" 
            onChange={e => setFormData({...formData, ethPrice: e.target.value})} 
            className={inputClasses} 
            required 
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 font-medium block mb-2">Showcase Image Asset URL</label>
        <input 
          type="text" 
          placeholder="https://images.unsplash.com/..." 
          onChange={e => setFormData({...formData, img: e.target.value})} 
          className={inputClasses} 
          required 
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 font-medium block mb-2">Ledger Cryptographic Token ID</label>
        <input 
          type="text" 
          placeholder="e.g. M104" 
          onChange={e => setFormData({...formData, tokenId: e.target.value})} 
          className={inputClasses} 
          required 
        />
      </div>

      <button 
        type="submit" 
        className="w-full mt-2 bg-[#A05D46] hover:bg-[#8A4E3A] text-[#F5F1E8] py-3.5 rounded-xl font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98]"
      >
        Add to Collection →
      </button>
    </form>
  );
};

export default AddProductForm;