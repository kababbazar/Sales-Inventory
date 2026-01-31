
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, Trash2, User as UserIcon, Printer, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';
import { Product, PaymentMethod, SaleItem, Sale } from '../types';

const POS: React.FC = () => {
  const { language, products, customers, addSale } = useApp();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [discount, setDiscount] = useState(0);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Out of stock!");
      return;
    }
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert("Stock limit reached!");
        return;
      }
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.sellingPrice }]);
    }
    setSearchTerm('');
    barcodeInputRef.current?.focus();
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (product && newQty > product.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% flat tax for demo
  const total = subtotal + tax - discount;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const sale = addSale({
      customerId: selectedCustomer,
      customerName: customers.find(c => c.id === selectedCustomer)?.name || 'Guest',
      items: cart,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod
    });
    setLastSale(sale);
    setCart([]);
    setDiscount(0);
    alert("Sale Successful!");
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            ref={barcodeInputRef}
            type="text" 
            placeholder="Scan Barcode or Search Products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
          {filteredProducts.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.stock <= 0}
              className={`
                group text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative
                ${p.stock <= 0 ? 'opacity-50 grayscale' : 'active:scale-95'}
              `}
            >
              <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-gray-300">
                <ShoppingCart className="w-12 h-12" />
              </div>
              <p className="font-bold text-gray-800 line-clamp-1">{p.name}</p>
              <p className="text-sm text-indigo-600 font-bold mt-1">৳{p.sellingPrice}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">{p.category}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${p.stock <= p.minStock ? 'bg-amber-100 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                  Stock: {p.stock}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Summary Area */}
      <div className="w-full lg:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Current Order
          </h2>
          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            {cart.length} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-2 py-10">
              <ShoppingCart className="w-16 h-16" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-indigo-600 font-bold">৳{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.productId, -1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded text-gray-600">-</button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded text-gray-600">+</button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-rose-500 hover:text-rose-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (5%)</span>
              <span>৳{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Discount</span>
              <input 
                type="number" 
                value={discount} 
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 text-right bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="flex justify-between text-lg font-black text-indigo-900 pt-2 border-t">
              <span>{t.total}</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">{t.payment_method}</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition ${paymentMethod === PaymentMethod.CASH ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-[10px] font-bold">Cash</span>
              </button>
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CARD)}
                className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition ${paymentMethod === PaymentMethod.CARD ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-[10px] font-bold">Card</span>
              </button>
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.MOBILE)}
                className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition ${paymentMethod === PaymentMethod.MOBILE ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-[10px] font-bold">Mobile</span>
              </button>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:grayscale"
          >
            {t.checkout}
          </button>
        </div>
      </div>

      {/* Printer Preview Component (Hidden) */}
      {lastSale && (
        <div id="invoice-print-area" className="hidden print:block fixed inset-0 bg-white p-10">
          <div className="max-w-md mx-auto border p-8 text-center space-y-4">
            <h1 className="text-2xl font-black">BMS PRO SOFTWARE</h1>
            <p className="text-sm">Dhaka, Bangladesh | +880 1234 567890</p>
            <hr />
            <div className="flex justify-between text-left text-xs">
              <div>
                <p>Invoice: <b>{lastSale.invoiceNumber}</b></p>
                <p>Customer: <b>{lastSale.customerName}</b></p>
              </div>
              <div className="text-right">
                <p>Date: {new Date(lastSale.timestamp).toLocaleDateString()}</p>
                <p>Method: {lastSale.paymentMethod}</p>
              </div>
            </div>
            <table className="w-full text-xs text-left border-y py-2 mt-4">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {lastSale.items.map(item => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">৳{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 text-right text-xs pt-4">
              <p>Subtotal: ৳{lastSale.subtotal}</p>
              <p>Tax: ৳{lastSale.tax}</p>
              <p>Discount: ৳{lastSale.discount}</p>
              <p className="text-sm font-bold">Total: ৳{lastSale.total}</p>
            </div>
            <hr />
            <p className="text-[10px] text-gray-500 italic">Thank you for shopping with us!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
