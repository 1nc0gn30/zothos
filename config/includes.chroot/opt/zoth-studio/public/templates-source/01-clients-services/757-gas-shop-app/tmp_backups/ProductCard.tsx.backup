import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ProductVariant } from '../types/database';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

interface ProductCardProps {
  product: ProductWithVariants;
  index: number;
  onAddToCart: (variantId: string) => void | Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onAddToCart }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  // Set initial selected variant to the first one that is actually in stock
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const firstInStock = product.variants.find(v => v.in_stock !== false);
      if (firstInStock) {
        setSelectedVariantId(firstInStock.id);
      } else {
        setSelectedVariantId(product.variants[0].id);
      }
    }
  }, [product.variants]);

  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId) || product.variants?.[0];

  // Logic to determine stock status based on the new boolean columns
  const isCompletelyOutOfStock = 
    product.in_stock === false || 
    (product.variants && product.variants.every(v => v.in_stock === false));

  const isSelectedVariantOutOfStock = selectedVariant?.in_stock === false || isCompletelyOutOfStock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors group flex flex-col ${isCompletelyOutOfStock ? 'opacity-75 grayscale-[0.5]' : ''}`}
    >
      <Link 
        to={`/product/${product.id}`} 
        className={`relative h-48 overflow-hidden bg-zinc-900 block ${isCompletelyOutOfStock ? 'pointer-events-none' : ''}`}
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        
        {/* Out of Stock Overlay Overlay */}
        {isCompletelyOutOfStock && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-destructive text-destructive-foreground font-bold px-4 py-2 rounded-lg rotate-12 text-lg uppercase tracking-wider shadow-xl">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2 z-20">
          <span className="px-2 py-1 bg-background/80 backdrop-blur text-xs font-bold rounded-md uppercase tracking-wider">
            {product.type}
          </span>
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-md">
            {product.thc} THC
          </span>
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className={isCompletelyOutOfStock ? 'pointer-events-none' : ''}>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-border">
          {product.variants && product.variants.length > 0 ? (
            <div className="space-y-3">
              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isThisVariantOut = variant.in_stock === false || product.in_stock === false;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        disabled={isThisVariantOut}
                        className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
                          selectedVariantId === variant.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-transparent text-muted-foreground border-border hover:border-primary/50'
                        } ${isThisVariantOut ? 'opacity-40 line-through cursor-not-allowed bg-muted/50 border-border/50 hover:border-border/50' : ''}`}
                      >
                        {variant.weight_label}
                      </button>
                    )
                  })}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold">${selectedVariant?.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">/ {selectedVariant?.weight_label}</span>
                </div>
                
                <button 
                  onClick={() => selectedVariant && !isSelectedVariantOutOfStock && onAddToCart(selectedVariant.id)}
                  disabled={isSelectedVariantOutOfStock}
                  className={`p-2 rounded-full transition-colors ${
                    isSelectedVariantOutOfStock 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  aria-label={isSelectedVariantOutOfStock ? "Out of stock" : "Add to cart"}
                >
                  {isSelectedVariantOutOfStock ? <XCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">Product unavailable</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;