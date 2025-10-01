import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'] as const;

const MenuList = ({ items, onAddToCart }: MenuListProps) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory && item.available;
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Menu</CardTitle>
        <CardDescription>Browse and add items to your order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="grid grid-cols-5 w-full">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs sm:text-sm">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      ₹{item.price}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{item.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => onAddToCart(item)} className="w-full" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No items found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuList;
