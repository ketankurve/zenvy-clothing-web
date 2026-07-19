//frontend/src/context/OrderContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // This function fetches the latest data from the DB
const refreshOrders = async () => {
  try {
    const data = await apiRequest('/api/orders');
    const customerOrders = data.filter(order => order.customer === "c1" || order.customer === "Customer");
    
    // IMPORTANT: Use the functional update pattern to ensure a fresh state reference
    setOrders([...(customerOrders.length > 0 ? customerOrders : data)]); 
  } catch (error) {
    console.error("Failed to refresh orders:", error);
  }
};

  useEffect(() => {
    refreshOrders(); // Initial load
  }, []);

  return (
    <OrderContext.Provider value={{ orders, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);