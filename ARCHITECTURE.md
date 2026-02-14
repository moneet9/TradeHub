# TradeHub Architecture

## Overview

TradeHub is a full-stack marketplace application with a React frontend and Node.js backend. It enables buyers and sellers to connect, browse items, communicate, and conduct transactions.

## Technology Stack

### Frontend
- **Framework**: React 18+ (with TypeScript)
- **Build Tool**: Vite
- **Styling**: CSS/Tailwind CSS (via shadcn/ui components)
- **API Client**: Fetch API
- **State Management**: React Context/Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (inferred from model structure)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Custom email service for notifications

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React + Vite)                    │
│  ┌──────────────┐  ┌───────────┐  ┌─────────────────────┐  │
│  │ Components   │  │ Auth      │  │ Item Search/Browse  │  │
│  │ - Auth       │  │ - Login   │  │ - Filter Products   │  │
│  │ - Items      │  │ - Register│  │ - View Details      │  │
│  │ - Chat       │  │ - Logout  │  │ - Review Sellers    │  │
│  │ - Dashboard  │  └───────────┘  └─────────────────────┘  │
│  └──────────────┘                                            │
│                          ↓ API Calls                         │
└─────────────────────────────────────────────────────────────┘
                            │
                    REST API (Express)
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                 │
│  ┌──────────────┐  ┌───────────┐  ┌──────────────────────┐ │
│  │ Auth Routes  │  │ Item      │  │ Chat/Review Routes   │ │
│  │ - Register   │  │ Routes    │  │ - Message endpoints  │ │
│  │ - Login      │  │ - CRUD    │  │ - Review endpoints   │ │
│  │ - Verify     │  │ - Search  │  └──────────────────────┘ │
│  │ - Token Mgmt │  │ - Filter  │                            │
│  └──────────────┘  └───────────┘                            │
│         ↓                ↓                    ↓              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Controller Layer (Business Logic)              │ │
│  │  auth_c.js │ item_c.js │ chat_c.js │ review_c.js      │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    Model Layer (Data Access & Validation)              │ │
│  │  User.js │ Item.js │ Chat.js │ Review.js              │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                        MongoDB
```

## Data Models

### User Schema
```
{
  _id: ObjectId
  email: String (unique)
  password: String (hashed)
  firstName: String
  lastName: String
  avatar: String (image URL)
  isSeller: Boolean
  sellerRating: Number
  createdAt: Date
  updatedAt: Date
}
```

### Item Schema
```
{
  _id: ObjectId
  title: String
  description: String
  image: String (image URL)
  price: Number
  category: String
  sellerId: ObjectId (ref: User)
  status: String (available/sold)
  createdAt: Date
  updatedAt: Date
}
```

### Chat Schema
```
{
  _id: ObjectId
  buyerId: ObjectId (ref: User)
  sellerId: ObjectId (ref: User)
  itemId: ObjectId (ref: Item)
  messages: [{
    senderId: ObjectId (ref: User)
    message: String
    timestamp: Date
  }]
  lastMessage: Date
  createdAt: Date
}
```

### Review Schema
```
{
  _id: ObjectId
  itemId: ObjectId (ref: Item)
  buyerId: ObjectId (ref: User)
  sellerId: ObjectId (ref: User)
  rating: Number (1-5)
  comment: String
  createdAt: Date
}
```

## API Authentication Flow

1. User registers with email and password
2. Backend hashes password and stores user
3. On login, backend validates credentials and returns JWT token
4. Client stores JWT in localStorage/sessionStorage
5. Client includes JWT in Authorization header for protected routes
6. Backend middleware (`auth.js`) validates token on each request

## Key Features Implementation

### Search & Filtering
- Frontend sends query parameters to `/api/items`
- Backend filters items based on category, price range, keywords
- Results returned with pagination support

### Real-time Chat
- Messages stored in MongoDB
- Endpoints for retrieving conversation history
- Timestamps for message ordering

### Reviews & Ratings
- Buyers can leave reviews after purchase
- Average rating calculated for seller profile
- Review text and star rating stored

## Environment Configuration

Frontend connects to backend via `mad/src/config/api.ts`.
Backend requires `.env` file with:
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret for signing tokens
- `SMTP_*` - Email service credentials
- `NODE_ENV` - Environment (development/production)

## Security Considerations

- Passwords are hashed before storage
- JWT tokens are validated on protected routes
- Environment variables protect sensitive credentials
- CORS properly configured for cross-origin requests
- Input validation on backend routes

## Performance Optimization

- Database indexes on frequently queried fields (email, itemId, etc.)
- Pagination for large result sets
- Efficient search queries with text indexes
- Client-side caching of frequent requests (can be enhanced)

---

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md)
