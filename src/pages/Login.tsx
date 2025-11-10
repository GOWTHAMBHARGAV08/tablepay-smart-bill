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
import thoranamGarland from '@/assets/thoranam-garland.png';
import bananaLeafLeft from '@/assets/banana-leaf-left.png';
import bananaLeafRight from '@/assets/banana-leaf-right.png';
import paisleyPattern from '@/assets/paisley-pattern.png';
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
  return <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4"
      style={{
        background: 'linear-gradient(135deg, hsl(30 100% 60% / 0.15) 0%, hsl(35 100% 97%) 50%, hsl(51 100% 50% / 0.1) 100%)',
        backgroundImage: `url(${paisleyPattern})`,
        backgroundSize: '400px 400px',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'soft-light'
      }}
    >
      {/* Thoranam Garland at Top */}
      <div className="absolute top-0 left-0 right-0 w-full h-32 overflow-hidden z-10 pointer-events-none">
        <img 
          src={thoranamGarland} 
          alt="Thoranam Garland" 
          className="w-full h-full object-cover object-center opacity-90"
        />
      </div>

      {/* Banana Leaf Left Side */}
      <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-32 overflow-hidden z-0 pointer-events-none">
        <img 
          src={bananaLeafLeft} 
          alt="Banana Leaf" 
          className="w-full h-full object-cover object-center opacity-40"
        />
      </div>

      {/* Banana Leaf Right Side */}
      <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-32 overflow-hidden z-0 pointer-events-none">
        <img 
          src={bananaLeafRight} 
          alt="Banana Leaf" 
          className="w-full h-full object-cover object-center opacity-40"
        />
      </div>

      {/* Logo and Header */}
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="text-center mb-6 relative z-20">
        <motion.img src={logo} alt="TablePay Logo" className="h-32 w-auto mx-auto mb-2" initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.5,
        ease: "easeOut"
      }} />
        
        <p className="text-foreground text-lg">Smart Dining, Smarter Billing</p>
      </motion.div>

      {/* Three-Section Login */}
      <div className="w-full max-w-7xl grid lg:grid-cols-3 gap-6 relative z-20">
        {/* Admin Section */}
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.1
      }}>
          <Card className="shadow-lg border-2 border-[#FF9933]/30 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-3 pb-4">
              <div className="w-20 h-20 rounded-full bg-[#FF9933] mx-auto flex items-center justify-center">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Admin Portal</CardTitle>
              <CardDescription className="text-sm">Full system access and management</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs value={adminMode} onValueChange={v => setAdminMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-card">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-card">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email" className="text-sm font-medium">Email</Label>
                      <Input id="admin-email" type="email" placeholder="admin@tablepay.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
                      <Input id="admin-password" type="password" placeholder="••••••••" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required className="bg-background" />
                    </div>
                    <Button type="submit" className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" size="lg" disabled={adminLoading}>
                      {adminLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-name" className="text-sm font-medium">Full Name</Label>
                      <Input id="admin-signup-name" placeholder="John Doe" value={adminName} onChange={e => setAdminName(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-email" className="text-sm font-medium">Email</Label>
                      <Input id="admin-signup-email" type="email" placeholder="admin@tablepay.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-password" className="text-sm font-medium">Password</Label>
                      <Input id="admin-signup-password" type="password" placeholder="••••••••" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required minLength={6} className="bg-background" />
                    </div>
                    <Button type="submit" className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" size="lg" disabled={adminLoading}>
                      {adminLoading ? 'Creating Account...' : 'Sign Up'}
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
          <Card className="shadow-lg border-2 border-[#800000]/30 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-3 pb-4">
              <div className="w-20 h-20 rounded-full bg-[#800000] mx-auto flex items-center justify-center">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Cashier Portal</CardTitle>
              <CardDescription className="text-sm">Order taking and billing access</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs value={cashierMode} onValueChange={v => setCashierMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-card">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-card">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleCashierSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashier-email" className="text-sm font-medium">Email</Label>
                      <Input id="cashier-email" type="email" placeholder="cashier@tablepay.com" value={cashierEmail} onChange={e => setCashierEmail(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-password" className="text-sm font-medium">Password</Label>
                      <Input id="cashier-password" type="password" placeholder="••••••••" value={cashierPassword} onChange={e => setCashierPassword(e.target.value)} required className="bg-background" />
                    </div>
                    <Button type="submit" className="w-full bg-[#800000] hover:bg-[#800000]/90 text-white" size="lg" disabled={cashierLoading}>
                      {cashierLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleCashierSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-name" className="text-sm font-medium">Full Name</Label>
                      <Input id="cashier-signup-name" placeholder="Jane Smith" value={cashierName} onChange={e => setCashierName(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-email" className="text-sm font-medium">Email</Label>
                      <Input id="cashier-signup-email" type="email" placeholder="cashier@tablepay.com" value={cashierEmail} onChange={e => setCashierEmail(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashier-signup-password" className="text-sm font-medium">Password</Label>
                      <Input id="cashier-signup-password" type="password" placeholder="••••••••" value={cashierPassword} onChange={e => setCashierPassword(e.target.value)} required minLength={6} className="bg-background" />
                    </div>
                    <Button type="submit" className="w-full bg-[#800000] hover:bg-[#800000]/90 text-white" size="lg" disabled={cashierLoading}>
                      {cashierLoading ? 'Creating Account...' : 'Sign Up'}
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
          <Card className="shadow-lg border-2 border-[#FFD700]/30 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-3 pb-4">
              <div className="w-20 h-20 rounded-full bg-[#FFD700] mx-auto flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-[#800000]" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Kitchen Portal</CardTitle>
              <CardDescription className="text-sm">Order management and preparation</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs value={kitchenMode} onValueChange={v => setKitchenMode(v as LoginMode)}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-card">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-card">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleKitchenSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-email" className="text-sm font-medium">Email</Label>
                      <Input id="kitchen-email" type="email" placeholder="kitchen@tablepay.com" value={kitchenEmail} onChange={e => setKitchenEmail(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-password" className="text-sm font-medium">Password</Label>
                      <Input id="kitchen-password" type="password" placeholder="••••••••" value={kitchenPassword} onChange={e => setKitchenPassword(e.target.value)} required className="bg-background" />
                    </div>
                    <Button type="submit" className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#800000] font-semibold" size="lg" disabled={kitchenLoading}>
                      {kitchenLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleKitchenSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-signup-name" className="text-sm font-medium">Full Name</Label>
                      <Input id="kitchen-signup-name" placeholder="Chef Mike" value={kitchenName} onChange={e => setKitchenName(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-signup-email" className="text-sm font-medium">Email</Label>
                      <Input id="kitchen-signup-email" type="email" placeholder="kitchen@tablepay.com" value={kitchenEmail} onChange={e => setKitchenEmail(e.target.value)} required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-signup-password" className="text-sm font-medium">Password</Label>
                      <Input id="kitchen-signup-password" type="password" placeholder="••••••••" value={kitchenPassword} onChange={e => setKitchenPassword(e.target.value)} required minLength={6} className="bg-background" />
                    </div>
                    <Button type="submit" className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#800000] font-semibold" size="lg" disabled={kitchenLoading}>
                      {kitchenLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>;
};
export default Login;