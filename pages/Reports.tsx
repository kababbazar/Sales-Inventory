
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  Filter
} from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const Reports: React.FC = () => {
  const { language, sales, products } = useApp();
  const t = translations[language];

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const avgOrderValue = sales.length ? totalSales / sales.length : 0;

  // Best selling calculation
  const productPerformance: Record<string, { name: string, quantity: number, revenue: number }> = {};
  sales.forEach(s => {
    s.items.forEach(item => {
      if (!productPerformance[item.productId]) {
        productPerformance[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
      }
      productPerformance[item.productId].quantity += item.quantity;
      productPerformance[item.productId].revenue += item.quantity * item.price;
    });
  });

  const bestSellers = Object.values(productPerformance)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-bold text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> This Month
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-bold text-gray-600 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><DollarSign /></div>
            <span className="text-green-500 font-bold text-sm">+15.2%</span>
          </div>
          <p className="text-gray-500 font-medium">{t.total_sales}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">৳{totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><TrendingUp /></div>
            <span className="text-green-500 font-bold text-sm">+8.4%</span>
          </div>
          <p className="text-gray-500 font-medium">{t.total_profit}</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">৳{totalProfit.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><ShoppingBag /></div>
            <span className="text-rose-500 font-bold text-sm">-2.1%</span>
          </div>
          <p className="text-gray-500 font-medium">Avg Order Value</p>
          <p className="text-2xl font-black text-gray-900 mt-1">৳{avgOrderValue.toFixed(0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-8">{t.profit_report}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellers}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-8">{t.best_selling}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bestSellers}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="quantity"
                >
                  {bestSellers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Detailed Product Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-500 uppercase tracking-widest text-xs">Product</th>
                <th className="pb-4 font-bold text-gray-500 uppercase tracking-widest text-xs text-right">Qty Sold</th>
                <th className="pb-4 font-bold text-gray-500 uppercase tracking-widest text-xs text-right">Revenue</th>
                <th className="pb-4 font-bold text-gray-500 uppercase tracking-widest text-xs text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bestSellers.map(item => (
                <tr key={item.name} className="hover:bg-gray-50 transition">
                  <td className="py-4 font-semibold text-gray-800">{item.name}</td>
                  <td className="py-4 text-right font-bold text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right font-bold text-indigo-600">৳{item.revenue.toLocaleString()}</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3" /> Growth
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
