-- Update orders table to have proper kitchen status tracking
ALTER TABLE orders 
ALTER COLUMN status SET DEFAULT 'pending';

-- Add comment for clarity
COMMENT ON COLUMN orders.status IS 'Order status: pending, cooking, ready, completed';

-- Enable realtime for orders table so kitchen gets instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable realtime for order_items table
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;