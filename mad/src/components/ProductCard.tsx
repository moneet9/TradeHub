import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Eye } from 'lucide-react';
import { Listing } from '../lib/mock-data';
import { formatPrice, formatTimeLeft } from '../lib/utils-data';

interface ProductCardProps {
  listing: Listing;
  onClick: () => void;
}

export function ProductCard({ listing, onClick }: ProductCardProps) {
  const [timeLeft, setTimeLeft] = React.useState(
    listing.auctionEndTime ? formatTimeLeft(listing.auctionEndTime) : null
  );

  React.useEffect(() => {
    if (listing.type === 'auction' && listing.auctionEndTime) {
      const interval = setInterval(() => {
        setTimeLeft(formatTimeLeft(listing.auctionEndTime!));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [listing]);

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-gray-200">
        {listing.images && listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}
        {listing.type === 'auction' && timeLeft && (
          <div className="absolute top-2 left-2 bg-amber-600 text-white px-2 py-1 rounded flex items-center gap-1">
            <Clock className="size-3" />
            <span className="text-xs">{timeLeft}</span>
          </div>
        )}
        {listing.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-amber-700 text-white border-0">
            Featured
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 mb-1">{listing.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{listing.era}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {listing.type === 'auction' ? 'Current Bid' : 'Price'}
            </p>
            <p className="text-lg text-amber-700">
              {formatPrice(listing.type === 'auction' ? listing.currentBid! : listing.price)}
            </p>
          </div>
          {listing.type === 'auction' && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{listing.bidCount} bids</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Eye className="size-3" />
          <span>{listing.views} views</span>
        </div>
      </div>
    </Card>
  );
}
