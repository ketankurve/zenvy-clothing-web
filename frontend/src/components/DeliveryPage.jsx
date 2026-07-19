import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Truck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../utils/api';

const DeliveryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({}); // Stores OTP text value per orderId
  const [verifyingId, setVerifyingId] = useState(null);

  const fetchActiveDeliveries = async () => {
    try {
      const data = await apiRequest('/api/orders');
      // Show orders that are out for delivery or shipped
      const activeTransit = data.filter(o => o.status === "OUT_FOR_DELIVERY" || o.status === "SHIPPED");
      setOrders(activeTransit.length > 0 ? activeTransit : data);
    } catch (err) {
      console.error("Error pulling agent delivery queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  const handleStatusAdvance = async (orderId, nextStatus) => {
    try {
      await apiRequest(`/api/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: nextStatus,
          location: "Regional Hub Terminal"
        })
      });
      alert(`🚚 Order state advanced to: ${nextStatus}`);
      fetchActiveDeliveries();
    } catch (err) {
      alert("Status change failed: " + err.message);
    }
  };

  const handleHandshakeVerify = async (e, orderId) => {
    e.preventDefault();
    const inputOtp = otpInputs[orderId];
    if (!inputOtp || inputOtp.length !== 6) {
      alert("Please provide a valid 6-character cryptographic token.");
      return;
    }

    setVerifyingId(orderId);
    try {
      const result = await apiRequest('/api/orders/verify', {
        method: 'POST',
        body: JSON.stringify({ orderId, inputOtp })
      });

      if (result.success) {
        alert("✔ CRYPTOGRAPHIC HANDSHAKE SUCCESS: Smart Contract Escrow funds released to Supplier balance!");
        fetchActiveDeliveries();
      }
    } catch (err) {
      alert("❌ HANDSHAKE MISMATCH: Provided token does not match the block genesis hash suffix.");
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C2420] flex flex-col items-center justify-center pt-20">
        <Loader2 size={32} className="animate-spin text-[#A05D46] mb-4" />
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#F5F1E8]/50">Loading Driver Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C2420] text-[#F5F1E8] px-4 pt-32 pb-12">
      <div className="w-full max-w-xl mx-auto">
        
        <div className="mb-12 border-b border-[#F5F1E8]/10 pb-6 text-center">
          <h1 className="text-3xl font-light tracking-widest uppercase mb-2">Delivery App Portal</h1>
          <p className="text-xs text-[#D2B48C] tracking-wider uppercase font-bold">Last-Mile Execution Gateway</p>
        </div>

        <div className="flex flex-col gap-8">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-[#1A1512] border border-[#F5F1E8]/10 p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-start border-b border-[#F5F1E8]/10 pb-4 mb-4">
                <div>
                  <span className="text-[9px] font-mono text-[#D2B48C] tracking-widest block uppercase mb-1">ID: {order.orderId}</span>
                  <h3 className="text-lg font-light tracking-wide">{order.productName}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                  order.status === 'OUT_FOR_DELIVERY' ? 'bg-[#fba01d]/20 text-[#fba01d]' : 'bg-[#A05D46]/20 text-[#A05D46]'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Step 1: Simulated Progression Buttons for the Demo Run */}
              {order.status !== 'OUT_FOR_DELIVERY' && order.status !== 'DELIVERED' && (
                <div className="mt-4">
                  <p className="text-xs text-[#F5F1E8]/40 mb-3 font-light">Advance shipment status flow node:</p>
                  <button 
                    onClick={() => handleStatusAdvance(order.orderId, order.status === 'PAYMENT_LOCKED' ? 'PACKED' : order.status === 'PACKED' ? 'SHIPPED' : 'OUT_FOR_DELIVERY')}
                    className="bg-transparent border border-[#F5F1E8]/20 hover:border-[#A05D46] text-[#F5F1E8] text-[10px] tracking-widest font-bold uppercase px-4 py-2.5 rounded-xl transition-all"
                  >
                    Advance Status →
                  </button>
                </div>
              )}

              {/* Step 2: The Cryptographic Last-Mile Input Field */}
              {order.status === 'OUT_FOR_DELIVERY' && (
                <form onSubmit={(e) => handleHandshakeVerify(e, order.orderId)} className="mt-6 bg-[#2C2420]/50 p-4 border border-[#F5F1E8]/5 rounded-xl">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#D2B48C] block mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Last-Mile Cryptographic Input Verification
                  </label>
                  
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      maxLength="6"
                      placeholder="Enter 6-digit client key"
                      value={otpInputs[order.orderId] || ''}
                      onChange={(e) => setOtpInputs({ ...otpInputs, [order.orderId]: e.target.value.toUpperCase() })}
                      className="flex-1 bg-[#1A1512] border border-[#F5F1E8]/20 focus:border-[#A05D46] text-[#F5F1E8] placeholder:text-[#F5F1E8]/20 px-4 py-3 rounded-xl outline-none font-mono text-center tracking-widest text-lg"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={verifyingId === order.orderId}
                      className="bg-[#10b981] hover:bg-[#059669] text-white font-bold uppercase text-[10px] tracking-wider px-5 rounded-xl transition-all flex items-center justify-center shrink-0"
                    >
                      {verifyingId === order.orderId ? <Loader2 size={16} className="animate-spin" /> : 'Verify & Release'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DeliveryPage;