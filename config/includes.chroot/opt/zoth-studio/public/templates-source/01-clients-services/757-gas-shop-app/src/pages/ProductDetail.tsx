import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant } from '../types/database';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .order('weight_value', { ascending: true });

      if (variantsError) throw variantsError;

      setProduct({
        ...productData,
        variants: variantsData
      });

      if (variantsData.length > 0) {
        const firstInStock = variantsData.find(v => v.in_stock !== false);
        setSelectedVariant(firstInStock || variantsData[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user || !selectedVariant) return;
    
    setAdding(true);
    try {
      await addToCart(user.id, selectedVariant.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      
      const toast = useToastStore.getState().addToast;
      toast({
        title: 'Added to cart',
        message: `${product?.name || 'Item'} — ${selectedVariant.weight_label}${quantity > 1 ? ` x${quantity}` : ''}`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Helmet>
        <title>{product.name} | 757 Gas</title>
        <meta name="description" content={product.description || `Buy ${product.name} at 757 Gas Shop`} />
      </Helmet>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden aspect-square flex items-center justify-center">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-muted-foreground">No image available</div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-muted text-foreground text-xs font-bold rounded-md uppercase tracking-wider">
              {product.type}
            </span>
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-md">
              {product.thc} THC
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight mb-2">{product.name}</h1>
          
          <div className="text-3xl font-bold text-primary mb-6">
            ${selectedVariant?.price.toFixed(2) || '0.00'}
          </div>

          {product.description && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
              <p className="text-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Select Weight</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((variant) => {
                  const isOut = variant.in_stock === false || product.in_stock === false;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={isOut}
                      className={`py-3 px-4 rounded-xl border-2 text-center transition-all duration-300 ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      } ${isOut ? 'opacity-40 line-through cursor-not-allowed bg-muted/50 border-border/50 hover:border-border/50' : ''}`}
                    >
                      <div className="font-bold">{variant.weight_label}</div>
                      <div className="text-sm opacity-80">${variant.price.toFixed(2)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mt-auto pt-8 border-t border-border flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-input rounded-xl bg-card">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || adding || (selectedVariant?.in_stock === false || product.in_stock === false)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-bold text-primary-foreground transition-all duration-300 ${
                added 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'btn-premium'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
