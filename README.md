# Campus Voice - React & Prisma Version

A modern web-based feedback system built with React, TypeScript, Node.js, Express, and Prisma with PostgreSQL. This is a complete rewrite of the original PHP-based Campus Voice system.

## Features

- **Modern React Frontend**: Built with React 18, TypeScript, and Bootstrap 5
- **JWT Authentication**: Secure token-based authentication system
- **Real-time Dashboard**: User and admin dashboards with statistics
- **Feedback Management**: Submit, track, and manage feedback with categories
- **Admin Panel**: Comprehensive admin interface for managing feedback
- **File Uploads**: Support for attachments in feedback submissions
- **Responsive Design**: Mobile-friendly interface
- **PostgreSQL Database**: Robust database with Prisma ORM

## Technology Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- React Bootstrap for UI components
- React Icons for icons
- Axios for API calls

### Backend
- Node.js with Express
- Prisma ORM with PostgreSQL
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Database
- PostgreSQL (compatible with XAMPP PostgreSQL)

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone and Install Dependencies

```bash
cd campus-voice-react
npm install
```

### 2. Database Setup

#### Option A: Using XAMPP PostgreSQL
1. Start XAMPP and ensure PostgreSQL is running
2. Create a new database named `campus_voice`
3. Update the `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/campus_voice?schema=public"
```

#### Option B: Using Docker
```bash
docker run --name campus-voice-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=campus_voice -p 5432:5432 -d postgres:13
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/campus_voice?schema=public"

# JWT Secret
JWT_SECRET="your_jwt_secret_key_here_change_in_production"

# Server Port
PORT=3001

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USERNAME="your_email@gmail.com"
SMTP_PASSWORD="your_email_password"
SMTP_FROM_EMAIL="noreply@campusvoice.edu"
SMTP_FROM_NAME="Campus Voice"
```

### 4. Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 5. Start the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

#### Or Start Separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm start
```

## Default Credentials

After seeding the database, you can login with:

- **Admin**: admin@campusvoice.edu / admin123
- **Student**: student@campusvoice.edu / student123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User
- `GET /api/user/profile` - Get user profile

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get user's feedback
- `GET /api/feedback/:id` - Get specific feedback

### Categories
- `GET /api/categories` - Get all categories

### Admin
- `GET /api/admin/feedback` - Get all feedback (admin only)
- `PUT /api/admin/feedback/:id/status` - Update feedback status (admin only)

## Project Structure

```
campus-voice-react/
├── src/
│   ├── components/          # Reusable React components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── pages/              # Page components
│   └── App.tsx             # Main App component
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js            # Database seeding script
├── server.js               # Express server
├── package.json
└── README.md
```

## Key Features

### User Features
- User registration and authentication
- Submit feedback with categories and priorities
- Track feedback status in real-time
- View and manage personal feedback
- Anonymous feedback submission
- File attachment support

### Admin Features
- Admin dashboard with statistics
- Manage all feedback submissions
- Update feedback status and add responses
- User management capabilities
- Category management

### Technical Features
- TypeScript for type safety
- Responsive design with Bootstrap
- JWT-based authentication
- File upload handling
- Database relationships with Prisma
- RESTful API design

## Development

### Adding New Features
1. Update the Prisma schema if database changes are needed
2. Run `npm run db:push` to update the database
3. Update the API endpoints in `server.js`
4. Create React components in the appropriate directories
5. Update routing in `App.tsx` if needed

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` for development
3. For production, use `npm run db:migrate`

## Deployment

### Frontend (React)
```bash
npm run build
# Deploy the build folder to your hosting service
```

### Backend (Node.js)
```bash
# Install production dependencies
npm install --production

# Start the server
npm run server
```

### Environment Variables for Production
Make sure to set all required environment variables in your production environment, especially:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2025 Campus Voice. All rights reserved.

## Support

For support or questions, contact: support@campusvoice.edu