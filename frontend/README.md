# Frontend - Team Task Manager

A high-performance, interactive dashboard built with React and TailwindCSS.

## 🛠 Prerequisites
- Node.js (v22 or higher)
- npm

## ⚙️ Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**:
   The frontend expects the backend to be running at `http://localhost:5000`. You can configure this in `src/services/api.ts` if needed.

## 🚀 Running the App

### Development
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production
```bash
npm run build
npm run preview
```

## 🧹 Code Quality
- `npm run lint`: Scans for potential issues.
- `npm run lint:fix`: Automatically formats the code according to project standards.

## 🏗 Key Technologies
- **Vite**: Ultra-fast build tool.
- **ShadcnUI**: Radix-based premium components.
- **Zustand**: Lightweight and scalable state management.
