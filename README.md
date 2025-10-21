# Project Progress Tracker

A comprehensive project progress tracking system for software development companies. This system allows you to create projects, manage tasks, and provide real-time progress updates to clients.

## Features

### Admin Panel
- **Authentication**: Secure login/registration system
- **Project Management**: Create, edit, and delete projects
- **Task Management**: Add, update, and track tasks for each project
- **Real-time Updates**: Live progress tracking with WebSocket integration
- **Client URLs**: Generate unique URLs for each project

### Client View
- **Public Progress Page**: Clients can view project progress without login
- **Real-time Updates**: Live progress updates as tasks are completed
- **Task Status**: See pending, in-progress, and completed tasks
- **Deadline Tracking**: Visual countdown to project deadline
- **Project Links**: Direct access to live project URLs

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Socket.io Client** for real-time updates
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Deployment
- **Netlify** for hosting
- **Netlify Functions** for serverless backend
- **MongoDB Atlas** for cloud database

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Netlify account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-progress-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/project-progress
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 5173) servers.

### Netlify Deployment

1. **Prepare for deployment**
   ```bash
   # Build the frontend
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `frontend/dist`
   - Add environment variables in Netlify dashboard:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your JWT secret key

3. **Configure redirects**
   The `netlify.toml` file is already configured with the necessary redirects.

## Usage

### Admin Panel

1. **Access the admin panel**: `https://your-site.netlify.app/admin`
2. **Login** with your credentials (default: admin@company.com / admin123)
3. **Create a new project**:
   - Enter project name and description
   - Add client information
   - Set project URL and deadline
4. **Manage tasks**:
   - Add tasks with priorities and due dates
   - Update task status as work progresses
   - Track estimated vs actual hours

### Client View

1. **Share the client URL**: `https://your-site.netlify.app/project/{publicId}`
2. **Clients can view**:
   - Real-time progress updates
   - Task completion status
   - Project deadline countdown
   - Direct links to live project

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Projects
- `GET /api/projects` - Get all projects (admin)
- `GET /api/projects/public/:publicId` - Get project by public ID (client)
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/project/:projectId` - Get tasks for project
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Real-time Features

The system uses WebSocket connections to provide real-time updates:

- **Project Updates**: Changes to project details
- **Task Updates**: Task status changes and new tasks
- **Progress Updates**: Automatic progress calculation
- **Live Notifications**: Instant updates across all connected clients

## Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (admin/user)
}
```

### Project
```javascript
{
  name: String,
  description: String,
  clientName: String,
  clientEmail: String,
  projectUrl: String,
  estimatedDeadline: Date,
  status: String,
  progress: Number (0-100),
  publicId: String (unique),
  createdBy: ObjectId
}
```

### Task
```javascript
{
  title: String,
  description: String,
  status: String (pending/in-progress/completed/blocked),
  priority: String (low/medium/high/urgent),
  estimatedHours: Number,
  actualHours: Number,
  dueDate: Date,
  project: ObjectId,
  createdBy: ObjectId
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Configured for production domains
- **Input Validation**: Server-side validation for all inputs
- **Public ID System**: Secure client access without authentication

## Customization

### Styling
- Modify `frontend/src/index.css` for custom styles
- Update color schemes and layouts as needed

### Features
- Add new task statuses in the models
- Implement file uploads for project assets
- Add email notifications for clients
- Integrate with external project management tools

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure MongoDB is running locally or Atlas connection is correct
   - Check environment variables

2. **Real-time Updates Not Working**
   - Verify Socket.io configuration
   - Check CORS settings

3. **Build Issues**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

### Support

For issues and questions:
1. Check the console for error messages
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check MongoDB connection

## License

MIT License - feel free to use and modify for your company's needs.


