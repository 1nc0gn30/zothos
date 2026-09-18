import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import LottieWatermark from '../components/LottieWatermark';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, isLoading } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.variant?.price || 0) * (item.quantity || 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Helmet>
          <title>Your Cart | 757 Gas Shop</title>
        </Helmet>
        <div className="empty-state-icon mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link 
          to="/shop" 
          className="btn-premium inline-flex items-center justify-center px-8 py-3.5 text-primary-foreground font-bold rounded-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Helmet>
        <title>Your Cart | 757 Gas Shop</title>
      </Helmet>

      <section className="hero-watermark-wrap mb-8 rounded-[1.8rem] border border-border bg-card p-5 sm:p-6">
        <LottieWatermark src="/lottie/wallet-glow.json" className="lottie-watermark--small" />
        <div className="hero-watermark-content">
          <h1 className="text-4xl font-black tracking-tight"><span className="text-gradient">Your Cart</span></h1>
          <p className="mt-2 text-sm text-muted-foreground">Review your pickup bag before checkout.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 card-premium">
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                {item.variant?.product?.image_url ? (
                  <img 
                    src={item.variant.product.image_url} 
                    alt={item.variant.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.variant?.product?.id}`} className="font-bold text-lg hover:text-primary transition-colors truncate block">
                  {item.variant?.product?.name}
                </Link>
                <div className="text-sm text-muted-foreground mt-1">
                  Weight: {item.variant?.weight_label}
                </div>
                <div className="font-semibold text-primary mt-1">
                  {item.variant?.price.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                <div className="flex items-center border border-input rounded-lg bg-background">
                  <button 
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors sm:ml-4"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Fee</span>
                <span className="font-medium">Free</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-primary">{subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Payment is handled securely via your wallet. You can also add credits with Cash App before checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
