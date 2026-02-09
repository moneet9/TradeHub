import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Star,
  MapPin,
  Calendar,
  Heart,
  ShoppingBag,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
} from 'lucide-react';
import { formatPrice } from '../lib/utils-data';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface ProfileScreenProps {
  onLogout: () => void;
  onSwitchToSeller: () => void;
  onOpenSettings: () => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export function ProfileScreen({ onLogout, onSwitchToSeller, onOpenSettings }: ProfileScreenProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className="pb-20 flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-50 to-background p-6 relative">
        {/* Settings Icon in top right */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onOpenSettings}
        >
          <Settings className="size-5 text-amber-700" />
        </Button>

        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            {user.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback className="text-2xl bg-amber-200">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2>{user.name}</h2>
            
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <Mail className="size-3" />
              <span>{user.email}</span>
            </div>
           
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={onSwitchToSeller}
        >
          Switch to Seller Dashboard
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <Clock className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-xl">0</p>
            <p className="text-xs text-muted-foreground mt-1">Active Bids</p>
          </Card>
          <Card className="p-4 text-center">
            <ShoppingBag className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-xl">0</p>
            <p className="text-xs text-muted-foreground mt-1">Purchases</p>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-xl">0</p>
            <p className="text-xs text-muted-foreground mt-1">Wishlist</p>
          </Card>
        </div>

        {/* My Bids */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>My Active Bids</h3>
            <Button variant="link" size="sm" className="text-amber-700 p-0">
              View All
            </Button>
          </div>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground text-sm">No active bids yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start bidding on auction items
            </p>
          </Card>
        </div>

        <Separator />

        {/* My Purchases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>Recent Purchases</h3>
            <Button variant="link" size="sm" className="text-amber-700 p-0">
              View All
            </Button>
          </div>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground text-sm">No purchases yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your purchase history will appear here
            </p>
          </Card>
        </div>

        <Separator />

       
        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}