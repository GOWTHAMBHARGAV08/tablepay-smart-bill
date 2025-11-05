import { useState, useRef } from 'react';
import { X, Download, Printer, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import logo from '@/assets/logo.png';
import upiQrCode from '@/assets/upi-qr-code.jpg';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type CartItem = MenuItem & { quantity: number };
type Customer = { name: string; tableNumber: string; contact: string };

interface InvoiceModalProps {
  cart: CartItem[];
  customer: Customer;
  onClose: () => void;
  onComplete: () => void;
}

const InvoiceModal = ({ cart, customer, onClose, onComplete }: InvoiceModalProps) => {
  const { user } = useAuth();
  const [paymentMode, setPaymentMode] = useState<'cash' | 'card' | 'upi'>('cash');
  const [saving, setSaving] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const orderId = `TP${Date.now().toString().slice(-8)}`;
  const date = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const discount = 0;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + tax - discount + serviceCharge;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`TablePay_Invoice_${orderId}.pdf`);
  };

  const handleCompleteOrder = async () => {
    setSaving(true);
    try {
      // Save order to database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderId,
          customer_name: customer.name,
          customer_contact: customer.contact || null,
          table_number: customer.tableNumber,
          subtotal,
          tax,
          discount,
          service_charge: serviceCharge,
          total,
          payment_mode: paymentMode,
          status: 'completed',
          created_by: user?.id,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        line_total: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      onComplete();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div ref={invoiceRef} className="bg-white p-8 space-y-6 text-foreground">
          {/* Header */}
          <div className="text-center border-b-2 border-primary pb-4">
            <img src={logo} alt="TablePay" className="h-16 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-primary">TablePay</h1>
            <p className="text-sm text-muted-foreground">Smart Dining, Smarter Billing</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Order ID:</p>
              <p className="text-muted-foreground">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Date & Time:</p>
              <p className="text-muted-foreground">{date}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-1 text-sm">
            <p><span className="font-semibold">Customer:</span> {customer.name}</p>
            <p><span className="font-semibold">Table Number:</span> {customer.tableNumber}</p>
            {customer.contact && <p><span className="font-semibold">Contact:</span> {customer.contact}</p>}
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-sm">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="text-left p-2">Item</th>
                  <th className="text-center p-2">Qty</th>
                  <th className="text-right p-2">Price</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.name}</td>
                    <td className="text-center p-2">{item.quantity}</td>
                    <td className="text-right p-2">₹{item.price}</td>
                    <td className="text-right p-2">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bill Summary */}
          <div className="border-t-2 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Service Charge (5%)</span>
              <span>₹{serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
              <span>Grand Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Payment Mode</Label>
            <RadioGroup value={paymentMode} onValueChange={(v) => setPaymentMode(v as typeof paymentMode)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                  <Wallet className="h-4 w-4" /> Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" /> Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" /> UPI
                </Label>
              </div>
            </RadioGroup>
            
            {/* UPI QR Code */}
            {paymentMode === 'upi' && (
              <div className="flex justify-center pt-4 pb-2">
                <div className="bg-white p-4 rounded-lg border-2 border-primary shadow-lg">
                  <p className="text-sm font-semibold text-center mb-2">Scan to Pay</p>
                  <img src={upiQrCode} alt="UPI QR Code" className="w-48 h-48 object-contain" />
                  <p className="text-xs text-muted-foreground text-center mt-2">Scan with any UPI app</p>
                </div>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground mb-2">Scan for feedback</p>
            <QRCodeSVG value={`https://feedback.tablepay.com/${orderId}`} size={100} className="mx-auto" />
          </div>

          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>Thank you for dining with us!</p>
            <p>Visit us again soon</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handleCompleteOrder} className="flex-1" disabled={saving}>
            {saving ? 'Saving...' : 'Complete Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
