import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const refreshOrders = async () => {
    try {
      const data = await apiRequest('/api/orders');
      // Always store the full set, or filter as per your logic
      setOrders(data); 
    } catch (error) {
      console.error("Failed to refresh orders:", error);
    }
  };

  useEffect(() => {
    refreshOrders(); // Initial load

    // Setup polling: Refresh orders every 5 seconds for real-time feel
    const interval = setInterval(refreshOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);