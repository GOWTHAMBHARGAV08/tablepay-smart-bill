import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { MenuItem, CartItem, Customer } from '@/types/menu';
import { initialMenu } from '@/data/initialMenu';
import Header from '@/components/Header';
import MenuList from '@/components/MenuList';
import Cart from '@/components/Cart';
import MenuManagement from '@/components/MenuManagement';
import InvoiceModal from '@/components/InvoiceModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [customer, setCustomer] = useState<Customer>({ name: '', tableNumber: '', contact: '' });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const stored = localStorage.getItem('tablepay_menu');
    if (stored) {
      setMenuItems(JSON.parse(stored));
    } else {
      setMenuItems(initialMenu);
      localStorage.setItem('tablepay_menu', JSON.stringify(initialMenu));
    }
  }, [user, navigate]);

  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('tablepay_menu', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  const addToCart = (item: MenuItem) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((c) => c.id !== id));
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, quantity } : c)));
    }
  };

  const clearCart = () => {
    setCart([]);
    setCustomer({ name: '', tableNumber: '', contact: '' });
    toast.info('Cart cleared');
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!customer.name || !customer.tableNumber) {
      toast.error('Please enter customer details');
      return;
    }
    setShowInvoice(true);
  };

  const handleOrderComplete = () => {
    setShowInvoice(false);
    clearCart();
    toast.success('Order completed successfully!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {user.role === 'admin' ? (
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="menu">Menu & Orders</TabsTrigger>
                <TabsTrigger value="manage">Manage Menu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <MenuList items={menuItems} onAddToCart={addToCart} />
                  </div>
                  <div>
                    <Cart
                      cart={cart}
                      customer={customer}
                      onUpdateQuantity={updateQuantity}
                      onUpdateCustomer={setCustomer}
                      onClearCart={clearCart}
                      onPlaceOrder={handlePlaceOrder}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="manage">
                <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MenuList items={menuItems} onAddToCart={addToCart} />
              </div>
              <div>
                <Cart
                  cart={cart}
                  customer={customer}
                  onUpdateQuantity={updateQuantity}
                  onUpdateCustomer={setCustomer}
                  onClearCart={clearCart}
                  onPlaceOrder={handlePlaceOrder}
                />
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {showInvoice && (
        <InvoiceModal
          cart={cart}
          customer={customer}
          onClose={() => setShowInvoice(false)}
          onComplete={handleOrderComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;
