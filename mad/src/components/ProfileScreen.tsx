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
import { API_ENDPOINTS } from '../config/api';

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
  const [sellerRating, setSellerRating] = React.useState<{
    totalReviews: number;
    averageRating: string;
    reviews: Array<{
      _id: string;
      rating: number;
      comment: string;
      createdAt: string;
      reviewerId: { name: string; avatar?: string };
      itemId: { title: string };
    }>;
  } | null>(null);
  const [activeBids, setActiveBids] = React.useState<Array<{
    _id: string;
    title: string;
    currentBid: number;
    auctionEndDate: string;
    images: string[];
  }>>([]);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch seller reviews
  React.useEffect(() => {
    const fetchSellerReviews = async () => {
      if (!user?._id) return;

      try {
        const response = await fetch(API_ENDPOINTS.GET_SELLER_REVIEWS(user._id));
        if (response.ok) {
          const data = await response.json();
          setSellerRating(data);
        }
      } catch (error) {
        console.error('Error fetching seller reviews:', error);
      }
    };

    if (user) {
      fetchSellerReviews();
    }
  }, [user]);

  // Fetch active bids
  React.useEffect(() => {
    const fetchActiveBids = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(API_ENDPOINTS.GET_MY_BIDS, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setActiveBids(data.bids || []);
        }
      } catch (error) {
        console.error('Error fetching active bids:', error);
      }
    };

    if (user) {
      fetchActiveBids();
    }
  }, [user]);

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

        {/* Seller Rating Display */}
        {sellerRating && sellerRating.totalReviews > 0 && (
          <Card className="mt-4 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg">Seller Rating</h3>
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-amber-500 text-amber-500" />
                <span className="text-lg font-bold">{sellerRating.averageRating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {sellerRating.totalReviews} review{sellerRating.totalReviews !== 1 ? 's' : ''}
            </p>
          </Card>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <Clock className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-xl">{activeBids.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Bids</p>
          </Card>
          <Card className="p-4 text-center">
            <ShoppingBag className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-xl">0</p>
            <p className="text-xs text-muted-foreground mt-1">Purchases</p>
          </Card>
          <Card className="p-4 text-center">
            <Star className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-xl">{sellerRating?.totalReviews || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Reviews</p>
          </Card>
        </div>

        {/* My Bids */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>My Active Bids</h3>
            {activeBids.length > 0 && (
              <Button variant="link" size="sm" className="text-amber-700 p-0">
                View All
              </Button>
            )}
          </div>
          {activeBids.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No active bids yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start bidding on auction items
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeBids.slice(0, 3).map((bid) => (
                <Card key={bid._id} className="p-4">
                  <div className="flex gap-3">
                    {bid.images && bid.images[0] && (
                      <img
                        src={bid.images[0]}
                        alt={bid.title}
                        className="size-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{bid.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Current Bid: <span className="text-amber-700 font-semibold">{formatPrice(bid.currentBid)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="size-3 inline mr-1" />
                        Ends: {new Date(bid.auctionEndDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Customer Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>Customer Reviews</h3>
            {sellerRating && sellerRating.averageRating && (
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-medium">{sellerRating.averageRating}</span>
              </div>
            )}
          </div>
          {sellerRating && sellerRating.reviews && sellerRating.reviews.length > 0 ? (
            <div className="space-y-3">
              {sellerRating.reviews.map((review) => (
                <Card key={review._id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      {review.reviewerId.avatar && <AvatarImage src={review.reviewerId.avatar} />}
                      <AvatarFallback>
                        {review.reviewerId.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{review.reviewerId.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3 ${
                                i < review.rating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        For: {review.itemId.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No reviews yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reviews from buyers will appear here
              </p>
            </Card>
          )}
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