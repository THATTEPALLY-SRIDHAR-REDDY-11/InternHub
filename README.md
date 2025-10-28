# 🚀 InternHub

A comprehensive platform for students and professionals to manage internships, projects, and career development.

*Previously known as Intern Insight Vault*

A comprehensive platform for students and professionals to manage internships, projects, and career development.

## ✨ Features

- **🔐 Authentication**: Secure user registration and login with Supabase
- **📄 Resume Builder**: Interactive resume creation and management
- **💼 Internship Management**: Browse and post internship opportunities
- **🚀 Project Showcase**: Create and share student projects
- **👤 Profile Management**: Manage user profiles and information
- **⭐ Reviews & Ratings**: Rate and review internships and projects
- **🎨 Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **ShadCN UI** components
- **React Router** for navigation
- **React Query** for data fetching
- **Supabase** for authentication

### Backend
- **Node.js** with Express
- **MongoDB** for data storage
- **Mongoose** ODM
- **CORS** enabled
- **File upload** support

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/THATTEPALLY-SRIDHAR-REDDY-11/InternHub.git
   cd InternHub
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   **Frontend (.env):**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```
   
   **Backend (server/.env):**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your MongoDB connection
   ```

5. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

6. **Start the development servers**
   
   **Backend:**
   ```bash
   cd server
   npm start
   ```
   
   **Frontend (in new terminal):**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:8080 (or the port shown in terminal)
   - Backend API: http://localhost:4000

## 📋 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=https://your-project-id.supabase.co
```

### Backend (server/.env)
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/test
MONGODB_DB_NAME=test

# Or MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
# MONGODB_DB_NAME=your_database_name

PORT=4000
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/test`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com/
2. Create a new cluster
3. Get connection string and update `.env`

## 📱 Usage

### For Students
- **Create Profile**: Set up your professional profile
- **Build Resume**: Use the interactive resume builder
- **Browse Internships**: Find opportunities that match your skills
- **Showcase Projects**: Share your work and collaborate

### For Employers
- **Post Internships**: Share opportunities with students
- **Review Applications**: Manage internship applications
- **Find Talent**: Browse student profiles and projects

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (if configured)

### Project Structure
```
intern-insight-vault/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── integrations/      # External service integrations
├── server/                # Backend source code
│   ├── temp-data/         # Temporary file storage
│   └── uploads/           # File uploads
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Supabase](https://supabase.com/) - Authentication and backend services
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - UI components

## 📞 Support

If you have any questions or need help, please:
1. Check the [documentation](docs/)
2. Open an [issue](https://github.com/THATTEPALLY-SRIDHAR-REDDY-11/InternHub/issues)
3. Contact the maintainers

---

**Made with ❤️ for students and professionals**
