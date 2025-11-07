-- Allow full order status lifecycle in orders.status
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check CHECK (status IN ('pending','cooking','ready','completed'));

-- Ensure sensible default
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';