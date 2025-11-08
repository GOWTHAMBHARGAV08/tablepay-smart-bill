import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';
import MenuList from './MenuList';
import Cart from './Cart';
import MenuManagement from './MenuManagement';
import InvoiceModal from './InvoiceModal';
import ReadyToServe from './ReadyToServe';
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

  // Real-time notification for ready orders
  useEffect(() => {
    const channel = supabase
      .channel('cashier-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.ready',
        },
        (payload) => {
          const order = payload.new as Database['public']['Tables']['orders']['Row'];
          
          // Show notification
          toast.success(
            `Order #${order.order_number} (Table ${order.table_number}) is ready to serve!`,
            {
              duration: 5000,
              style: {
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                border: '2px solid hsl(var(--primary))',
              },
            }
          );

          // Play notification sound
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTA0PVqzn77BdGAg+ltryxnMnBSyAzvLZiTYIGWi77eafTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUxh9Hz04IzBh5uwO/jmUwND1as5++wXRgIPpba8sZzJwUsgM7y2Yk2CBlou+3mn00QDFCn4/C2YxwGOJLX8sx5LAUkd8fw3ZBACRVetOvrqFUUCkaf4PK+bCEFMYfR89OCMwYebs');
          audio.volume = 0.5;
          audio.play().catch(() => {
            // Ignore audio play errors (e.g., user hasn't interacted with page yet)
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <MenuList items={menuItems} onAddToCart={addToCart} />
        </div>
        
        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Cart
            cart={cart}
            customer={customer}
            onUpdateQuantity={updateQuantity}
            onUpdateCustomer={setCustomer}
            onClearCart={clearCart}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
        
        {/* Ready to Serve Section - Right side */}
        <div className="lg:col-span-1">
          <ReadyToServe />
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
