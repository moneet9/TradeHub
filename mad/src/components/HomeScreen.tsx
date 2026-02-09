import React from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Search, MapPin, Bell, Heart } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { categories, mockListings, Listing } from '../lib/mock-data';
import { Button } from './ui/button';

interface HomeScreenProps {
  onSelectListing: (listing: Listing) => void;
  onCategorySelect: (categoryId: string) => void;
  onSearch: (query: string) => void;
}

export function HomeScreen({ onSelectListing, onCategorySelect, onSearch }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
    }
  };
  const featuredAuctions = mockListings.filter(
    (l) => l.type === 'auction' && l.isFeatured
  );
  const fixedPriceListings = mockListings.filter((l) => l.type === 'fixed' && l.isFeatured);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-amber-700" />
              <div>
                <p className="text-sm">Location</p>
                <p className="text-xs text-muted-foreground">New York, NY</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="size-5" />
              </Button>
            </div>
          </div>

          <form className="relative" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search antiques, cars, phones..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories */}
        <div>
          <h2 className="mb-3">Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-lg transition-shadow hover:border-amber-700"
                onClick={() => onCategorySelect(category.id)}
              >
                <span className="text-3xl">{category.icon}</span>
                <p className="text-xs text-center">{category.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Auctions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2>Featured Auctions</h2>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              Ending Soon
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredAuctions.map((listing) => (
              <ProductCard
                key={listing.id}
                listing={listing}
                onClick={() => onSelectListing(listing)}
              />
            ))}
          </div>
        </div>

        {/* Fixed Price Listings */}
        <div>
          <h2 className="mb-3">Buy Now</h2>
          <div className="grid grid-cols-2 gap-3">
            {fixedPriceListings.map((listing) => (
              <ProductCard
                key={listing.id}
                listing={listing}
                onClick={() => onSelectListing(listing)}
              />
            ))}
          </div>
        </div>

        {/* Recommended Items */}
        <div>
          <h2 className="mb-3">Recommended for You</h2>
          <div className="space-y-3">
            {mockListings.slice(0, 3).map((listing) => (
              <Card
                key={listing.id}
                className="flex gap-3 p-3 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectListing(listing)}
              >
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-sm line-clamp-2 mb-1">{listing.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{listing.era}</p>
                  <p className="text-amber-700">${listing.type === 'auction' ? listing.currentBid : listing.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
