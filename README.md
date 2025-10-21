# Project Progress Tracker

A lightweight project progress tracker with an admin dashboard and a public client view. Create projects, add tasks, and share a client-friendly progress page that updates in real time.

## Features

### Admin Panel
- **Authentication**: Email + password sign-in (sign-up disabled)
- **Project Management**: Create, edit, and delete projects
- **Task Management**: Add, update, and track tasks for each project
- **Live Progress**: Real-time task updates and progress calculation
- **Shareable Client URL**: Unique public link per project

### Client View
- **Public Progress Page**: No login required
- **Progress Bar**: Overall progress with color-coded task cards
- **Deadline**: Clear estimated deadline and remaining days
- **Real-time**: Updates instantly as tasks change

## Technology Stack

This project uses Firebase (Firestore + Auth) on the frontend-only stack for rapid setup and hosting simplicity.

### Backend (provided by Firebase)
- **Firestore** for data storage (projects, tasks)
- **Firebase Auth** for authentication
- **onSnapshot** listeners for real-time updates

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Deployment
- **Netlify** or **Vercel** for hosting
- **Firebase** (Firestore/Auth) for backend services

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Firestore + Auth enabled)
- Netlify/Vercel account (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-progress-tracker
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**

   Create `frontend/.env` from `frontend/env.example` and fill your Firebase config keys:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. **Start the development server**
   ```bash
   cd frontend
   npm run dev
   ```
   App runs at Vite's default port (5173).

### Deployment (Netlify/Vercel)

1. **Prepare for deployment**
   ```bash
   # Build the frontend
   cd frontend && npm run build
   ```

2. **Deploy**
- Connect your repository and set build command: `npm run build`
- Publish directory: `frontend/dist`
- Add the Firebase env vars in your hosting provider dashboard

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

## Data Model (Firestore)

### Project
```
projects/{projectId} {
  name: string,
  clientName: string,
  clientEmail: string,
  projectUrl: string,
  estimatedDeadline: Timestamp,
  status: string,
  publicId: string,
  createdBy: string (user id)
}
```

### Task
```
tasks/{taskId} {
  projectId: string,
  title: string,
  description: string,
  status: 'pending' | 'in-progress' | 'completed' | 'blocked',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  dueDate: Timestamp,
  createdBy: string
}
```

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
1. Check the browser console for error messages
2. Verify your Firebase project configuration
3. Ensure env variables are set correctly
4. Confirm Firestore rules allow required reads/writes

## License

MIT License - feel free to use and modify for your company's needs.


