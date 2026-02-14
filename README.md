# TradeHub

A full-featured marketplace web application where buyers and sellers can connect, browse products, communicate in real-time, and manage transactions. Built with React (Vite) frontend and Node.js/Express backend.

## 🎯 Features

### For Buyers
- 🔍 Advanced search and filtering by category, price, and keywords
- 📋 Browse detailed product listings with images
- ⭐ View seller profiles and customer reviews
- 💬 Real-time chat with sellers
- ✍️ Leave reviews and ratings for sellers

### For Sellers
- 📝 Create and manage product listings
- 📊 Seller dashboard with listing analytics
- 💬 Communicate with interested buyers
- 📈 Track your seller rating and reviews
- 🎯 Inventory management

## 📦 What's Inside

- **`mad/`** - React frontend application (Vite + TypeScript)
- **`mad market backend/`** - Express.js REST API server
- **`CONTRIBUTING.md`** - Contribution guidelines
- **`ARCHITECTURE.md`** - System architecture and data models

## 🚀 Quick Start

### Frontend Setup

```bash
cd mad
npm install
npm run dev
```

The app will start on `http://localhost:5173`

### Backend Setup

```bash
cd "mad market backend"
npm install
```

Create a `.env` file from `.env.example`:
```
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SMTP_HOST=your_email_service_host
# ... other environment variables
```

Start the server:
```bash
npm run dev
```

The API will run on `http://localhost:3001` (or as configured)

## 📚 Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute, project structure, and guidelines
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design, data models, and API documentation

## 🏗️ Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Vite (build tool)
- TailwindCSS / shadcn UI (components)
- Fetch API (HTTP client)

**Backend:**
- Node.js with Express
- MongoDB (database)
- JWT (authentication)
- Nodemailer (email service)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Items
- `GET /api/items` - Get all items with filters
- `POST /api/items` - Create new listing
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update listing
- `DELETE /api/items/:id` - Delete listing

### Chat
- `GET /api/chat` - Get all conversations
- `POST /api/chat/message` - Send message
- `GET /api/chat/:id` - Get conversation details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:itemId` - Get item reviews

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed API documentation.

## ⚙️ Configuration

The frontend needs to know your backend URL. Update it in `mad/src/config/api.ts`:

```typescript
const API_URL = 'http://localhost:3001';
```

## 🔐 Security Notes

- Passwords are hashed before storage
- JWT tokens are required for protected endpoints
- Sensitive data stored in environment variables (never commit `.env`)
- CORS is configured for secure cross-origin requests

## 📝 Development Tips

- Frontend auto-refreshes on save during `npm run dev`
- Backend may need manual restart on file changes
- Use your browser's DevTools Network tab to debug API calls
- Backend logs will show in the terminal

## 🏗️ Build for Production

**Frontend:**
```bash
cd mad
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Setting up your development environment
- Project structure and conventions
- Making changes and submitting pull requests

## 📄 License

This project is open source. See LICENSE file for details.

## 🐛 Issues & Support

Found a bug? Have a feature request? Please [open an issue](https://github.com/moneet9/TradeHub/issues) on GitHub.

---

**Happy Trading! 🚀**
