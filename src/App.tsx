
import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Box, 
  Clock, 
  CheckCircle, 
  XCircle,
  CreditCard,
  MapPin,
  Mail,
  User as UserIcon,
  Shield,
  History,
  PackageCheck
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ProductCard, CartDrawer } from './components/Commerce';
import { AdminDashboard } from './components/Admin';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_USER } from './mockData';
import { Product, CartItem, Order, User } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner@2.0.3';

export default function App() {
  const [user, setUser] = useState<User | null>(MOCK_USER); // Default signed in for demo
  const [currentView, setCurrentView] = useState('catalog');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Rating') return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      setCurrentView('login');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.product_name} added to cart!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      order_id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      user_id: user?.user_id || 'u1',
      order_date: new Date().toISOString(),
      status: 'pending',
      total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items: cart.map(item => ({
        product_id: item.id,
        product_name: item.product_name,
        quantity: item.quantity,
        price_at_purchase: item.price
      }))
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setCurrentView('orders');
    toast.success('Order placed successfully! Verify payment in your dashboard.', {
      description: 'Your order is currently pending.'
    });
  };

  const updateOrderStatus = (orderId: string, status: 'completed' | 'cancelled') => {
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status } : o));
    toast.info(`Order #${orderId.split('_')[1]} marked as ${status}`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.error('Product deleted from inventory');
  };

  const logout = () => {
    setUser(null);
    setCurrentView('login');
    toast.info('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster position="top-right" richColors />
      
      <Navbar 
        user={user} 
        onLogout={logout} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={setCurrentView}
        currentView={currentView}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={handleCheckout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'catalog' && (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Explore Collection</h1>
                  <p className="mt-1 text-gray-500">Premium quality products curated for you.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative inline-block text-left">
                    <select 
                      name="category_filter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#721D6A] cursor-pointer"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative inline-block text-left">
                    <select 
                      name="sort_by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#721D6A] cursor-pointer"
                    >
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold">Order History</h1>
                  <p className="text-gray-500">Track and manage your recent purchases.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    Active
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    Completed
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                    <Box className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold">No orders found</h3>
                    <p className="text-gray-500 mt-2">Start shopping to see your orders here.</p>
                    <button 
                      onClick={() => setCurrentView('catalog')}
                      className="mt-6 bg-[#721D6A] text-white px-6 py-2 rounded-xl font-bold"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.order_id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            order.status === 'completed' ? 'bg-green-50 text-green-600' : 
                            order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {order.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : 
                             order.status === 'cancelled' ? <XCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Order #{order.order_id.split('_')[1]}</p>
                            <h3 className="font-bold text-gray-900">{new Date(order.order_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Amount Paid</p>
                            <p className="font-bold text-[#721D6A]">${order.total_amount.toFixed(2)}</p>
                          </div>
                          <button className="p-2 hover:bg-gray-50 rounded-lg">
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50/30">
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">{item.quantity}x {item.product_name}</span>
                              <span className="font-medium text-gray-900">${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className={`text-xs font-bold uppercase ${
                            order.status === 'completed' ? 'text-green-600' : 
                            order.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            Status: {order.status}
                          </span>
                          <div className="flex gap-2">
                            <button className="text-xs font-bold text-[#721D6A] px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
                              View Invoice
                            </button>
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => updateOrderStatus(order.order_id, 'cancelled')}
                                className="text-xs font-bold text-red-600 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'profile' && user && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center shadow-sm">
                    <div className="relative inline-block mb-4">
                      <img 
                        src={user.avatar_url} 
                        alt="" 
                        className="w-32 h-32 rounded-3xl object-cover ring-4 ring-[#A188D3]/10" 
                      />
                      <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                        <Edit className="w-4 h-4 text-[#721D6A]" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold">{user.full_name}</h2>
                    <p className="text-gray-500 text-sm mb-4">{user.user_email}</p>
                    <span className="bg-[#721D6A]/5 text-[#721D6A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {user.role} Account
                    </span>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#721D6A]/5 text-[#721D6A] font-bold text-sm transition-all">
                        <UserIcon className="w-5 h-5" /> Account Details
                      </button>
                      <button 
                        onClick={() => setCurrentView('orders')}
                        className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all"
                      >
                        <History className="w-5 h-5" /> Order History
                      </button>
                      <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
                        <Shield className="w-5 h-5" /> Security
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Box className="w-5 h-5 text-[#721D6A]" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                        <input 
                          type="text" 
                          name="full_name"
                          defaultValue={user.full_name} 
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#721D6A]" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                        <input 
                          type="email" 
                          name="user_email"
                          defaultValue={user.user_email} 
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#721D6A]" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                        <input 
                          type="tel" 
                          name="phone_number"
                          placeholder="+1 (555) 000-0000" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#721D6A]" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Language</label>
                        <select 
                          name="user_language"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#721D6A]"
                        >
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button className="bg-[#721D6A] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#721D6A]/20 transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#721D6A]" /> Payment Methods (Read-only)
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-[10px] font-bold text-white">VISA</div>
                          <div>
                            <p className="text-sm font-bold">Visa ending in 4242</p>
                            <p className="text-xs text-gray-400">Expires 12/28</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-[#721D6A]/10 text-[#721D6A] px-2 py-1 rounded">DEFAULT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'admin' && user?.role === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminDashboard 
                products={products} 
                orders={orders} 
                onUpdateOrderStatus={updateOrderStatus}
                onDeleteProduct={deleteProduct}
              />
            </motion.div>
          )}

          {currentView === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto mt-20"
            >
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-[#721D6A] rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 rotate-3">
                    <PackageCheck className="text-white w-8 h-8 -rotate-3" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Welcome Back</h2>
                  <p className="text-gray-500 mt-2">Sign in to continue your shopping journey.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setUser(MOCK_USER); setCurrentView('catalog'); toast.success('Welcome back, John!'); }}>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        type="email" 
                        name="user_email"
                        required
                        placeholder="name@example.com" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#721D6A]/10 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Password</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        type="password" 
                        name="password_hash"
                        required
                        placeholder="••••••••" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#721D6A]/10 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#721D6A] text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-[#721D6A]/20 transition-all transform active:scale-[0.98]"
                  >
                    Sign In
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500 font-medium">
                    Don't have an account? <button className="text-[#721D6A] font-black hover:underline">Create one</button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-gray-100 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-[#721D6A] rounded-lg flex items-center justify-center mr-2">
                  <PackageCheck className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-gray-900">FullStack Commerce</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                The most advanced e-commerce platform built with modern technologies for a seamless shopping experience.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Shop</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><button onClick={() => { setCategoryFilter('Electronics'); setCurrentView('catalog'); }} className="hover:text-[#721D6A]">Electronics</button></li>
                <li><button onClick={() => { setCategoryFilter('Apparel'); setCurrentView('catalog'); }} className="hover:text-[#721D6A]">Fashion</button></li>
                <li><button onClick={() => { setCategoryFilter('Home Office'); setCurrentView('catalog'); }} className="hover:text-[#721D6A]">Home Office</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><button className="hover:text-[#721D6A]">Order Tracking</button></li>
                <li><button className="hover:text-[#721D6A]">Return Policy</button></li>
                <li><button className="hover:text-[#721D6A]">Contact Us</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">© 2026 FullStack Commerce Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="text-gray-400 hover:text-[#721D6A] transition-colors"><Shield className="w-5 h-5" /></button>
              <button className="text-gray-400 hover:text-[#721D6A] transition-colors"><MapPin className="w-5 h-5" /></button>
              <button className="text-gray-400 hover:text-[#721D6A] transition-colors"><Mail className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
