import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Clock, IndianRupee, Package, Eye, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { categories } from '../lib/mock-data';
import { formatPrice } from '../lib/utils-data';
import { toast } from 'sonner@2.0.3';
import { API_ENDPOINTS } from '../config/api';

interface SellerDashboardProps {
  onBack: () => void;
}

interface Item {
  _id: string;
  title: string;
  description: string;
  price?: number;
  startingBid?: number;
  views: number;
  images: any[];
  listingType: 'fixed' | 'auction';
  status: 'active' | 'sold' | 'delisted';
  createdAt: string;
  currentBid?: number;
  auctionEndDate?: string;
}

export function SellerDashboard({ onBack }: SellerDashboardProps) {
  const [isAddingItem, setIsAddingItem] = React.useState(false);
  const [listingType, setListingType] = React.useState<'auction' | 'fixed'>('fixed');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [myItems, setMyItems] = React.useState<Item[]>([]);
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [category, setCategory] = React.useState<string>('');
  const [duration, setDuration] = React.useState<string>('');
  const [bidIncrement, setBidIncrement] = React.useState<string>('1000');
  const [condition, setCondition] = React.useState<string>('');
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);

  // Fetch user's items on mount
  React.useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.GET_MY_ITEMS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        setMyItems(data.items);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImages((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission
  const handleAddListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const payload = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: category,
        condition: condition,
        era: formData.get('era') as string,
        listingType: listingType,
        price: listingType === 'fixed' ? parseFloat(formData.get('price') as string) : undefined,
        startingBid: listingType === 'auction' ? parseFloat(formData.get('starting-bid') as string) : undefined,
        bidIncrement: listingType === 'auction' ? parseFloat(bidIncrement) : undefined,
        duration: listingType === 'auction' ? duration : undefined,
        location: formData.get('location') as string,
        images: selectedImages.map((img) => ({
          data: img,
          contentType: 'image/jpeg',
        })),
      };

      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.CREATE_ITEM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Listing created successfully!');
        setIsAddingItem(false);
        setSelectedImages([]);
        setCategory('');
        setCondition('');
        setDuration('');
        setBidIncrement('1000');
        fetchMyItems();
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.DELETE_ITEM(itemId), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Item deleted successfully');
        fetchMyItems();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMarkAsSold = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.MARK_SOLD(itemId), {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Item marked as sold');
        fetchMyItems();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const activeItems = myItems.filter((item) => item.status === 'active');
  const soldItems = myItems.filter((item) => item.status === 'sold');
  const auctionItems = activeItems.filter((item) => item.listingType === 'auction');

  const totalEarnings = soldItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const activeAuctions = auctionItems.length;
  const totalViews = myItems.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background z-40 border-b p-4">
        <div className="flex items-center justify-between">
          <h2>Seller Dashboard</h2>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-700 hover:bg-amber-800">
                <Plus className="size-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Listing</DialogTitle>
                <DialogDescription>
                  List your antique or second-hand item
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddListing} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Item Photos</Label>
                  <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent block">
                    <Plus className="size-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload photos
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {selectedImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {selectedImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Item Title</Label>
                  <Input id="title" name="title" placeholder="Victorian Writing Desk" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="antique">Antique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="era">Era/Year</Label>
                  <Input id="era" name="era" placeholder="1880s" />
                </div>

                <div className="space-y-2">
                  <Label>Listing Type</Label>
                  <RadioGroup value={listingType} onValueChange={(v) => setListingType(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="type-fixed" />
                      <Label htmlFor="type-fixed">Fixed Price</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auction" id="type-auction" />
                      <Label htmlFor="type-auction">Auction</Label>
                    </div>
                  </RadioGroup>
                </div>

                {listingType === 'fixed' ? (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" placeholder="96000" required />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="starting-bid">Starting Bid (₹)</Label>
                      <Input id="starting-bid" name="starting-bid" type="number" placeholder="40000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bid-increment">Minimum Bid Increment (₹)</Label>
                      <Input
                        id="bid-increment"
                        type="number"
                        placeholder="1000"
                        value={bidIncrement}
                        onChange={(e) => setBidIncrement(e.target.value)}
                        min="100"
                        step="100"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Each bid must be higher by at least this amount
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Auction Duration</Label>
                      <Select value={duration} onValueChange={setDuration} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your item in detail..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="Mumbai, Maharashtra" required />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Listing'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <IndianRupee className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-2xl">{formatPrice(totalEarnings)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Earnings</p>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-2xl">{activeAuctions}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Auctions</p>
          </Card>
          <Card className="p-4 text-center">
            <Eye className="size-6 mx-auto text-amber-700 mb-2" />
            <p className="text-2xl">{totalViews}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Views</p>
          </Card>
        </div>

        {/* Listings Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
            <TabsTrigger value="bids" className="flex-1">Bids</TabsTrigger>
            <TabsTrigger value="sold" className="flex-1">Sold</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 mt-4">
            {activeItems.map((item) => (
              <Card
                key={item._id}
                className="p-4 transition-all duration-200"
                onMouseEnter={() => setHoveredItemId(item._id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <div className="flex gap-3">
                  {item.images.length > 0 && (
                    <img
                      src={item.images[0].data}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.listingType === 'auction' ? (
                            <Badge variant="outline" className="text-xs">Auction</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Fixed Price</Badge>
                          )}
                        </div>
                      </div>
                      <div className={`flex gap-1 transition-opacity duration-200 ${hoveredItemId === item._id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-amber-100"
                          onClick={() => handleMarkAsSold(item._id)}
                          title="Mark as sold"
                        >
                          <Package className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-red-100"
                          onClick={() => handleDeleteItem(item._id)}
                          title="Delete listing"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-amber-700">
                      {formatPrice(item.listingType === 'auction' ? item.currentBid || 0 : item.price || 0)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{item.views} views</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="bids" className="space-y-3 mt-4">
            {auctionItems.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex gap-3">
                  {item.images.length > 0 && (
                    <img
                      src={item.images[0].data}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm line-clamp-1">{item.title}</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Current: {formatPrice(item.currentBid || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ends: {new Date(item.auctionEndDate || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="sold" className="space-y-3 mt-4">
            {soldItems.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex gap-3">
                  {item.images.length > 0 && (
                    <img
                      src={item.images[0].data}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm line-clamp-1">{item.title}</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Sold for {formatPrice(item.price || 0)}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      <Package className="size-3 mr-1" />
                      Sold
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}