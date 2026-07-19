import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, CheckCircle2, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackgroundOrders } from './BackgroundOrders';
import { useOrders } from '../context/OrderContext';

const MyOrdersPage = () => {
  const { orders, refreshOrders } = useOrders(); // Ensure refreshOrders is available if needed
  const [loading, setLoading] = useState(true);

  // The 5-step milestone sequence
  const milestoneSteps = [
    { id: 'PAYMENT_LOCKED', label: 'Order Placed', icon: Lock },
    { id: 'PACKED', label: 'Packed', icon: Package },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
  ];

  // This effect runs whenever 'orders' changes in the Context
  useEffect(() => {
    // If orders is defined (even if empty array), we are done loading
    if (orders !== undefined) {
      setLoading(false);
    }
  }, [orders]);

  const getStepIndex = (status) => {
    return milestoneSteps.findIndex(step => step.id === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C2420] flex flex-col items-center justify-center pt-20">
        <Loader2 size={32} className="animate-spin text-[#A05D46] mb-4" />
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#F5F1E8]/50">Syncing Ledger...</p>
      </div>
    );
  }

  return (
    // By using key={JSON.stringify(orders)}, we force a full component re-render 
    // whenever the order status data changes, ensuring the UI is always fresh.
    <div key={JSON.stringify(orders)} className="relative min-h-screen bg-[#2C2420] text-[#F5F1E8] font-sans selection:bg-[#F5F1E8] selection:text-[#2C2420]">
      <BackgroundOrders />
      
      <div className="relative z-10 px-4 md:px-12 py-32 max-w-[1000px] mx-auto min-h-screen flex flex-col">
        
        <div className="mb-16 border-b border-[#F5F1E8]/10 pb-8">
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-[#F5F1E8] mb-4 drop-shadow-lg">
            My Orders
          </h1>
          <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#D2B48C]">
            Track your deliveries in real-time
          </p>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-[#363636]/50 rounded-[2rem] border border-[#F5F1E8]/5 backdrop-blur-sm"
          >
            <Package size={48} className="text-[#F5F1E8]/20 mb-6" />
            <h2 className="text-2xl font-light text-[#F5F1E8] mb-4">No active orders found</h2>
            <Link to="/zenvy-apparel" className="mt-4 border border-[#A05D46] text-[#F5F1E8] text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-3 hover:bg-[#A05D46] transition-colors rounded-full">
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-12">
            {orders.map((order, index) => {
              const currentStepIndex = getStepIndex(order.status);
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                  key={order.orderId}
                  className="bg-[#1A1512]/90 backdrop-blur-xl border border-[#F5F1E8]/10 rounded-[2rem] overflow-hidden shadow-2xl"
                >
                  <div className="bg-[#A05D46]/20 border-b border-[#A05D46]/30 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-[#D2B48C] font-bold mb-1">Order #{order.orderId}</p>
                      <h3 className="text-xl font-light text-[#F5F1E8] tracking-wide">{order.productName}</h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] uppercase tracking-[0.25em] text-[#F5F1E8]/50 font-bold mb-1">Total Amount</p>
                      <p className="text-lg font-bold text-[#F5F1E8]">${order.price} <span className="text-xs font-light text-[#F5F1E8]/50 ml-1">({order.ethPrice})</span></p>
                    </div>
                  </div>

                  <div className="p-8">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-[#F5F1E8]/50 mb-8 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#10b981]" /> Tracking History
                    </h4>

                    <div className="relative pl-6 border-l-2 border-[#F5F1E8]/10 space-y-10">
                      {milestoneSteps.map((step, i) => {
                        const isCompleted = i < currentStepIndex || (order.status === 'DELIVERED' && i === currentStepIndex);
                        const isCurrent = i === currentStepIndex && order.status !== 'DELIVERED';
                        const isPending = i > currentStepIndex;
                        const Icon = step.icon;

                        return (
                          <div key={step.id} className="relative">
                            <div className={`absolute -left-[35px] w-4 h-4 rounded-full border-4 border-[#1A1512] ${isCompleted ? 'bg-[#10b981]' : isCurrent ? 'bg-[#A05D46] shadow-[0_0_15px_#A05D46]' : 'bg-[#363636]'}`} />
                            
                            <div className="flex flex-col">
                              <span className={`text-xs font-bold tracking-widest uppercase mb-1 ${isCompleted ? 'text-[#10b981]' : isCurrent ? 'text-[#D2B48C]' : 'text-[#F5F1E8]/30'}`}>
                                {isCompleted ? 'Verified' : isCurrent ? 'Happening Now' : 'Locked'}
                              </span>
                              <div className={`flex items-center gap-3 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                                <Icon size={20} className={isCurrent ? 'text-[#F5F1E8]' : 'text-[#F5F1E8]/60'} />
                                <span className={`text-lg ${isCurrent ? 'font-medium text-[#F5F1E8]' : 'font-light text-[#F5F1E8]/70'}`}>{step.label}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {order.status === 'OUT_FOR_DELIVERY' && order.hashSuffix && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 bg-[#2C2420] border-2 border-[#A05D46] rounded-2xl overflow-hidden">
                        <div className="bg-[#A05D46] py-3 px-6 text-center border-b-2 border-dashed border-[#1A1512]">
                          <span className="text-[10px] font-bold text-[#F5F1E8] uppercase tracking-[0.3em]">Top Secret Delivery Code</span>
                        </div>
                        <div className="py-8 px-6 text-center bg-[#1A1512]">
                          <span className="inline-block text-5xl font-black text-[#D2B48C] tracking-[0.2em] font-mono">{order.hashSuffix}</span>
                        </div>
                        <div className="bg-[#2C2420] py-4 px-6 border-t border-[#F5F1E8]/10 flex items-start gap-3">
                          <ShieldCheck size={20} className="text-[#D2B48C] shrink-0 mt-0.5" />
                          <p className="text-xs text-[#F5F1E8]/70 font-light">
                            <strong>Keep it secret!</strong> Only share this code in person with your delivery agent.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;