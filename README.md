# Stock Market Dashboard

A full-featured **MERN stack** application for real-time stock tracking, trading simulation, and portfolio management with role-based user/admin panels.

Stock Market Dashboard enables users to monitor live stock prices, analyze historical trends with interactive charts, manage a personalized watchlist, and submit buy/sell orders. Admins can review and approve transactions, manage users, and oversee platform activity—all through a responsive, modern UI with dark/light mode support.

## Features

- **Authentication**: JWT-based signup/login with bcrypt password hashing
- **Role-based Access**: User and Admin roles with protected routes
- **Stock Module**: Real-time stock data from Alpha Vantage API
- **Trading Module**: Buy/Sell requests with admin approval workflow
- **Watchlist**: Add/remove stocks to personal watchlist
- **Portfolio**: Track holdings and balance
- **Admin Panel**: Manage users, approve/reject transactions
- **Dark Mode**: Toggle between light and dark themes
- **Responsive UI**: Modern dashboard with Tailwind CSS

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Vite, Tailwind CSS, Chart.js
- **Authentication**: JWT, bcrypt
- **API**: Alpha Vantage (stock data)

## Project Structure

```
backend/
  ├── config/
  │   └── db.js
  ├── controllers/
  │   ├── authController.js
  │   ├── stockController.js
  │   ├── transactionController.js
  │   └── watchlistController.js
  ├── middleware/
  │   ├── adminMiddleware.js
  │   └── authMiddleware.js
  ├── models/
  │   ├── Transaction.js
  │   └── User.js
  ├── routes/
  │   ├── authRoutes.js
  │   ├── stockRoutes.js
  │   ├── transactionRoutes.js
  │   └── watchlistRoutes.js
  ├── .env
  ├── package.json
  └── server.js

frontend/
  ├── src/
  │   ├── components/
  │   │   ├── auth/
  │   │   │   ├── LoginForm.jsx
  │   │   │   └── SignupForm.jsx
  │   │   ├── common/
  │   │   │   ├── Navbar.jsx
  │   │   │   └── ProtectedRoute.jsx
  │   │   ├── stock/
  │   │   │   ├── ChartComponent.jsx
  │   │   │   └── StockCard.jsx
  │   │   └── trading/
  │   │       └── TransactionTable.jsx
  │   ├── context/
  │   │   ├── AuthContext.jsx
  │   │   └── ThemeContext.jsx
  │   ├── pages/
  │   │   ├── AdminPanelPage.jsx
  │   │   ├── DashboardPage.jsx
  │   │   ├── LoginPage.jsx
  │   │   ├── SignupPage.jsx
  │   │   ├── StockDetailsPage.jsx
  │   │   └── UserPanelPage.jsx
  │   ├── services/
  │   │   └── api.js
  │   ├── App.jsx
  │   ├── index.css
  │   └── main.jsx
  ├── index.html
  ├── package.json
  ├── postcss.config.js
  ├── tailwind.config.js
  └── vite.config.js
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://127.0.0.1:27017/stockDB
JWT_SECRET=<Your token here>
STOCK_API_KEY=<Your api here>
ADMIN_EMAIL=yourmailhere@gmail.com
ADMIN_PASSWORD=1234567
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or use MongoDB Atlas)

### Backend Setup

1. Clone this repository 
```bash
git clone https://github.com/cloudxplorer/StockDash
```

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Credentials

### Admin Account
- Email: `yourmailhere@gmail.com`
- Password: `1234567`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get all users (Admin only)

### Stocks
- `GET /api/stocks/popular` - Get popular stocks
- `GET /api/stocks/search?query=XXX` - Search stocks
- `GET /api/stocks/quote/:symbol` - Get stock quote
- `GET /api/stocks/history/:symbol?days=30` - Get stock history

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:symbol` - Remove from watchlist

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/my` - Get user's transactions
- `GET /api/transactions/all` - Get all transactions (Admin only)
- `PUT /api/transactions/:id/approve` - Approve transaction (Admin only)
- `PUT /api/transactions/:id/reject` - Reject transaction (Admin only)

## Features Overview

### User Features
- View popular stocks with real-time prices
- Search for stocks
- Add/remove stocks from watchlist
- Buy/Sell stocks (pending admin approval)
- View transaction history
- View portfolio holdings
- Dark mode toggle

### Admin Features
- View all users
- View all transactions
- Approve/reject buy/sell requests
- Dashboard with statistics

## Deployment

### Backend (Render/Railway)
1. Set environment variables in the platform dashboard
2. Connect your GitHub repository
3. Deploy with start command: `npm start`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Output directory: `dist`

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it for personal and educational purposes.
