import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import BillingSection from '@/components/BillingSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {profile.role === 'admin' ? (
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
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Order history coming soon...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="reports">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Reports and analytics coming soon...</p>
                </div>
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
