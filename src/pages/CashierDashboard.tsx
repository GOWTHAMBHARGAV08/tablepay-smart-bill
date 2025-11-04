import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BillingSection from '@/components/BillingSection';

const CashierDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BillingSection />
        </motion.div>
      </main>
    </div>
  );
};

export default CashierDashboard;
