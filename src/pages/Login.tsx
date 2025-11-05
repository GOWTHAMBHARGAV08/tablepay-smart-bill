import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

type LoginMode = 'login' | 'signup';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, profile, role, user } = useAuth();
  
  // Admin section state
  const [adminMode, setAdminMode] = useState<LoginMode>('login');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Cashier section state
  const [cashierMode, setCashierMode] = useState<LoginMode>('login');
  const [cashierEmail, setCashierEmail] = useState('');
  const [cashierPassword, setCashierPassword] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [cashierLoading, setCashierLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/cashier-dashboard', { replace: true });
      }
    }
  }, [user, role, navigate]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);

    try {
      if (adminMode === 'login') {
        const { error } = await signIn(adminEmail, adminPassword);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Login successful!');
          // Navigation will be handled by useEffect based on role
        }
      } else {
        const { error } = await signUp(adminEmail, adminPassword, adminName, 'admin');
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! You can now log in.');
          setAdminMode('login');
          setAdminName('');
        }
      }
    } finally {
      setAdminLoading(false);
    }
  };

  const handleCashierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCashierLoading(true);

    try {
      if (cashierMode === 'login') {
        const { error } = await signIn(cashierEmail, cashierPassword);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Login successful!');
          // Navigation will be handled by useEffect based on role
        }
      } else {
        const { error } = await signUp(cashierEmail, cashierPassword, cashierName, 'cashier');
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! You can now log in.');
          setCashierMode('login');
          setCashierName('');
        }
      }
    } finally {
      setCashierLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/20 p-4">
      {/* Logo and Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.img 
          src={logo} 
          alt="TablePay Logo" 
          className="h-40 w-auto mx-auto mb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <h1 className="text-4xl font-bold">TablePay</h1>
        <p className="text-muted-foreground">Smart Dining, Smarter Billing</p>
      </motion.div>

      {/* Two-Section Login */}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6">
        {/* Admin Section - Mint Green */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-2xl border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-2">
                <LogIn className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Full system access and management</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={adminMode} onValueChange={(v) => setAdminMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@tablepay.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={adminLoading}>
                      {adminLoading ? 'Logging in...' : 'Login as Admin'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-name">Full Name</Label>
                      <Input
                        id="admin-signup-name"
                        placeholder="John Doe"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-email">Email</Label>
                      <Input
                        id="admin-signup-email"
                        type="email"
                        placeholder="admin@tablepay.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-password">Password</Label>
                      <Input
                        id="admin-signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={adminLoading}>
                      {adminLoading ? 'Creating Account...' : 'Create Admin Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cashier Section - Pastel Pink */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-2xl border-2 border-secondary/50 bg-gradient-to-br from-card to-secondary/10">
            <CardHeader className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-2">
                <UserPlus className="h-8 w-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Cashier Portal</CardTitle>
              <CardDescription>Order taking and billing access</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={cashierMode} onValueChange={(v) => setCashierMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleCashierSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashier-email">Email</Label>
                      <Input
                        id="cashier-email"
                        type="email"
                        placeholder="cashier@tablepay.com"
                        value={cashierEmail}
                        onChange={(e) => setCashierEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-password">Password</Label>
                      <Input
                        id="cashier-password"
                        type="password"
                        placeholder="••••••••"
                        value={cashierPassword}
                        onChange={(e) => setCashierPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" variant="secondary" className="w-full" size="lg" disabled={cashierLoading}>
                      {cashierLoading ? 'Logging in...' : 'Login as Cashier'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleCashierSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-name">Full Name</Label>
                      <Input
                        id="cashier-signup-name"
                        placeholder="Jane Smith"
                        value={cashierName}
                        onChange={(e) => setCashierName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-email">Email</Label>
                      <Input
                        id="cashier-signup-email"
                        type="email"
                        placeholder="cashier@tablepay.com"
                        value={cashierEmail}
                        onChange={(e) => setCashierEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-password">Password</Label>
                      <Input
                        id="cashier-signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={cashierPassword}
                        onChange={(e) => setCashierPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" variant="secondary" className="w-full" size="lg" disabled={cashierLoading}>
                      {cashierLoading ? 'Creating Account...' : 'Create Cashier Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
