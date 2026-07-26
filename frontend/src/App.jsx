import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router-dom";
import { ReactLenis } from 'lenis/react';
import { Activity } from 'lucide-react';

// Components
import Header from './components/Header';
import HomePage from './components/Homepage';
import ShopNowPage from './components/ShopNowPage';
import AboutPage from './components/Aboutus';
import Cart from './components/EmptyCartPage';
import Wishlist from './components/Wishlist';
import AdminPage from './components/AdminPage';
import MyOrdersPage from './components/MyOrdersPage';
import DeliveryPage from './components/DeliveryPage';
import AdminLogisticsDashboard from './components/AdminLogisticsDashboard';
import DeliveryAgentVerification from './components/DeliveryAgentVerification';
import BlockchainLedger from './components/BlockchainLedger';
import { ToastNotification } from './components/ToastNotification'; // Import Toast

// Context Providers
import { LedgerProvider } from './context/LedgerContext';
import { CartProvider, useCart } from './context/CartContext'; // Import useCart for notification access

function ToastWrapper() {
  const { notification } = useCart();
  return <ToastNotification message={notification} />;
}

function Layout() {
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  return (
    <LedgerProvider>
      <CartProvider>
        <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
          <Header />
          <ToastWrapper />
          
          <main className="w-full min-h-screen bg-neutral-50">
            <Outlet />
          </main>

          {/* Floating Ledger Toggle */}
          <button
            onClick={() => setIsLedgerOpen(true)}
            className="fixed bottom-20 right-6 z-[90] bg-[#1A1512] text-[#D2B48C] border border-[#D2B48C]/50 hover:border-[#D2B48C] hover:text-[#F5F1E8] p-4 rounded-full shadow-[0_0_20px_rgba(210,180,140,0.2)] flex items-center gap-2 group transition-all duration-300 animate-bounce"
          >
            <Activity size={18} className="text-[#A05D46]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase max-w-[100px]">
              Live Ledger
            </span>
          </button>

          <BlockchainLedger isOpen={isLedgerOpen} onClose={() => setIsLedgerOpen(false)} />
          <ScrollRestoration />
        </ReactLenis>
      </CartProvider>
    </LedgerProvider>
  );
}

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "zenvy-apparel", element: <ShopNowPage /> },
      { path: "about-us", element: <AboutPage /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "admin", element: <AdminPage /> },
      { path: "track-orders", element: <MyOrdersPage /> },
      { path: "delivery", element: <DeliveryPage /> },
      { path: "/admin-logistics", element: <AdminLogisticsDashboard /> },
      { path: "/verify-delivery", element: <DeliveryAgentVerification /> },
      { path: "/search", element: <ShopNowPage /> }
    ],
  },
]);

function App() {
  return <RouterProvider router={AppRouter} />;
}

export default App;