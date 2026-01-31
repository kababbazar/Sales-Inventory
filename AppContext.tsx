
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Product, Customer, Sale, User, Role, Language } from './types';

interface AppContextType extends AppState {
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchase' | 'dues'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'timestamp' | 'invoiceNumber' | 'profit'>) => Sale;
  toggleLanguage: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('bms_data');
    if (saved) return JSON.parse(saved);
    return {
      products: [
        { id: '1', name: 'Premium Coffee', category: 'Beverage', purchasePrice: 450, sellingPrice: 600, stock: 50, minStock: 10, sku: 'COF001' },
        { id: '2', name: 'Basmati Rice 5kg', category: 'Grocery', purchasePrice: 700, sellingPrice: 850, stock: 5, minStock: 8, sku: 'RIC001' },
      ],
      customers: [
        { id: '1', name: 'Walk-in Customer', phone: '000', address: 'N/A', totalPurchase: 0, dues: 0 }
      ],
      sales: [],
      currentUser: { id: 'admin', username: 'admin', role: Role.ADMIN, name: 'System Admin' },
      language: 'en',
    };
  });

  useEffect(() => {
    localStorage.setItem('bms_data', JSON.stringify(state));
  }, [state]);

  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProduct = { ...p, id: Date.now().toString() };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const updateProduct = (id: string, p: Partial<Product>) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(item => item.id === id ? { ...item, ...p } : item)
    }));
  };

  const deleteProduct = (id: string) => {
    setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  };

  const addCustomer = (c: Omit<Customer, 'id' | 'totalPurchase' | 'dues'>) => {
    const newCustomer = { ...c, id: Date.now().toString(), totalPurchase: 0, dues: 0 };
    setState(prev => ({ ...prev, customers: [...prev.customers, newCustomer] }));
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'timestamp' | 'invoiceNumber' | 'profit'>) => {
    const profit = saleData.items.reduce((acc, item) => {
      const product = state.products.find(p => p.id === item.productId);
      return acc + (item.quantity * (item.price - (product?.purchasePrice || 0)));
    }, 0);

    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      invoiceNumber: `INV-${state.sales.length + 1001}`,
      profit
    };

    setState(prev => {
      // Update inventory and customer stats
      const updatedProducts = prev.products.map(p => {
        const sold = saleData.items.find(si => si.productId === p.id);
        if (sold) return { ...p, stock: p.stock - sold.quantity };
        return p;
      });

      const updatedCustomers = prev.customers.map(c => {
        if (c.id === saleData.customerId) {
          return { ...c, totalPurchase: c.totalPurchase + newSale.total };
        }
        return c;
      });

      return {
        ...prev,
        sales: [newSale, ...prev.sales],
        products: updatedProducts,
        customers: updatedCustomers
      };
    });

    return newSale;
  };

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'en' ? 'bn' : 'en' }));
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      addCustomer, 
      addSale, 
      toggleLanguage, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
