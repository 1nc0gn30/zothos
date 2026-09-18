import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Layouts
import CartToast from './components/CartToast';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import TermsOfService from './pages/TermsOfService';
import CashAppTerms from './pages/CashAppTerms';
import Support from './pages/Support';
import PhantomGuide from './pages/PhantomGuide';
import SolanaGuide from './pages/SolanaGuide';
import CashAppGuide from './pages/CashAppGuide';
import HowToUse from './pages/HowToUse';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import AgeGate, { AGE_VERIFIED_STORAGE_KEY } from './components/AgeGate';

function App() {
  const { setUser, fetchProfile, fetchSolanaIdentity, isLoading } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [ageCheckLoaded, setAgeCheckLoaded] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    const storedAgeVerification = localStorage.getItem(AGE_VERIFIED_STORAGE_KEY);
    if (storedAgeVerification) {
      try {
        const parsed = JSON.parse(storedAgeVerification) as { verified?: boolean };
        setIsAgeVerified(parsed?.verified === true);
      } catch {
        setIsAgeVerified(false);
      }
    }
    setAgeCheckLoaded(true);

    // Initialize theme
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    // Initialize auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      fetchSolanaIdentity(session?.user ?? null);
      useAuthStore.setState({ isLoading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        useAuthStore.setState({ profile: null });
      }
      fetchSolanaIdentity(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!ageCheckLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAgeVerified) {
    return <AgeGate onVerified={() => setIsAgeVerified(true)} />;
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <CartToast />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cashapp-terms" element={<CashAppTerms />} />
          <Route path="/phantom-guide" element={<PhantomGuide />} />
          <Route path="/solana-guide" element={<SolanaGuide />} />
          <Route path="/cashapp-guide" element={<CashAppGuide />} />
          
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/support" element={<Support />} />
          </Route>
          
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
