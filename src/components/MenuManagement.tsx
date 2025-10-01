import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MenuManagementProps {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
}

const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages'] as const;

const MenuManagement = ({ menuItems, setMenuItems }: MenuManagementProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Starters',
    price: 0,
    description: '',
    available: true,
  });

  const handleAdd = () => {
    if (!formData.name || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category as MenuItem['category'],
      price: Number(formData.price),
      description: formData.description || '',
      available: formData.available ?? true,
    };

    setMenuItems([...menuItems, newItem]);
    setFormData({ name: '', category: 'Starters', price: 0, description: '', available: true });
    toast.success('Item added successfully');
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    setMenuItems(
      menuItems.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: formData.name!,
              category: formData.category as MenuItem['category'],
              price: Number(formData.price),
              description: formData.description || '',
              available: formData.available ?? true,
            }
          : item
      )
    );
    setEditingId(null);
    setFormData({ name: '', category: 'Starters', price: 0, description: '', available: true });
    toast.success('Item updated successfully');
  };

  const handleDelete = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast.success('Item deleted successfully');
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Starters', price: 0, description: '', available: true });
  };

  return (
    <div className="space-y-6">
      {/* Add New Item Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Add New Menu Item</CardTitle>
          <CardDescription>Create a new item for your menu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Butter Chicken"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available</Label>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Button onClick={handleAdd} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Manage Menu Items</CardTitle>
          <CardDescription>Edit or delete existing items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {editingId === item.id ? (
                  <Card className="bg-accent/20">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Name"
                        />
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem['category'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          placeholder="Price"
                        />
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.available}
                            onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                          />
                          <Label>Available</Label>
                        </div>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Description"
                          className="md:col-span-2"
                        />
                        <div className="md:col-span-2 flex gap-2">
                          <Button onClick={handleUpdate} size="sm" className="flex-1">
                            <Check className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{item.name}</h3>
                            <span className="text-sm font-medium text-primary whitespace-nowrap">₹{item.price}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex gap-2 text-xs">
                            <span className="bg-muted px-2 py-1 rounded">{item.category}</span>
                            <span className={`px-2 py-1 rounded ${item.available ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="icon" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManagement;
