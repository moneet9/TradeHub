import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { API_ENDPOINTS } from '../config/api';

interface AuthScreenProps {
  onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ---------------- API CALLS ----------------

  const loginUser = async (payload: {
    emailOrPhone: string;
    password: string;
  }) => {
    const res = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  };

  const registerUser = async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const res = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  };

  const fetchCurrentUser = async (token: string) => {
    const res = await fetch(API_ENDPOINTS.GET_ME, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load user');

    const user = data.user || data;
    if (user && !user._id && user.id) {
      user._id = user.id;
    }

    return user;
  };

  // ---------------- HANDLERS ----------------

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const data = await loginUser({
        emailOrPhone: formData.get('email') as string,
        password: formData.get('password') as string,
      });

      if (!data.token) {
        throw new Error('Missing auth token');
      }

      const user = await fetchCurrentUser(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const signupEmail = formData.get('signup-email') as string;
    const signupPassword = formData.get('signup-password') as string;

    try {
      await registerUser({
        name: formData.get('name') as string,
        email: signupEmail,
        phone: formData.get('phone') as string,
        password: signupPassword,
      });

      const loginData = await loginUser({
        emailOrPhone: signupEmail,
        password: signupPassword,
      });

      if (!loginData.token) {
        throw new Error('Missing auth token');
      }

      const user = await fetchCurrentUser(loginData.token);
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGIN / SIGNUP ----------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-4">🏺</div>
          <h1 className="text-3xl">Trade Hub</h1>
          <p className="text-muted-foreground">
            Discover timeless treasures from the past
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Login to continue your antique journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <Input id="email" name="email" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800" disabled={loading}>
                    {loading ? 'Please wait...' : 'Login'}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join our community of collectors and sellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="signup-email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="signup-password" type="password" required />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800" disabled={loading}>
                    {loading ? 'Please wait...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
