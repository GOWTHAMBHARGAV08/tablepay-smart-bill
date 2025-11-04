import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BillingSection from '@/components/BillingSection';
import OrderHistory from '@/components/OrderHistory';
import SalesReport from '@/components/SalesReport';
import MenuManagement from '@/components/MenuManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-6">
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
              <TabsTrigger value="menu">Menu Management</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports">
              <SalesReport />
            </TabsContent>
            
            <TabsContent value="history">
              <OrderHistory />
            </TabsContent>
            
            <TabsContent value="menu">
              <MenuManagement onMenuUpdate={() => {}} />
            </TabsContent>
            
            <TabsContent value="billing">
              <BillingSection />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
