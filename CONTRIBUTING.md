# Contributing to TradeHub

Thank you for your interest in contributing to TradeHub! This guide will help you get started.

## Setting Up Your Development Environment

### Frontend (React + Vite)
```bash
cd mad
npm install
npm run dev
```

### Backend (Node.js + Express)
```bash
cd "mad market backend"
npm install
npm run dev
```

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:3001` (or as configured).

## Project Structure

```
TradeHub/
├── mad/                           # React Frontend (Vite)
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── config/                # API configuration
│   │   ├── lib/                   # Utilities and mock data
│   │   ├── styles/                # CSS files
│   │   └── App.tsx                # Main app component
│   ├── package.json
│   └── vite.config.ts
│
└── mad market backend/            # Node.js Backend (Express)
    ├── controller/                # Route controllers
    │   ├── auth_c.js              # Authentication logic
    │   ├── item_c.js              # Item management logic
    │   ├── chat_c.js              # Chat logic
    │   └── review_c.js            # Review logic
    ├── model/                     # Database models
    │   ├── User.js
    │   ├── Item.js
    │   ├── Chat.js
    │   └── Review.js
    ├── route/                     # API routes
    │   ├── auth_r.js
    │   ├── item_r.js
    │   ├── chat_r.js
    │   └── review_r.js
    ├── middleware/                # Custom middleware
    │   └── auth.js
    ├── utils/                     # Utility functions
    │   ├── emailService.js        # Email sending
    │   └── generateToken.js       # JWT token generation
    ├── .env.example               # Environment variables template
    ├── package.json
    └── index.js                   # Entry point
```

## Key Files

### Frontend Configuration
- `mad/src/config/api.ts` - API endpoint configuration

### Backend Configuration
- `mad market backend/.env.example` - Template for environment variables
  - Copy to `.env` and fill in your configuration
  - Requires database connection, email service credentials, JWT secret, etc.

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Item Endpoints
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Chat Endpoints
- `GET /api/chat` - Get chat conversations
- `POST /api/chat/message` - Send message
- `GET /api/chat/:id` - Get chat details

### Review Endpoints
- `POST /api/reviews` - Create review
- `GET /api/reviews/:itemId` - Get item reviews

## Features

### For Buyers
- Browse marketplace items with advanced filtering
- Search for specific products
- View seller profiles and reviews
- Chat directly with sellers
- Leave reviews for sellers

### For Sellers
- Create and manage product listings
- View seller dashboard with analytics
- Chat with interested buyers
- Manage inventory

## Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes following the existing code style
3. Test your changes thoroughly
4. Commit with clear messages: `git commit -m "Add feature: description"`
5. Push to your branch: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Code Style Guidelines

- Use TypeScript for frontend code
- Use ES6+ syntax
- Follow existing naming conventions
- Add comments for complex logic
- Keep components focused and reusable

## Testing

Frontend: `npm run dev` and manually test in browser
Backend: Use tools like Postman or curl to test API endpoints

## Support

For issues or questions, please open a GitHub issue.

---

Happy coding! 🚀
