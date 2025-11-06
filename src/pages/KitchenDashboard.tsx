import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items?: Database['public']['Tables']['order_items']['Row'][];
};

const KitchenDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
    
    // Subscribe to real-time order updates
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order update:', payload);
          if (payload.eventType === 'INSERT') {
            fetchOrders();
            toast.success('New order received!');
          } else if (payload.eventType === 'UPDATE') {
            fetchOrders();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .in('status', ['pending', 'cooking', 'ready'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'cooking': return 'default';
      case 'ready': return 'secondary';
      default: return 'default';
    }
  };

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const displayedOrders = filterOrders(activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <ChefHat className="h-10 w-10 text-primary" />
              Kitchen Portal
            </h1>
            <p className="text-muted-foreground mt-2">Manage and track incoming orders in real-time</p>
          </div>
          <div className="flex gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{orders.filter(o => o.status === 'cooking').length}</div>
                <div className="text-sm text-muted-foreground">Cooking</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Orders Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({orders.filter(o => o.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="cooking">Cooking ({orders.filter(o => o.status === 'cooking').length})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({orders.filter(o => o.status === 'ready').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {displayedOrders.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No {activeTab === 'all' ? '' : activeTab} orders at the moment</p>
              </div>
            ) : (
              displayedOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          Table {order.table_number}
                          <Badge variant={getBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {getTimeAgo(order.created_at)}
                        </div>
                      </div>
                      <CardDescription>
                        Order #{order.order_number} - {order.customer_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2">Items:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {order.order_items?.map((item) => (
                              <li key={item.id} className="text-muted-foreground">
                                {item.item_name} x {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2 pt-2">
                          {order.status === 'pending' && (
                            <Button 
                              className="flex-1"
                              onClick={() => updateOrderStatus(order.id, 'cooking')}
                            >
                              <ChefHat className="mr-2 h-4 w-4" />
                              Start Cooking
                            </Button>
                          )}
                          {order.status === 'cooking' && (
                            <Button 
                              className="flex-1" 
                              variant="secondary"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button 
                              className="flex-1" 
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default KitchenDashboard;
