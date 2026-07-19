import React, { useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useOrders } from '../context/OrderContext';
import LogisticsBg from '../assets/LogisticsBg.jpg'

// Background Layer Component matching your custom asset architecture
const BackgroundLogistics = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden will-change-transform">
    <div className="absolute inset-0 w-full h-full">
      <img 
        src={LogisticsBg}
        alt="Background"
        className="w-full h-full object-cover object-top opacity-80"
      />
      {/* Dark luxury overlay blending perfectly into the Zenvy color system */}
      <div className="absolute inset-0 bg-black/60"/>
    </div>
  </div>
);

const AdminLogisticsDashboard = () => {
  const { orders, refreshOrders } = useOrders();

  useEffect(() => {
    refreshOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await apiRequest(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, location: "Warehouse Alpha" })
    });
    refreshOrders();
  };

  return (
    <div className="relative min-h-screen bg-transparent text-[#F5F1E8] pt-32 px-4 md:px-12 pb-24 selection:bg-[#F5F1E8] selection:text-[#2C2420]">
      {/* 1. Mount the background layer at the root tier */}
      <BackgroundLogistics />

      {/* 2. Wrap content inside relative z-10 block to float clear above the background */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 border-b border-[#F5F1E8]/10 pb-8">
          <h1 className="text-5xl font-light tracking-tighter mb-4">Logistics Control Panel</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#D2B48C]">
            Supply Chain Lifecycle Management & Cryptographic Handshake
          </p>
        </div>

        {/* Order List */}
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div 
              key={order.orderId} 
              className="bg-[#1A1512]/80 backdrop-blur-xl border border-[#F5F1E8]/10 rounded-[2rem] p-8 shadow-2xl transition-all duration-300 hover:border-[#A05D46]/30"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/40 font-bold mb-1">Order ID: {order.orderId}</p>
                  <h3 className="text-xl font-light tracking-wide text-[#F5F1E8]">{order.productName}</h3>
                </div>
                <span className={`px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold ${
                  order.status === 'DELIVERED' 
                    ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]' 
                    : 'bg-[#A05D46]/10 border-[#A05D46]/30 text-[#D2B48C]'
                }`}>
                  {order.status}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-[#F5F1E8]/5">
                {order.status === 'PAYMENT_LOCKED' && (
                  <button onClick={() => updateStatus(order.orderId, 'PACKED')} className="bg-[#A05D46] hover:bg-[#844935] transition-colors px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#F5F1E8]">Mark as Packed</button>
                )}
                {order.status === 'PACKED' && (
                  <button onClick={() => updateStatus(order.orderId, 'SHIPPED')} className="bg-[#A05D46] hover:bg-[#844935] transition-colors px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#F5F1E8]">Mark as Shipped</button>
                )}
                {order.status === 'SHIPPED' && (
                  <button onClick={() => updateStatus(order.orderId, 'OUT_FOR_DELIVERY')} className="bg-[#A05D46] hover:bg-[#844935] transition-colors px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#F5F1E8]">Out for Delivery</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLogisticsDashboard;