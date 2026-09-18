import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CartItem, Product, ProductVariant } from '../types/database';

export type CartItemWithDetails = CartItem & {
  variant: ProductVariant & {
    product: Product;
  };
};

interface CartState {
  items: CartItemWithDetails[];
  isLoading: boolean;
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  fetchCart: async (userId: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        variant:product_variants(*, product:products(*))
      `)
      .eq('user_id', userId);
      
    if (data) {
      set({ items: data as unknown as CartItemWithDetails[], isLoading: false });
    } else {
      console.error('Error fetching cart:', error);
      set({ isLoading: false });
    }
  },
  addToCart: async (userId: string, variantId: string, quantity: number) => {
    const { items } = get();
    const existingItem = items.find(item => item.variant_id === variantId);
    
    if (existingItem) {
      await get().updateQuantity(existingItem.id, (existingItem.quantity || 0) + quantity);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: userId, variant_id: variantId, quantity });
        
      if (!error) {
        await get().fetchCart(userId);
      }
    }
  },
  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeFromCart(itemId);
      return;
    }
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);
      
    if (!error) {
      set(state => ({
        items: state.items.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      }));
    }
  },
  removeFromCart: async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
      
    if (!error) {
      set(state => ({
        items: state.items.filter(item => item.id !== itemId)
      }));
    }
  },
  clearCart: async (userId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
      
    if (!error) {
      set({ items: [] });
    }
  }
}));
