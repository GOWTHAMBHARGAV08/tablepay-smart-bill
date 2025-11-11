import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ChefHat } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import logo from '@/assets/tablepay-logo.png';
import adminAvatar from '@/assets/admin-avatar.png';
import cashierAvatar from '@/assets/cashier-avatar.png';
import kitchenAvatar from '@/assets/kitchen-avatar.png';
import thoranam from '@/assets/thoranam.png';
type LoginMode = 'login' | 'signup';
const Login = () => {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    profile,
    role,
    user
  } = useAuth();

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

  // Kitchen section state
  const [kitchenMode, setKitchenMode] = useState<LoginMode>('login');
  const [kitchenEmail, setKitchenEmail] = useState('');
  const [kitchenPassword, setKitchenPassword] = useState('');
  const [kitchenName, setKitchenName] = useState('');
  const [kitchenLoading, setKitchenLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin-dashboard', {
          replace: true
        });
      } else if (role === 'kitchen') {
        navigate('/kitchen-dashboard', {
          replace: true
        });
      } else {
        navigate('/cashier-dashboard', {
          replace: true
        });
      }
    }
  }, [user, role, navigate]);
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    try {
      if (adminMode === 'login') {
        const {
          error
        } = await signIn(adminEmail, adminPassword);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Login successful!');
          // Navigation will be handled by useEffect based on role
        }
      } else {
        const {
          error
        } = await signUp(adminEmail, adminPassword, adminName, 'admin');
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
        const {
          error
        } = await signIn(cashierEmail, cashierPassword);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Login successful!');
          // Navigation will be handled by useEffect based on role
        }
      } else {
        const {
          error
        } = await signUp(cashierEmail, cashierPassword, cashierName, 'cashier');
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

  const handleKitchenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKitchenLoading(true);
    try {
      if (kitchenMode === 'login') {
        const {
          error
        } = await signIn(kitchenEmail, kitchenPassword);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Login successful!');
          // Navigation will be handled by useEffect based on role
        }
      } else {
        const {
          error
        } = await signUp(kitchenEmail, kitchenPassword, kitchenName, 'kitchen');
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! You can now log in.');
          setKitchenMode('login');
          setKitchenName('');
        }
      }
    } finally {
      setKitchenLoading(false);
    }
  };
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFECD0] to-[#FFE4B5] relative overflow-hidden">
      {/* Thoranam Decoration */}
      <div className="absolute top-0 left-0 right-0 w-full z-10 h-48">
        <img 
          src={thoranam} 
          alt="Thoranam Decoration" 
          className="w-full h-full object-cover"
          style={{ 
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            objectPosition: 'center top'
          }}
        />
      </div>

      <div className="relative z-20 p-4 pt-36">
        {/* Logo and Header */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-8">
          <motion.img src={logo} alt="TablePay Logo" className="h-40 w-auto mx-auto mb-3" initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5,
          ease: "easeOut"
        }} />
          
          <p className="text-[#800000] font-medium text-lg">Smart Dining, Smarter Billing</p>
        </motion.div>

        {/* Three-Section Login */}
        <div className="w-full max-w-7xl grid lg:grid-cols-3 gap-6">
        {/* Admin Section - Mint Green */}
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.1
      }}>
          <Card className="shadow-2xl border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="text-center space-y-2">
              <img src={adminAvatar} alt="Admin" className="w-24 h-24 mx-auto mb-2" />
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Full system access and management</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={adminMode} onValueChange={v => setAdminMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input id="admin-email" type="email" placeholder="admin@tablepay.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input id="admin-password" type="password" placeholder="••••••••" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required />
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
                      <Input id="admin-signup-name" placeholder="John Doe" value={adminName} onChange={e => setAdminName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-email">Email</Label>
                      <Input id="admin-signup-email" type="email" placeholder="admin@tablepay.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-password">Password</Label>
                      <Input id="admin-signup-password" type="password" placeholder="••••••••" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required minLength={6} />
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

        {/* Cashier Section */}
        <motion.div initial={{
        opacity: 0,
        x: 0
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }}>
          <Card className="shadow-2xl border-2 border-secondary/50 bg-gradient-to-br from-card to-secondary/10">
            <CardHeader className="text-center space-y-2">
              <img src={cashierAvatar} alt="Cashier" className="w-24 h-24 mx-auto mb-2" />
              <CardTitle className="text-2xl">Cashier Portal</CardTitle>
              <CardDescription>Order taking and billing access</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={cashierMode} onValueChange={v => setCashierMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleCashierSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashier-email">Email</Label>
                      <Input id="cashier-email" type="email" placeholder="cashier@tablepay.com" value={cashierEmail} onChange={e => setCashierEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-password">Password</Label>
                      <Input id="cashier-password" type="password" placeholder="••••••••" value={cashierPassword} onChange={e => setCashierPassword(e.target.value)} required />
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
                      <Input id="cashier-signup-name" placeholder="Jane Smith" value={cashierName} onChange={e => setCashierName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-email">Email</Label>
                      <Input id="cashier-signup-email" type="email" placeholder="cashier@tablepay.com" value={cashierEmail} onChange={e => setCashierEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-password">Password</Label>
                      <Input id="cashier-signup-password" type="password" placeholder="••••••••" value={cashierPassword} onChange={e => setCashierPassword(e.target.value)} required minLength={6} />
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

        {/* Kitchen Section */}
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.3
      }}>
          <Card className="shadow-2xl border-2 border-accent/50 bg-gradient-to-br from-card to-accent/10">
            <CardHeader className="text-center space-y-2">
              <img src={kitchenAvatar} alt="Kitchen" className="w-24 h-24 mx-auto mb-2" />
              <CardTitle className="text-2xl">Kitchen Portal</CardTitle>
              <CardDescription>Order management and preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={kitchenMode} onValueChange={v => setKitchenMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleKitchenSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-email">Email</Label>
                      <Input id="kitchen-email" type="email" placeholder="kitchen@tablepay.com" value={kitchenEmail} onChange={e => setKitchenEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-password">Password</Label>
                      <Input id="kitchen-password" type="password" placeholder="••••••••" value={kitchenPassword} onChange={e => setKitchenPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" variant="outline" className="w-full" size="lg" disabled={kitchenLoading}>
                      {kitchenLoading ? 'Logging in...' : 'Login as Kitchen'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleKitchenSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-signup-name">Full Name</Label>
                      <Input id="kitchen-signup-name" placeholder="Chef Mike" value={kitchenName} onChange={e => setKitchenName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-signup-email">Email</Label>
                      <Input id="kitchen-signup-email" type="email" placeholder="kitchen@tablepay.com" value={kitchenEmail} onChange={e => setKitchenEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-signup-password">Password</Label>
                      <Input id="kitchen-signup-password" type="password" placeholder="••••••••" value={kitchenPassword} onChange={e => setKitchenPassword(e.target.value)} required minLength={6} />
                    </div>
                    <Button type="submit" variant="outline" className="w-full" size="lg" disabled={kitchenLoading}>
                      {kitchenLoading ? 'Creating Account...' : 'Create Kitchen Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </div>;
};
export default Login;