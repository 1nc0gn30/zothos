import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant } from '../types/database';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import ProductCard from '../components/ProductCard';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

const Shop = () => {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { addToCart, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
    fetchProducts();
  }, [user]);

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

      const combined = productsData.map(product => ({
        ...product,
        variants: variantsData.filter(v => v.product_id === product.id)
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
    // Could add a toast notification here
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesType = selectedType ? p.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  const types = Array.from(new Set(products.map(p => p.type)));

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Shop | 757 Gas</title>
        <meta name="description" content="Browse our premium selection of cannabis products." />
      </Helmet>

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Menu</h1>
          <p className="text-muted-foreground mt-1">Premium products available for pickup.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search strains, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                  selectedType === type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse bg-card rounded-2xl border border-border/80 overflow-hidden h-80">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/80">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
