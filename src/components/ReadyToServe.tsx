import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: Database['public']['Tables']['order_items']['Row'][];
};

const ReadyToServe = () => {
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadyOrders();
    
    // Real-time subscription for ready orders
    const channel = supabase
      .channel('ready-orders-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.ready',
        },
        () => {
          // Refetch orders when any ready order changes
          fetchReadyOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReadyOrders = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('status', 'ready')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReadyOrders(orders || []);
    } catch (error) {
      console.error('Error fetching ready orders:', error);
      toast.error('Failed to load ready orders');
    } finally {
      setLoading(false);
    }
  };

  const markAsServed = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Order marked as served!');
      fetchReadyOrders();
    } catch (error) {
      console.error('Error marking order as served:', error);
      toast.error('Failed to mark order as served');
    }
  };

  const getElapsedTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  if (loading) {
    return (
      <Card className="border-primary/20 shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Utensils className="h-6 w-6 text-primary" />
            🍽️ Ready to Serve
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            🍽️ Ready to Serve
          </span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {readyOrders.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {readyOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No orders ready to serve</p>
            <p className="text-sm mt-1">Orders will appear here when kitchen marks them as ready</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence>
              {readyOrders.map((order) => {
                const elapsedMinutes = getElapsedTime(order.created_at);
                const isUrgent = elapsedMinutes > 5;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`${isUrgent ? 'border-orange-500 shadow-lg' : 'border-green-500'} bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">
                              Order #{order.order_number}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Table {order.table_number} • {order.customer_name}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={isUrgent ? "destructive" : "secondary"} className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {elapsedMinutes}m ago
                            </Badge>
                            <Badge className="bg-green-600 hover:bg-green-700 text-white">
                              Ready
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-1 mb-4">
                          {order.order_items.map((item, idx) => (
                            <div key={idx} className="text-sm flex justify-between">
                              <span className="text-foreground">{item.quantity}x {item.item_name}</span>
                              <span className="text-muted-foreground">₹{item.line_total}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-border/50">
                          <span className="font-semibold text-foreground">Total: ₹{order.total}</span>
                          <Button
                            onClick={() => markAsServed(order.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mark as Served
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReadyToServe;
