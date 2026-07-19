import React from 'react';
import AddProductForm from './AddProductForm';
import { BackgroundAdmin } from './BackgroundAdmin';

const AdminPage = () => {
  return (
    // pt-32 adds top padding so the form doesn't clash with your fixed Header
    <div className="relative min-h-screen w-full flex items-center justify-center pt-32 pb-12 px-4">
      {/* 1. The fixed background renders behind everything */}
      <BackgroundAdmin />
      
      {/* 2. The relative wrapper ensures the form sits ABOVE the background (z-10) */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-[#F5F1E8] text-lg tracking-[0.2em] uppercase font-light mb-8 text-center drop-shadow-md">
          Add Products
        </h1>
        <AddProductForm />
      </div>
    </div>
  );
};

export default AdminPage;