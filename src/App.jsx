import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ContactProvider } from './contexts/ContactContext';
import { useContext, useState } from 'react';
import { Login } from './components/auth/Login';
import { ContactList } from './components/contactos/ContactList';
import { CategoryView } from './components/contactos/CategoryView';
import { MapView } from './components/mapa/MapView';
import { Reports } from './components/reportes/Reports';
import { Sidebar, Header, Footer } from './components/common/Layout';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-l-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout principal para rutas autenticadas
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}>
        <Header isSidebarOpen={isSidebarOpen} onToggleMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 bg-bg pt-24 px-4 md:px-8 pb-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

// Aplicación principal
const AppContent = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/contactos" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contactos"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ContactList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categoria/:category"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CategoryView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mapa"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MapView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/contactos" replace />} />
    </Routes>
  );
};

// Aplicación envuelta con Auth y Contact Provider
function App() {
  return (
    <Router>
      <AuthProvider>
        <ContactProvider>
          <AppContent />
        </ContactProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
