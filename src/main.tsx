import { createRoot } from 'react-dom/client';
import { AuthProvider } from './services/auth/context/AuthContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);