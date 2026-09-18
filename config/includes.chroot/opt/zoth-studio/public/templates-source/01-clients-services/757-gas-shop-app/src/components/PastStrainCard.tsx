import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, Clock } from 'lucide-react';
import { Product, ProductVariant } from '../types/database';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

interface PastStrainCardProps {
  product: ProductWithVariants;
  index: number;
}

const PastStrainCard: React.FC<PastStrainCardProps> = ({ product, index }) => {
  const lowestPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative flex flex-col rounded-[1.8rem] border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
    >
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative h-48 overflow-hidden bg-zinc-900 block"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}

        {/* Past rotation badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950/80 backdrop-blur text-zinc-300 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-white/10">
            <Clock className="h-3 w-3" />
            Past Rotation
          </span>
        </div>

        {/* Type + THC tags */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <span className="px-2.5 py-1 bg-zinc-950/80 backdrop-blur text-white text-[10px] font-bold rounded-lg uppercase tracking-wider border border-white/10">
            {product.type}
          </span>
          <span className="px-2.5 py-1 bg-primary/80 text-primary-foreground text-[10px] font-bold rounded-lg">
            {product.thc} THC
          </span>
        </div>

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground rounded-full border border-border/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {lowestPrice !== null && (
                <span>
                  From{' '}
                  <span className="font-bold text-foreground">{lowestPrice}</span>
                </span>
              )}
            </div>
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Eye className="h-3.5 w-3.5" />
              View details
            </Link>
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground italic">
            This strain rotates seasonally. Check back soon.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PastStrainCard;
