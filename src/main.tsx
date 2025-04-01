import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import { Login } from './pages/Login'; // Comment out login page temporarily
// import { ProtectedRoute } from './components/ProtectedRoute'; // Comment out ProtectedRoute temporarily
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Temporarily bypass authentication */}
          <Route path="/" element={<App />} />
          {/* If you had other links or components referencing "/login", comment them out temporarily */}
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
