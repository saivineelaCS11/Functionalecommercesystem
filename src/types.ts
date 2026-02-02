
export interface Product {
  id: string;
  product_name: string;
  product_description: string;
  category: string;
  price: number;
  stock_quantity: number;
  rating: number;
  image_url: string;
}

export interface User {
  user_id: string;
  user_email: string;
  full_name: string;
  role: 'admin' | 'user';
  avatar_url?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  order_id: string;
  user_id: string;
  order_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
}

export interface CartItem extends Product {
  quantity: number;
}
