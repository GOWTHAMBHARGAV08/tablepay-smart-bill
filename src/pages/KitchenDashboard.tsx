import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KitchenDashboard = () => {
  const [orders] = useState([
    {
      id: 1,
      table: 5,
      items: ['Butter Chicken', 'Naan x2', 'Dal Makhani'],
      status: 'pending',
      time: '2 mins ago',
      special: 'Extra spicy'
    },
    {
      id: 2,
      table: 3,
      items: ['Paneer Tikka', 'Biryani', 'Raita'],
      status: 'cooking',
      time: '5 mins ago',
      special: null
    }
  ]);

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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="cooking">Cooking</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {orders.map((order, index) => (
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
                        Table {order.table}
                        <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
                          {order.status}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {order.time}
                      </div>
                    </div>
                    {order.special && (
                      <CardDescription className="flex items-center gap-2 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        {order.special}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-2 pt-2">
                        {order.status === 'pending' && (
                          <Button className="flex-1">
                            <ChefHat className="mr-2 h-4 w-4" />
                            Start Cooking
                          </Button>
                        )}
                        {order.status === 'cooking' && (
                          <Button className="flex-1" variant="secondary">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Ready
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="pending">
            <p className="text-center text-muted-foreground py-8">Filter for pending orders</p>
          </TabsContent>
          <TabsContent value="cooking">
            <p className="text-center text-muted-foreground py-8">Filter for cooking orders</p>
          </TabsContent>
          <TabsContent value="ready">
            <p className="text-center text-muted-foreground py-8">Filter for ready orders</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default KitchenDashboard;
