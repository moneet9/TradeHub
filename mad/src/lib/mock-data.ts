// Mock data for the antique marketplace

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  rating: number;
  reviewCount: number;
  location: string;
  memberSince: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'New' | 'Used' | 'Antique';
  price: number;
  type: 'auction' | 'fixed';
  images: string[];
  sellerId: string;
  seller: User;
  location: string;
  era?: string;
  auctionEndTime?: Date;
  currentBid?: number;
  bidIncrement?: number;
  bidCount?: number;
  views: number;
  isFeatured?: boolean;
  createdAt: Date;
}

export interface Bid {
  id: string;
  listingId: string;
  userId: string;
  amount: number;
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  listingId?: string;
  read: boolean;
}

export const currentUser: User = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  role: 'buyer',
  avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGJ1c2luZXNzfGVufDF8fHx8MTc2OTU3MzU2MHww&ixlib=rb-4.1.0&q=80&w=1080',
  rating: 4.8,
  reviewCount: 24,
  location: 'Mumbai, Maharashtra',
  memberSince: '2023',
};

export const mockSellers: User[] = [
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1610387694365-19fafcc86d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY5NDg1MjYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 156,
    location: 'Delhi, Delhi',
    memberSince: '2020',
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGJ1c2luZXNzfGVufDF8fHx8MTc2OTU3MzU2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviewCount: 89,
    location: 'Bangalore, Karnataka',
    memberSince: '2021',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1614436201459-156d322d38c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc2OTQ4OTI5MXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5.0,
    reviewCount: 203,
    location: 'Hyderabad, Telangana',
    memberSince: '2019',
  },
];

