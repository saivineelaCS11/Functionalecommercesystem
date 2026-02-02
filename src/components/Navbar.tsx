
import React, { useState } from 'react';
import { Search, ShoppingCart, User, LogOut, Package, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onLogout: () => void;
  cartCount: number;
  onCartClick: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onLogout, 
  cartCount, 
  onCartClick, 
  onNavigate,
  currentView
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer" 
            onClick={() => onNavigate('catalog')}
          >
            <div className="w-8 h-8 bg-[#721D6A] rounded-lg flex items-center justify-center mr-2">
              <Package className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">FullStack Commerce</span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="search_query"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#721D6A] focus:bg-white text-sm transition-all"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button 
                  onClick={onCartClick}
                  className="relative p-2 text-gray-500 hover:text-[#721D6A] transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#DD08CE] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full border border-gray-200 hover:border-[#721D6A] transition-all"
                  >
                    <img
                      src={user.avatar_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100"}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.user_email}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-[#721D6A]/10 text-[#721D6A]' : 'bg-gray-100 text-gray-600'}`}>
                              {user.role}
                            </span>
                          </div>

                          <div className="py-1">
                            <button 
                              onClick={() => { onNavigate('profile'); setIsProfileOpen(false); }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <User className="w-4 h-4 mr-3" /> Profile Settings
                            </button>
                            <button 
                              onClick={() => { onNavigate('orders'); setIsProfileOpen(false); }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Package className="w-4 h-4 mr-3" /> My Orders
                            </button>
                            {user.role === 'admin' && (
                              <button 
                                onClick={() => { onNavigate('admin'); setIsProfileOpen(false); }}
                                className="flex items-center w-full px-4 py-2 text-sm text-[#721D6A] font-medium hover:bg-gray-50 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 mr-3" /> Admin Panel
                              </button>
                            )}
                          </div>

                          <div className="border-t border-gray-100 pt-1">
                            <button 
                              onClick={onLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4 mr-3" /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-[#721D6A] text-white px-6 py-2 rounded-full font-medium hover:bg-[#721D6A]/90 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
