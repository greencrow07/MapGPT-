# Flow Backend API

A Node.js backend API for the Flow application with Google OAuth authentication and MongoDB database.

## Features

- Google OAuth authentication
- Session management with MongoDB store
- Flow data management (nodes and edges)
- RESTful API endpoints
- CORS enabled for frontend integration

## Project Structure

```
├── config/
│   ├── database.js      # MongoDB connection configuration
│   ├── passport.js      # Passport authentication setup
│   └── session.js       # Session configuration
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   ├── User.js          # User model
│   └── Flow.js          # Flow model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── flows.js         # Flow management routes
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── env.example          # Environment variables template
└── README.md           # This file
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - Copy `env.example` to `.env`
   - Fill in the required environment variables:
     - `SESSION_SECRET`: A random string for session encryption
     - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
     - `MONGODB_URI`: MongoDB connection string
     - `FRONTEND_URL`: Your frontend application URL

3. **Database Setup:**
   - Ensure MongoDB is running locally or update `MONGODB_URI` to point to your MongoDB instance

4. **Google OAuth Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5000/auth/google/callback` to authorized redirect URIs

5. **Run the application:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/user` - Get current user info

### Flows
- `GET /api/flows/user-flow` - Get or create user's flow
- `GET /api/flows/:flowId` - Get specific flow
- `PUT /api/flows/:flowId` - Update flow

### Health Check
- `GET /health` - Server health status

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Session encryption secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |

## Development

The application uses:
- **Express.js** for the web framework
- **Mongoose** for MongoDB ODM
- **Passport.js** for authentication
- **Express-session** for session management
- **CORS** for cross-origin requests

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Use HTTPS in production
5. Set secure session cookies

## License

ISC 