export const categories = [
  { id: 'antiques', name: 'Antiques', icon: '🏺' },
  { id: 'cars', name: 'Old Cars', icon: '🚗' },
  { id: 'phones', name: 'Old Phones', icon: '☎️' },
  { id: 'furniture', name: 'Furniture', icon: '🪑' },
  { id: 'electronics', name: 'Electronics', icon: '📻' },
  { id: 'collectibles', name: 'Collectibles', icon: '📸' },
];

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Victorian Mahogany Writing Desk',
    description: 'Stunning Victorian-era writing desk made from solid mahogany. Features intricate carvings, original brass hardware, and a leather writing surface. Fully restored with original patina preserved. A true centerpiece for any office or study.',
    category: 'furniture',
    condition: 'Antique',
    price: 200000,
    type: 'auction',
    images: [
      'https://images.unsplash.com/photo-1730081774525-2567e86adac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwdmludGFnZSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3Njk1OTkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '2',
    seller: mockSellers[0],
    location: 'Delhi, Delhi',
    era: '1880s',
    auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    currentBid: 200000,
    bidCount: 8,
    views: 234,
    isFeatured: true,
    createdAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    title: '1967 Ford Mustang Fastback',
    description: 'Classic 1967 Ford Mustang Fastback in pristine condition. Original V8 engine, recently restored interior, new paint job maintaining factory colors. All original parts documented. A true American muscle car icon.',
    category: 'cars',
    condition: 'Used',
    price: 3600000,
    type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1764015488424-e6beaa36333a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xhc3NpYyUyMGNhciUyMGF1dG9tb2JpbGV8ZW58MXx8fHwxNzY5NTk5MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '3',
    seller: mockSellers[1],
    location: 'Bangalore, Karnataka',
    era: '1960s',
    views: 892,
    isFeatured: true,
    createdAt: new Date('2026-01-15'),
  },
  {
    id: '3',
    title: 'Vintage Rotary Phone - Black Bakelite',
    description: 'Classic black bakelite rotary telephone from the 1950s. Fully functional with clear dial tone. Original cord and handset. Perfect for collectors or functional vintage decor.',
    category: 'phones',
    condition: 'Antique',
    price: 12000,
    type: 'auction',
    images: [
      'https://images.unsplash.com/photo-1760766144822-0c35be064038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwcm90YXJ5JTIwdGVsZXBob25lJTIwdmludGFnZXxlbnwxfHx8fDE3Njk1OTkxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '2',
    seller: mockSellers[0],
    location: 'Delhi, Delhi',
    era: '1950s',
    auctionEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    currentBid: 12000,
    bidCount: 3,
    views: 145,
    createdAt: new Date('2026-01-25'),
  },
  {
    id: '4',
    title: 'Leica M3 Camera with Summicron Lens',
    description: 'Iconic Leica M3 35mm rangefinder camera from 1954. Comes with original Leica Summicron 50mm f/2 lens. Fully functional, recently serviced. Minor cosmetic wear adds to its vintage character. Includes original leather case.',
    category: 'collectibles',
    condition: 'Used',
    price: 256000,
    type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1724627561609-9cd3facba8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwY29sbGVjdGlibGUlMjBhbnRpcXVlfGVufDF8fHx8MTc2OTU5OTEyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '4',
    seller: mockSellers[2],
    location: 'Hyderabad, Telangana',
    era: '1950s',
    views: 567,
    isFeatured: true,
    createdAt: new Date('2026-01-18'),
  },
  {
    id: '5',
    title: 'Antique Gold Pocket Watch',
    description: 'Exquisite 18k gold pocket watch from the late 1800s. Swiss movement, hand-engraved case with intricate floral patterns. Includes original chain. Keeps excellent time. Certificate of authenticity included.',
    category: 'collectibles',
    condition: 'Antique',
    price: 144000,
    type: 'auction',
    images: [
      'https://images.unsplash.com/photo-1582043568452-86590c15107d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwcG9ja2V0JTIwd2F0Y2glMjBqZXdlbHJ5fGVufDF8fHx8MTc2OTU5OTEyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '4',
    seller: mockSellers[2],
    location: 'Hyderabad, Telangana',
    era: '1890s',
    auctionEndTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    currentBid: 144000,
    bidCount: 12,
    views: 423,
    isFeatured: true,
    createdAt: new Date('2026-01-22'),
  },
  {
    id: '6',
    title: 'Vintage Turntable Record Player',
    description: 'Beautiful wooden turntable from the 1970s. Recently serviced, new belt and stylus. Plays 33 and 45 RPM records perfectly. Stunning wood grain finish. Built-in speakers.',
    category: 'electronics',
    condition: 'Used',
    price: 36000,
    type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1698074890098-63d01b33ccfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmVjb3JkJTIwcGxheWVyJTIwdHVybnRhYmxlfGVufDF8fHx8MTc2OTU5MzQyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '3',
    seller: mockSellers[1],
    location: 'Bangalore, Karnataka',
    era: '1970s',
    views: 289,
    createdAt: new Date('2026-01-24'),
  },
  {
    id: '7',
    title: 'Antique Oak Rocking Chair',
    description: 'Hand-crafted oak rocking chair from the early 1900s. Beautiful grain, comfortable seat, solid construction. Some age-appropriate wear that adds character. Perfect for a reading nook.',
    category: 'furniture',
    condition: 'Antique',
    price: 30400,
    type: 'auction',
    images: [
      'https://images.unsplash.com/photo-1763337925283-9ed80c77bb6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwd29vZGVuJTIwY2hhaXIlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzY5NTk5MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '2',
    seller: mockSellers[0],
    location: 'Delhi, Delhi',
    era: '1900s',
    auctionEndTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    currentBid: 30400,
    bidCount: 5,
    views: 178,
    createdAt: new Date('2026-01-26'),
  },
  {
    id: '8',
    title: 'Royal Typewriter - 1940s Model',
    description: 'Vintage Royal typewriter in excellent working condition. All keys function smoothly. Classic design with glass keys and original case. Perfect for writers or collectors.',
    category: 'collectibles',
    condition: 'Used',
    price: 22000,
    type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1576492300679-c0212dba64ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdHlwZXdyaXRlciUyMGFudGlxdWV8ZW58MXx8fHwxNzY5NDk4ODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    sellerId: '3',
    seller: mockSellers[1],
    location: 'Bangalore, Karnataka',
    era: '1940s',
    views: 156,
    createdAt: new Date('2026-01-27'),
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hello! Thank you for your interest in the Victorian desk. Would you like to schedule a viewing?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    listingId: '1',
    read: true,
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: "Yes, I'd love to see it in person. Is this weekend possible?",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    listingId: '1',
    read: true,
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'Saturday at 2pm works great! I can also provide additional photos if needed.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    listingId: '1',
    read: false,
  },
];