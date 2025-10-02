import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';
import MenuList from './MenuList';
import Cart from './Cart';
import MenuManagement from './MenuManagement';
import InvoiceModal from './InvoiceModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type CartItem = MenuItem & { quantity: number };
type Customer = { name: string; tableNumber: string; contact: string };

const BillingSection = () => {
  const { profile, role } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [customer, setCustomer] = useState<Customer>({ name: '', tableNumber: '', contact: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading menu...</p>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <>
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
            <MenuManagement onMenuUpdate={fetchMenuItems} />
          </TabsContent>
        </Tabs>

        {showInvoice && (
          <InvoiceModal
            cart={cart}
            customer={customer}
            onClose={() => setShowInvoice(false)}
            onComplete={handleOrderComplete}
          />
        )}
      </>
    );
  }

  return (
    <>
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

      {showInvoice && (
        <InvoiceModal
          cart={cart}
          customer={customer}
          onClose={() => setShowInvoice(false)}
          onComplete={handleOrderComplete}
        />
      )}
    </>
  );
};

export default BillingSection;
