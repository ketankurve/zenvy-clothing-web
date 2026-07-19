import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router-dom";
import { ReactLenis } from 'lenis/react';

// Components
import Header from './components/Header';
import HomePage from './components/Homepage';
import ShopNowPage from './components/ShopNowPage';
import AboutPage from './components/Aboutus';
import Cart from './components/EmptyCartPage';
import Wishlist from './components/Wishlist'

function Layout() {
  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <Header />
      <main className="w-full min-h-screen bg-neutral-50">
        <Outlet />
      </main>
      <ScrollRestoration />
    </ReactLenis>
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
      {path:"wishlist",element:<Wishlist/>}],
  },
]);;

function App() {
  return <RouterProvider router={AppRouter} />;
}

export default App;