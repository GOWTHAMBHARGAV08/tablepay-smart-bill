-- Fix infinite recursion in RLS policies by using has_role function

-- Drop existing problematic policies on menu_items
DROP POLICY IF EXISTS "Admins can delete menu items" ON menu_items;
DROP POLICY IF EXISTS "Admins can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Admins can update menu items" ON menu_items;

-- Drop problematic policy on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Recreate menu_items policies using has_role function
CREATE POLICY "Admins can delete menu items" 
ON menu_items 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can insert menu items" 
ON menu_items 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can update menu items" 
ON menu_items 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Recreate profiles policy using has_role function
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));