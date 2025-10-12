import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import BillingSection from '@/components/BillingSection';
import OrderHistory from '@/components/OrderHistory';
import SalesReport from '@/components/SalesReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {role === 'admin' ? (
            <Tabs defaultValue="billing" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="history">Order History</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="billing">
                <BillingSection />
              </TabsContent>
              
              <TabsContent value="history">
                <OrderHistory />
              </TabsContent>
              
              <TabsContent value="reports">
                <SalesReport />
              </TabsContent>
            </Tabs>
          ) : (
            <BillingSection />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
