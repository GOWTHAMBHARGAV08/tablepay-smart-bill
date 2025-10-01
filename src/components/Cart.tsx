import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type CartItem = MenuItem & { quantity: number };
type Customer = { name: string; tableNumber: string; contact: string };

interface CartProps {
  cart: CartItem[];
  customer: Customer;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
}

const Cart = ({ cart, customer, onUpdateQuantity, onUpdateCustomer, onClearCart, onPlaceOrder }: CartProps) => {
  const [discountPercent, setDiscountPercent] = useState(0);
  const [serviceChargePercent, setServiceChargePercent] = useState(5);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% GST
  const discount = subtotal * (discountPercent / 100);
  const serviceCharge = subtotal * (serviceChargePercent / 100);
  const total = subtotal + tax - discount + serviceCharge;

  return (
    <Card className="shadow-lg sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Cart & Billing
        </CardTitle>
        <CardDescription>Review your order and checkout</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Customer Details</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="customer-name" className="text-xs">Name</Label>
              <Input
                id="customer-name"
                placeholder="Customer name"
                value={customer.name}
                onChange={(e) => onUpdateCustomer({ ...customer, name: e.target.value })}
                size={32}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="table-number" className="text-xs">Table No.</Label>
                <Input
                  id="table-number"
                  placeholder="Table"
                  value={customer.tableNumber}
                  onChange={(e) => onUpdateCustomer({ ...customer, tableNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact" className="text-xs">Contact</Label>
                <Input
                  id="contact"
                  placeholder="Phone"
                  value={customer.contact}
                  onChange={(e) => onUpdateCustomer({ ...customer, contact: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cart Items */}
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-semibold w-16 text-right">₹{item.price * item.quantity}</p>
              </motion.div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <Separator />

            {/* Charges */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="discount" className="text-xs">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="service" className="text-xs">Service Charge (%)</Label>
                  <Input
                    id="service"
                    type="number"
                    min="0"
                    max="100"
                    value={serviceChargePercent}
                    onChange={(e) => setServiceChargePercent(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Bill Summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              {serviceCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Charge ({serviceChargePercent}%)</span>
                  <span>₹{serviceCharge.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {cart.length > 0 && (
        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={onClearCart} className="flex-1">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button onClick={onPlaceOrder} className="flex-1">
            <CreditCard className="mr-2 h-4 w-4" />
            Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Cart;
