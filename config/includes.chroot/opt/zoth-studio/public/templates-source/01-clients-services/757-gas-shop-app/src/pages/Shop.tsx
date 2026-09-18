import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, X, DollarSign, ExternalLink, Mail, Clock, Flame, Wind, Leaf, Zap, Activity, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant } from '../types/database';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import ProductCard from '../components/ProductCard';
import PastStrainCard from '../components/PastStrainCard';
import LottieWatermark from '../components/LottieWatermark';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

const LOW_BALANCE_SHOWN_KEY = '757gas_low_balance_shown';

const Shop = () => {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showLowBalanceModal, setShowLowBalanceModal] = useState(false);

  const { user, profile } = useAuthStore();
  const { addToCart, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
    fetchProducts();
  }, [user]);

  // Show low-balance popup once per session after login
  useEffect(() => {
    if (!user || !profile) return;
    const alreadyShown = sessionStorage.getItem(LOW_BALANCE_SHOWN_KEY);
    if (alreadyShown) return;
    const balance = Number(profile.wallet_balance ?? 0);
    if (balance < 20) {
      setShowLowBalanceModal(true);
      sessionStorage.setItem(LOW_BALANCE_SHOWN_KEY, 'true');
    }
  }, [user, profile]);

  const fetchProducts = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .order('weight_value', { ascending: true });

      if (variantsError) throw variantsError;

      const combined = productsData.map((product) => ({
        ...product,
        variants: variantsData.filter((v) => v.product_id === product.id),
      }));

      setProducts(combined);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (variantId: string) => {
    if (!user) return;
    await addToCart(user.id, variantId, 1);

    const product = products.find((p) =>
      p.variants?.some((v) => v.id === variantId)
    );
    const variant = product?.variants?.find((v) => v.id === variantId);
    const toast = useToastStore.getState().addToast;
    toast({
      title: 'Added to cart',
      message: `${product?.name || 'Item'} — ${variant?.weight_label || ''}`,
      variant: 'success',
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags &&
        p.tags.some((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesType = selectedType ? p.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  const inStockProducts = filteredProducts.filter((p) => {
    return (
      p.in_stock !== false &&
      p.variants?.some((v) => v.in_stock !== false)
    );
  });

  const outOfStockProducts = filteredProducts.filter((p) => {
    return (
      p.in_stock === false ||
      (p.variants && p.variants.every((v) => v.in_stock === false))
    );
  });

  const types = Array.from(new Set(products.map((p) => p.type)));

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Shop | 757 Gas Shop</title>
        <meta
          name="description"
          content="Browse our premium selection of cannabis products."
        />
      </Helmet>

      {/* Low Balance Modal */}
      {showLowBalanceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLowBalanceModal(false); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-[1.8rem] border border-green-500/20 bg-card p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLowBalanceModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Wallet balance
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {Number(profile?.wallet_balance ?? 0).toFixed(2)} credits
                </h3>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-amber-500/20 bg-amber-500/5 p-4 mb-5">
              <p className="text-sm font-bold text-amber-400 mb-1">
                Low balance warning
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You need at least <span className="font-bold text-foreground">20 credits</span> to place most orders. Top up now so you are ready to check out.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.35rem] border border-green-500/20 bg-green-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <img src="/cashapp-logo.svg" alt="Cash App" className="h-6 w-6 rounded-md" />
                  <span className="text-xs font-bold uppercase tracking-wider text-green-400">Cash App</span>
                </div>
                <h4 className="font-bold text-foreground mb-2">Add credits via Cash App</h4>
                <ol className="text-sm text-muted-foreground space-y-1.5 ml-4 list-decimal leading-relaxed">
                  <li>Open Cash App on your phone</li>
                  <li>Send payment to <span className="font-bold text-foreground">$t757gs</span></li>
                  <li>Include your registered email in the note</li>
                  <li>Credits post within <span className="font-bold text-foreground">2 hours max</span></li>
                </ol>
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href="https://cash.app/$t757gs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
                  >
                    <DollarSign size={18} />
                    Open Cash App — $t757gs
                    <ExternalLink size={14} />
                  </a>
                  <Link
                    to="/cashapp-terms"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    onClick={() => setShowLowBalanceModal(false)}
                  >
                    <Clock size={14} />
                    Cash App credit terms
                  </Link>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Questions? Email{' '}
                <a href="mailto:support@757gas.shop" className="text-primary hover:underline font-medium">
                  <Mail size={12} className="inline -mt-0.5 mr-0.5" />
                  support@757gas.shop
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header & Filters */}
      <div className="hero-watermark-wrap rounded-[1.8rem] border border-border bg-card p-5 sm:p-6">
        <LottieWatermark
          src="/lottie/gas-leaf-orbit.json"
          className="lottie-watermark--corner"
        />
        <div className="hero-watermark-content flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-gradient">Live Menu</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lead">
              Premium products available for pickup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search strains, products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-9 pr-4 py-2.5 rounded-2xl"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedType === null
                    ? 'btn-premium text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                    selectedType === type
                      ? 'btn-premium text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Menu — In Stock */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-card rounded-2xl border border-border/80 overflow-hidden h-80"
            >
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : inStockProducts.length > 0 ? (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
              Live Menu — {inStockProducts.length} available
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {inStockProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/80">
          <h3 className="text-xl font-semibold mb-2">No live products</h3>
          <p className="text-muted-foreground">
            Check back soon — new drops rotate in regularly.
          </p>
        </div>
      )}

      {/* Past Rotation — Out of Stock */}
      {outOfStockProducts.length > 0 && (
        <>
          <div className="pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground">
                  Past Rotation
                </h2>
                <p className="text-sm text-muted-foreground">
                  Strains that have rotated out. They often return — bookmark your favorites.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {outOfStockProducts.map((product, index) => (
              <PastStrainCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty state when no products at all */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/80">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Shop;
