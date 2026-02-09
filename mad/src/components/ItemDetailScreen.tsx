import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Listing } from '../lib/mock-data';
import { formatPrice, formatTimeLeft } from '../lib/utils-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface ItemDetailScreenProps {
  listing: Listing;
  onBack: () => void;
  onChat: () => void;
}

export function ItemDetailScreen({ listing, onBack, onChat }: ItemDetailScreenProps) {
  const [timeLeft, setTimeLeft] = React.useState(
    listing.auctionEndTime ? formatTimeLeft(listing.auctionEndTime) : null
  );
  const [bidAmount, setBidAmount] = React.useState(
    listing.currentBid ? listing.currentBid + (listing.bidIncrement || 1000) : 0
  );
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isPlacingBid, setIsPlacingBid] = React.useState(false);

  React.useEffect(() => {
    if (listing.type === 'auction' && listing.auctionEndTime) {
      const interval = setInterval(() => {
        setTimeLeft(formatTimeLeft(listing.auctionEndTime!));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [listing]);

  const handlePlaceBid = async () => {
    if (!bidAmount || bidAmount <= 0) {
      toast.error('Invalid bid amount');
      return;
    }

    try {
      setIsPlacingBid(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please log in to place a bid');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/items/${listing.id}/bid`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to place bid');
        return;
      }

      toast.success('Bid placed successfully!', {
        description: `Your bid of ${formatPrice(bidAmount)} has been placed.`,
      });

      // Update bid amount for next bid (using seller's increment)
      const nextBid = bidAmount + (listing.bidIncrement || 1000);
      setBidAmount(nextBid);
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleBuyNow = () => {
    toast.success('Item added to cart!', {
      description: 'Proceed to checkout to complete your purchase.',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="size-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-gray-200">
        {listing.images && listing.images.length > 0 && listing.images[currentImageIndex] ? (
          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            className="w-full aspect-square object-cover"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-gray-300">
            <span className="text-gray-600">No image available</span>
          </div>
        )}
        {listing.type === 'auction' && timeLeft && (
          <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-2 rounded-lg flex items-center gap-2">
            <Clock className="size-4" />
            <div>
              <p className="text-xs">Ends in</p>
              <p className="font-semibold">{timeLeft}</p>
            </div>
          </div>
        )}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {listing.images.map((_, index) => (
              <button
                key={index}
                className={`size-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Title and Price */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1>{listing.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{listing.condition}</Badge>
                <Badge variant="outline">{listing.era}</Badge>
                <Badge variant="outline">{listing.category}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {listing.type === 'auction' ? 'Current Bid' : 'Price'}
            </p>
            <p className="text-3xl text-amber-700">
              {formatPrice(listing.type === 'auction' ? listing.currentBid! : listing.price)}
            </p>
            {listing.type === 'auction' && (
              <p className="text-sm text-muted-foreground mt-1">
                {listing.bidCount} bids · {listing.views} views
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Seller Info */}
        <div>
          <h3 className="mb-3">Seller Information</h3>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={listing.seller.avatar} />
                <AvatarFallback>{listing.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p>{listing.seller.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="size-3 fill-amber-500 text-amber-500" />
                  <span className="text-sm">
                    {listing.seller.rating} ({listing.seller.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {listing.seller.memberSince}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onChat}>
              <MessageSquare className="size-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="mb-3">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {listing.description}
          </p>
        </div>

        <Separator />

        {/* Location & Shipping */}
        <div>
          <h3 className="mb-3">Location & Shipping</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-muted-foreground" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="size-4 text-muted-foreground" />
              <span>Shipping available · Pickup available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <span>Buyer protection included</span>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        <div>
          <h3 className="mb-3">Similar Items</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <img
                  src={listing.images[0]}
                  alt="Similar item"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-2">
                  <p className="text-sm line-clamp-2">Similar Antique Item</p>
                  <p className="text-sm text-amber-700 mt-1">$1,200</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
        <div className="max-w-lg mx-auto">
          {listing.type === 'auction' ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-amber-700 hover:bg-amber-800">
                  Place Bid
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Place Your Bid</DialogTitle>
                  <DialogDescription>
                    Current bid: {formatPrice(listing.currentBid!)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Your Bid Amount</Label>
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={listing.currentBid! + (listing.bidIncrement || 1000)}
                      step={listing.bidIncrement || 1000}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: {formatPrice(listing.currentBid! + (listing.bidIncrement || 1000))}
                      {listing.bidIncrement && (
                        <span> (increment: ₹{listing.bidIncrement})</span>
                      )}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    onClick={handlePlaceBid}
                    disabled={isPlacingBid}
                  >
                    {isPlacingBid ? 'Placing Bid...' : 'Confirm Bid'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onChat}>
                Make Offer
              </Button>
              <Button className="flex-1 bg-amber-700 hover:bg-amber-800" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
