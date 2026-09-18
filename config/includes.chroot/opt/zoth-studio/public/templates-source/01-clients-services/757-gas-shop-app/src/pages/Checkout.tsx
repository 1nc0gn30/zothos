import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CreditCard, ArrowRight, CheckCircle2, Wallet, Loader2, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import LottieWatermark from '../components/LottieWatermark';

const Checkout = () => {
  const { items, fetchCart } = useCartStore();
  const { user, profile, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.variant?.price || 0) * (item.quantity || 0);
  }, 0);

  // Redirect if cart is empty and not successful
  if (items.length === 0 && !success) {
    navigate('/shop');
    return null;
  }

  const walletBalance = profile?.wallet_balance || 0;
  const hasInsufficientFunds = walletBalance < subtotal;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Check wallet balance
      if (hasInsufficientFunds) {
        throw new Error('Insufficient wallet balance. Please add credits to your wallet via DePay or Cash App.');
      }

      // Place order atomically in the database via secure RPC.
      const { data: orderId, error: checkoutError } = await supabase.rpc('checkout_from_cart');
      if (checkoutError) throw checkoutError;
      if (!orderId || typeof orderId !== 'string') {
        throw new Error('Checkout completed but no order ID was returned.');
      }
      
      // Refresh profile in store
      await fetchProfile(user.id);
      await fetchCart(user.id);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Helmet>
          <title>Thank You | 757 Gas Shop</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-md w-full text-center"
        >
          <div className="relative mx-auto mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
              className="relative w-24 h-24 mx-auto bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                <CheckCircle2 className="h-12 w-12 text-green-500" strokeWidth={2.5} />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Thank You!
            </h2>
            <p className="text-muted-foreground text-lg mb-2">
              Your order has been placed successfully.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-8">
              You will be redirected to your order where you can generate a unique digital asset.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Redirecting to your order...
            </div>

            <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Checkout | 757 Gas Shop</title>
      </Helmet>

      <section className="hero-watermark-wrap mb-8 rounded-[1.8rem] border border-border bg-card p-5 sm:p-6">
        <LottieWatermark src="/lottie/wallet-glow.json" className="lottie-watermark--small" />
        <div className="hero-watermark-content">
          <h1 className="text-4xl font-extrabold tracking-tight"><span className="text-gradient">Checkout</span></h1>
          <p className="mt-2 text-sm text-muted-foreground">Confirm wallet payment and pickup details.</p>
        </div>
      </section>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Checkout Form */}
        <div>
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            
            {/* Payment Method */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary bg-primary/5">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-medium block">757 Gas Shop Wallet</span>
                      <span className={`text-xs ${hasInsufficientFunds ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                        Balance: {walletBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {hasInsufficientFunds && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm space-y-1">
                    <p>Your wallet balance is insufficient for this order. Add credits via DePay or Cash App to continue.</p>
                    <p className="text-xs">
                      Cash App: send to <span className="font-bold">$t757gs</span>. See{' '}
                      <Link to="/cashapp-terms" className="text-primary hover:underline">Cash App Terms</Link>.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">{item.quantity}x</span>
                    <div>
                      <div className="font-medium">{item.variant?.product?.name}</div>
                      <div className="text-muted-foreground text-xs">{item.variant?.weight_label}</div>
                    </div>
                  </div>
                  <span className="font-medium">{((item.variant?.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pickup Fee</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-primary">{subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            {hasInsufficientFunds ? (
              <button
                type="button"
                onClick={() => navigate('/wallet')}
                className="w-full flex items-center justify-center space-x-2 bg-zinc-900 text-white border border-zinc-800 py-3 rounded-lg font-bold hover:bg-zinc-800 transition-colors"
              >
                <Wallet className="h-4 w-4" />
                <span>Add Credits to Wallet</span>
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Processing...' : 'Place Order'}</span>
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By placing this order, you agree to our <Link to="/terms" className="text-primary hover:underline">terms of service</Link> and confirm you are of legal age.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
