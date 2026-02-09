import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { categories, Listing } from '../lib/mock-data';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  listingType: 'fixed' | 'auction';
  price?: number;
  startingBid?: number;
  currentBid?: number;
  bidIncrement?: number;
  images?: Array<{ data: string; contentType: string }>;
  sellerId?: { _id: string; name: string; email?: string; phone?: string };
  views: number;
  createdAt: string;
}

interface SearchScreenProps {
  onSelectListing: (listing: Listing) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export function SearchScreen({ onSelectListing, initialCategory, initialSearch }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || 'all');
  const [listingType, setListingType] = React.useState('all');
  const [condition, setCondition] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState([0, 2000000]);
  const [sortBy, setSortBy] = React.useState('newest');
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Fetch items from backend on mount
  React.useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/items`);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      console.log('Backend response:', data);
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fuzzy search helper function - calculates similarity between two strings
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Exact match
    if (s1 === s2) return 1;
    
    // Check if one contains the other
    if (s2.includes(s1)) return 0.9;
    if (s1.includes(s2)) return 0.85;
    
    // Split into words and check word-level similarity
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    
    let wordMatches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1.length >= 3 && word2.length >= 3) {
          // Partial word match
          if (word2.includes(word1) || word1.includes(word2)) {
            wordMatches += 0.8;
          }
          // Character similarity for typos
          else if (getLevenshteinDistance(word1, word2) <= 2) {
            wordMatches += 0.6;
          }
        } else if (word1 === word2) {
          wordMatches += 1;
        }
      }
    }
    
    return Math.min(wordMatches / words1.length, 1);
  };

  // Levenshtein distance for typo tolerance
  const getLevenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const filteredListings = items.filter((item: any) => {
    // Filter by search query using fuzzy matching (title and description)
    const matchesSearch = !searchQuery || (() => {
      const titleSimilarity = calculateSimilarity(searchQuery, item.title);
      const descSimilarity = calculateSimilarity(searchQuery, item.description);
      // Match if similarity is above 0.3 threshold (30% similar)
      return titleSimilarity > 0.3 || descSimilarity > 0.3;
    })();

    // Filter by category - case insensitive
    const itemCategory = item.category ? item.category.toLowerCase() : 'all';
    const selectedCat = selectedCategory ? selectedCategory.toLowerCase() : 'all';
    const matchesCategory = selectedCat === 'all' || itemCategory === selectedCat;

    // Filter by listing type
    const matchesListingType = listingType === 'all' || item.listingType === listingType;

    // Filter by condition - case insensitive
    const itemCondition = item.condition ? item.condition.toLowerCase() : '';
    const matchesCondition = condition.length === 0 || condition.some(c => c.toLowerCase() === itemCondition);

    // Filter by price range (for fixed price items)
    const itemPrice = item.listingType === 'auction' ? (item.currentBid || item.startingBid || 0) : (item.price || 0);
    const matchesPrice = !itemPrice || (itemPrice >= priceRange[0] && itemPrice <= priceRange[1]);

    return matchesSearch && matchesCategory && matchesListingType && matchesCondition && matchesPrice;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': {
        const priceA = a.listingType === 'auction' ? (a.currentBid || a.startingBid || 0) : (a.price || 0);
        const priceB = b.listingType === 'auction' ? (b.currentBid || b.startingBid || 0) : (b.price || 0);
        return priceA - priceB;
      }
      case 'price-high': {
        const priceA = a.listingType === 'auction' ? (a.currentBid || a.startingBid || 0) : (a.price || 0);
        const priceB = b.listingType === 'auction' ? (b.currentBid || b.startingBid || 0) : (b.price || 0);
        return priceB - priceA;
      }
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleConditionChange = (cond: string, checked: boolean) => {
    if (checked) {
      setCondition([...condition, cond]);
    } else {
      setCondition(condition.filter((c) => c !== cond));
    }
  };

  return (
    <div className="pb-20">
      {/* Search Header */}
      <div className="sticky top-0 bg-background z-40 border-b p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search for items..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-amber-700' : ''}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? 'bg-amber-700' : ''}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="size-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Listing Type */}
                  <div className="space-y-3">
                    <Label>Listing Type</Label>
                    <RadioGroup value={listingType} onValueChange={setListingType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auction" id="auction" />
                        <Label htmlFor="auction">Auction</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed Price</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Condition */}
                  <div className="space-y-3">
                    <Label>Condition</Label>
                    <div className="space-y-2">
                      {['New', 'Used', 'Antique'].map((cond) => (
                        <div key={cond} className="flex items-center space-x-2">
                          <Checkbox
                            id={cond}
                            checked={condition.includes(cond)}
                            onCheckedChange={(checked) =>
                              handleConditionChange(cond, checked as boolean)
                            }
                          />
                          <Label htmlFor={cond}>{cond}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>Price Range</Label>
                    
                    {/* Input fields for lower and upper limits */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                          Min Price
                        </Label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                          <Input
                            id="minPrice"
                            type="number"
                            min={0}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setPriceRange([Math.max(0, Math.min(value, priceRange[1])), priceRange[1]]);
                            }}
                            className="pl-20"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                          Max Price
                        </Label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                          <Input
                            id="maxPrice"
                            type="number"
                            min={priceRange[0]}
                            max={2000000}
                            value={priceRange[1]}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setPriceRange([priceRange[0], Math.max(priceRange[0], Math.min(value, 2000000))]);
                            }}
                            className="pl-20"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Slider */}
                    <div className="pt-2">
                      <Slider
                        min={0}
                        max={2000000}
                        step={10000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>₹{priceRange[0].toLocaleString()}</span>
                        <span>₹{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setListingType('all');
                      setCondition([]);
                      setPriceRange([0, 50000]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort <ChevronDown className="size-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Sort By</SheetTitle>
                </SheetHeader>
                <div className="space-y-2 mt-4">
                  <RadioGroup value={sortBy} onValueChange={setSortBy}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="newest" id="newest" />
                      <Label htmlFor="newest">Newest</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="price-low" id="price-low" />
                      <Label htmlFor="price-low">Price: Low to High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="price-high" id="price-high" />
                      <Label htmlFor="price-high">Price: High to Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="popular" id="popular" />
                      <Label htmlFor="popular">Most Popular</Label>
                    </div>
                  </RadioGroup>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <p className="text-sm text-muted-foreground">
            {sortedListings.length} results
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading items...</p>
          </div>
        ) : !items || items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items in database yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Upload an item from Seller Dashboard to see it here
            </p>
          </div>
        ) : sortedListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items match your filters</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setListingType('all');
                setCondition([]);
                setPriceRange([0, 50000]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
            {sortedListings.map((item) => {
              // Convert backend item to frontend listing format
              const listing = {
                id: item._id,
                title: item.title,
                description: item.description,
                price: item.price || 0,
                currentBid: item.currentBid || item.startingBid || 0,
                bidIncrement: item.bidIncrement || 1000,
                type: item.listingType === 'auction' ? 'auction' : 'fixed',
                condition: item.condition as 'New' | 'Used' | 'Antique',
                category: item.category,
                era: item.condition,
                images: item.images?.map(img => img.data) || [''],
                sellerId: item.sellerId?._id || '',
                seller: {
                  id: item.sellerId?._id || '',
                  name: item.sellerId?.name || 'Unknown Seller',
                  email: item.sellerId?.email || '',
                  role: 'seller' as const,
                  rating: 4.5, // Dummy rating
                  reviewCount: 0,
                  location: 'Unknown',
                  memberSince: 'Recently',
                },
                location: 'Unknown',
                views: item.views || 0,
                isFeatured: false,
                bidCount: 0,
                createdAt: new Date(item.createdAt),
              };

              return (
                <ProductCard
                  key={item._id}
                  listing={listing}
                  onClick={() => onSelectListing(listing)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
