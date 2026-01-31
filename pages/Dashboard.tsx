
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const Dashboard: React.FC = () => {
  const { language, sales, products, customers } = useApp();
  const t = translations[language];

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const chartData = sales.slice(0, 7).reverse().map(s => ({
    name: new Date(s.timestamp).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' }),
    sales: s.total,
    profit: s.profit
  }));

  const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center text-green-500 text-sm font-medium">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span>12%</span>
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t.total_sales} 
          value={`৳${totalSales.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-blue-500" 
        />
        <StatCard 
          title={t.total_profit} 
          value={`৳${totalProfit.toLocaleString()}`} 
          icon={CircleDollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title={t.total_customers} 
          value={customers.length.toString()} 
          icon={Users} 
          color="bg-purple-500" 
        />
        <StatCard 
          title={t.low_stock} 
          value={lowStockCount.toString()} 
          icon={AlertTriangle} 
          color="bg-amber-500" 
          subValue={`${products.length} Items total`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Recent Performance
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Stock Alerts
          </h2>
          <div className="flex-1 space-y-4">
            {products.filter(p => p.stock <= p.minStock).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                  <p className="text-xs text-amber-600">Stock: {p.stock} units left</p>
                </div>
                <div className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs font-bold">
                  Refill
                </div>
              </div>
            ))}
            {lowStockCount === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm">All items are in stock!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
