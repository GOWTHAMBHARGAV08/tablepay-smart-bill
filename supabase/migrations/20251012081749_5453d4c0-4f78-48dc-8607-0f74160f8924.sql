-- Add image_url column to menu_items table
ALTER TABLE public.menu_items
ADD COLUMN image_url TEXT;

-- Create storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for menu item images
CREATE POLICY "Anyone can view menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

CREATE POLICY "Authenticated users can upload menu images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update menu images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete menu images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-images' 
  AND auth.uid() IS NOT NULL
);