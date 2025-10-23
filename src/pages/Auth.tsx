import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { z } from 'zod';
import AnimatedBackground from '@/components/common/AnimatedBackground';
import Seo from '@/components/common/Seo';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created! Welcome to Ares');
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'discord') => {
    setLoading(true);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title={isLogin ? "Sign In - Ares" : "Sign Up - Ares"}
        description={isLogin ? "Sign in to your Ares account" : "Create your Ares account"}
      />
      <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
        <AnimatedBackground />
        
        <Card className="w-full max-w-md p-8 glass-card relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {isLogin ? 'Welcome Back' : 'Join Ares'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn('discord')}
              disabled={loading}
            >
              Discord
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Auth;
