import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

interface MenuManagementProps {
  onMenuUpdate: () => void;
}

const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages'] as const;

const MenuManagement = ({ onMenuUpdate }: MenuManagementProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItemInsert>>({
    name: '',
    category: 'Starters',
    price: 0,
    description: '',
    available: true,
    image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const { error } = await supabase
        .from('menu_items')
        .insert([{ ...formData, image_url: imageUrl } as MenuItemInsert]);

      if (error) throw error;

      toast.success('Item added successfully');
      setFormData({ name: '', category: 'Starters', price: 0, description: '', available: true, image_url: '' });
      setImageFile(null);
      fetchMenuItems();
      onMenuUpdate();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.price || !editingId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const { error } = await supabase
        .from('menu_items')
        .update({ ...formData, image_url: imageUrl } as MenuItemUpdate)
        .eq('id', editingId);

      if (error) throw error;

      toast.success('Item updated successfully');
      setEditingId(null);
      setFormData({ name: '', category: 'Starters', price: 0, description: '', available: true, image_url: '' });
      setImageFile(null);
      fetchMenuItems();
      onMenuUpdate();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Item deleted successfully');
      fetchMenuItems();
      onMenuUpdate();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Starters', price: 0, description: '', available: true, image_url: '' });
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading menu...</p>
      </div>
    );
  }

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
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as typeof categories[number] })}
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
                step="0.01"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available ?? true}
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
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Item Photo</Label>
              <div className="flex items-center gap-4">
                {(formData.image_url || imageFile) && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url || ''}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImageFile(file);
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image for this menu item
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Button onClick={handleAdd} className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </>
                )}
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
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Name"
                        />
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value as typeof categories[number] })}
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
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          placeholder="Price"
                        />
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.available ?? true}
                            onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                          />
                          <Label>Available</Label>
                        </div>
                        <Textarea
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Description"
                          className="md:col-span-2"
                        />
                        <div className="md:col-span-2">
                          <Label className="text-xs">Item Photo</Label>
                          <div className="flex items-center gap-3 mt-2">
                            {(formData.image_url || imageFile) && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                <img
                                  src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url || ''}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setImageFile(file);
                              }}
                              className="cursor-pointer text-xs"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                          <Button onClick={handleUpdate} size="sm" className="flex-1" disabled={uploading}>
                            {uploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Save
                              </>
                            )}
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
                        {item.image_url && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
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
