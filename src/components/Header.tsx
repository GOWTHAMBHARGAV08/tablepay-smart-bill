import { LogOut, Moon, Sun, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import logo from '@/assets/tablepay-logo.png';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [readyOrdersCount, setReadyOrdersCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    }
  }, []);

  // Fetch and subscribe to ready orders count (only for cashier/admin)
  useEffect(() => {
    if (!role || role === 'kitchen') return;

    const fetchReadyCount = async () => {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ready');
      setReadyOrdersCount(count || 0);
    };

    fetchReadyCount();

    const channel = supabase
      .channel('ready-orders-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.ready',
        },
        () => {
          fetchReadyCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.img 
            src={logo} 
            alt="TablePay" 
            className="h-16 w-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">TablePay</h1>
            <p className="text-xs text-muted-foreground">Smart Dining, Smarter Billing</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {profile && (
            <div className="text-right mr-4">
              <p className="text-sm font-medium">{profile.full_name || profile.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
          
          {role && role !== 'kitchen' && readyOrdersCount > 0 && (
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                variant="destructive"
              >
                {readyOrdersCount}
              </Badge>
            </div>
          )}
          
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {profile && (
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
