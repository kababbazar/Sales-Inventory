
import React, { useState } from 'react';
import { Search, Printer, Eye, Download, FileText } from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const Invoices: React.FC = () => {
  const { language, sales } = useApp();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(s => 
    s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Invoices or Customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.invoice_no}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.customer_name}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.date}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.payment_method}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t.total}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className="font-bold text-indigo-600">{sale.invoiceNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{sale.customerName}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(sale.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600 uppercase">
                    {sale.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="font-bold text-gray-900">৳{sale.total.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => window.print()} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Print">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 opacity-20" />
                    <p>No invoices found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
