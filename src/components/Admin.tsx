
import React, { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  PackageCheck
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateOrderStatus: (order_id: string, status: 'completed' | 'cancelled') => void;
  onDeleteProduct: (product_id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  orders, 
  onUpdateOrderStatus,
  onDeleteProduct
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'orders'>('kpis');

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Orders', value: orders.filter(o => o.status === 'pending').length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Products', value: products.length, icon: PackageCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Customers', value: '1,248', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500">Manage your business operations and performance.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {(['kpis', 'products', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white text-[#721D6A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'kpis' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                  <span className="text-xs font-bold text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Recent Sales Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[40, 65, 45, 90, 75, 55, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#A188D3]/20 rounded-t-lg relative group">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-[#721D6A] rounded-t-lg transition-all duration-500 group-hover:bg-[#DD08CE]" 
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Inventory Status</h3>
              <div className="space-y-4">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.product_name}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{p.stock_quantity}</p>
                      <p className={`text-[10px] font-bold uppercase ${p.stock_quantity < 20 ? 'text-red-500' : 'text-green-500'}`}>
                        {p.stock_quantity < 20 ? 'Low Stock' : 'In Stock'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Product Inventory</h3>
            <button className="bg-[#721D6A] text-white px-4 py-2 rounded-lg text-sm font-bold">
              + Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-bold text-sm text-gray-900">{p.product_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-sm">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.stock_quantity < 15 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {p.stock_quantity} left
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#721D6A]"><Edit className="w-4 h-4" /></button>
                        <button 
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg">Order Fulfillment</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.order_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{o.order_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.order_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-sm">${o.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        o.status === 'completed' ? 'bg-green-50 text-green-600' : 
                        o.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {o.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => onUpdateOrderStatus(o.order_id, 'completed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1 text-xs font-bold transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Ship
                          </button>
                          <button 
                            onClick={() => onUpdateOrderStatus(o.order_id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 text-xs font-bold transition-all"
                          >
                            <XCircle className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
