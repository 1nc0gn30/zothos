export type Product = {
  id: number;
  name: string;
  image_url: string;
  thc: string;
  type: string;
  description: string | null;
  tags: string[] | null;
  in_stock: boolean; // NEW MASTER TOGGLE
};

export type ProductVariant = {
  id: string;
  product_id: number;
  weight_label: string;
  weight_value: number;
  price: number;
  stock_quantity: number | null;
  in_stock: boolean; // NEW WEIGHT TOGGLE
  created_at: string;
};

export type Profile = {
  id: string;
  username: string | null;
  wallet_balance: number;
  strain_preferences: any;
  updated_at: string;
  avatar_url: string | null;
  solana_wallet_address?: string | null;
  cashapp_tag?: string | null;
};

export type CartItem = {
  id: string;
  user_id: string | null;
  variant_id: string | null;
  quantity: number | null;
  created_at: string | null;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  pinpoint: string | null;
  code: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string | null;
  variant_id: string | null;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string | null;
};

export type OrderMeetup = {
  id: string;
  order_id: string;
  latitude: number;
  longitude: number;
  label: string | null;
  note: string | null;
  updated_at: string;
};

export type OrderMessage = {
  id: string;
  order_id: string;
  user_id: string;
  message: string;
  created_at: string;
};

export type WalletTransaction = {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  external_reference: string | null;
  created_at: string;
};
// Wallet reference/linking functionality
export type WalletReference = {
  id: string;
  user_id: string;
  wallet_address: string;
  network: string;
  is_primary: boolean;
  last_used_at: string | null;
  created_at: string;
};

