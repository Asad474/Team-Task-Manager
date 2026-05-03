# Backend - Team Task Manager

The core API for the Team Task Manager, built with Node.js and Express.

## 🛠 Prerequisites
- Node.js (v22 or higher)
- MongoDB (running locally or via Atlas)
- npm

## ⚙️ Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   Ensure you have the following variables in your `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task_manager
   JWT_SECRET=your_super_secret_key
   ```

3. **Database Seeding (Optional)**:
   Create an admin account to get started:
   ```bash
   npm run seed:admin
   ```

## 🚀 Running the Server

### Development
```bash
npm run dev
```
The server will start at `http://localhost:5000` with hot-reloading enabled via `tsx`.

### Production
```bash
npm run build
npm start
```

## 🧪 Key Scripts
- `npm run lint`: Run ESLint checks.
- `npm run lint:fix`: Automatically fix linting and formatting issues.
- `npm run seed:admin`: Initialize the database with an admin user.
