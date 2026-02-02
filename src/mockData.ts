
import { Product, Order, User } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    product_name: 'Premium Wireless Headphones',
    product_description: 'High-fidelity audio with noise cancellation and 40-hour battery life.',
    category: 'Electronics',
    price: 299.99,
    stock_quantity: 45,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1759863639101-d1ad4923d655?q=80&w=1000'
  },
  {
    id: 'p2',
    product_name: 'Minimalist Work Desk',
    product_description: 'Ergonomic wooden desk perfect for home office setup.',
    category: 'Home Office',
    price: 450.00,
    stock_quantity: 12,
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1752061905248-e93a855489fe?q=80&w=1000'
  },
  {
    id: 'p3',
    product_name: 'Eco-Friendly Cotton Hoodie',
    product_description: 'Soft, sustainable cotton hoodie available in multiple colors.',
    category: 'Apparel',
    price: 55.00,
    stock_quantity: 100,
    rating: 4.2,
    image_url: 'https://images.unsplash.com/photo-1762343291122-72aba1d404f0?q=80&w=1000'
  },
  {
    id: 'p4',
    product_name: 'Smartphone Pro Max',
    product_description: 'Latest generation smartphone with advanced camera system.',
    category: 'Electronics',
    price: 999.00,
    stock_quantity: 25,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1759863639101-d1ad4923d655?q=80&w=1000'
  },
  {
    id: 'p5',
    product_name: 'Ergonomic Chair',
    product_description: 'Breathable mesh chair with lumbar support.',
    category: 'Home Office',
    price: 199.99,
    stock_quantity: 30,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1752061905248-e93a855489fe?q=80&w=1000'
  },
  {
    id: 'p6',
    product_name: 'Canvas Tote Bag',
    product_description: 'Durable canvas bag for everyday use.',
    category: 'Apparel',
    price: 25.00,
    stock_quantity: 150,
    rating: 4.1,
    image_url: 'https://images.unsplash.com/photo-1762343291122-72aba1d404f0?q=80&w=1000'
  }
];

export const MOCK_USER: User = {
  user_id: 'u1',
  user_email: 'john.doe@example.com',
  full_name: 'John Doe',
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?q=80&w=200'
};

export const MOCK_ORDERS: Order[] = [
  {
    order_id: 'ord_123',
    user_id: 'u1',
    order_date: '2026-01-15T10:30:00Z',
    status: 'completed',
    total_amount: 354.99,
    items: [
      { product_id: 'p1', product_name: 'Premium Wireless Headphones', quantity: 1, price_at_purchase: 299.99 },
      { product_id: 'p3', product_name: 'Eco-Friendly Cotton Hoodie', quantity: 1, price_at_purchase: 55.00 }
    ]
  },
  {
    order_id: 'ord_124',
    user_id: 'u1',
    order_date: '2026-01-20T14:45:00Z',
    status: 'pending',
    total_amount: 450.00,
    items: [
      { product_id: 'p2', product_name: 'Minimalist Work Desk', quantity: 1, price_at_purchase: 450.00 }
    ]
  }
];
