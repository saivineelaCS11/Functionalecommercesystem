
import React from 'react';
import { Product, CartItem } from '../types';
import { Star, Plus, Minus, Trash2, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image_url} 
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 flex items-center">
            <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
            {product.rating}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-[#A188D3] uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-bold text-gray-900 mb-1 truncate">{product.product_name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{product.product_description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#721D6A]">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-[#721D6A] text-white p-2 rounded-xl hover:bg-[#DD08CE] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingBag className="mr-2 w-6 h-6 text-[#721D6A]" />
                Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={onClose}
                    className="mt-6 text-[#721D6A] font-bold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-sm">{item.product_name}</h4>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-[#721D6A] font-bold mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-3 bg-gray-50 rounded-lg w-fit">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-200 rounded-l-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-bold min-w-[2rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-200 rounded-r-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-[#721D6A] text-white py-4 rounded-xl font-bold hover:bg-[#721D6A]/90 transition-all shadow-lg shadow-[#721D6A]/20"
                >
                  Checkout - ${total.toFixed(2)}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
