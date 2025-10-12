import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, ShoppingCart, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

type Order = Database['public']['Tables']['orders']['Row'];

interface SalesStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  cashPayments: number;
  cardPayments: number;
  upiPayments: number;
  totalTax: number;
  totalServiceCharge: number;
}

const SalesReport = () => {
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    cashPayments: 0,
    cardPayments: 0,
    upiPayments: 0,
    totalTax: 0,
    totalServiceCharge: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', today.toISOString());

      if (error) throw error;

      const orders = data || [];
      
      const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
      const totalOrders = orders.length;
      const cashPayments = orders.filter(o => o.payment_mode === 'cash').reduce((sum, o) => sum + Number(o.total), 0);
      const cardPayments = orders.filter(o => o.payment_mode === 'card').reduce((sum, o) => sum + Number(o.total), 0);
      const upiPayments = orders.filter(o => o.payment_mode === 'upi').reduce((sum, o) => sum + Number(o.total), 0);
      const totalTax = orders.reduce((sum, order) => sum + Number(order.tax), 0);
      const totalServiceCharge = orders.reduce((sum, order) => sum + Number(order.service_charge), 0);

      setStats({
        totalSales,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        cashPayments,
        cardPayments,
        upiPayments,
        totalTax,
        totalServiceCharge,
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Failed to load sales report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Today's revenue</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per order value</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalTax.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">GST (5%)</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Cash</span>
                </div>
                <span className="text-lg font-bold">₹{stats.cashPayments.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Card</span>
                </div>
                <span className="text-lg font-bold">₹{stats.cardPayments.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">UPI</span>
                </div>
                <span className="text-lg font-bold">₹{stats.upiPayments.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Additional Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">GST (5%)</p>
                  <p className="text-xs text-muted-foreground">Tax collected</p>
                </div>
                <span className="text-lg font-bold">₹{stats.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Service Charge (5%)</p>
                  <p className="text-xs text-muted-foreground">Service fees</p>
                </div>
                <span className="text-lg font-bold">₹{stats.totalServiceCharge.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SalesReport;
