-- Add UPDATE policy for orders table so kitchen staff can update order status
CREATE POLICY "Users can update order status"
ON orders
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);