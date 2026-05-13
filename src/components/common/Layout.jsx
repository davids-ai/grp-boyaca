import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  MapPin,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Menu,
} from 'lucide-react';

// Sidebar - Estilo Finora (blanco, limpio)
export const Sidebar = ({ isOpen, setIsOpen, mobileOpen, setMobileOpen }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const { logout } = useAuth();

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);

  const menuSections = {
    PRINCIPAL: [
      { id: 'contactos', label: 'Contactos', icon: Users, path: '/contactos' },
      { id: 'mapa', label: 'Mapa', icon: MapPin, path: '/mapa' },
    ],
    ANÁLISIS: [
      { id: 'reportes', label: 'Reportes', icon: BarChart2, path: '/reportes' },
    ],
  };

  const renderMenuItem = (item) => {
    const IconComponent = item.icon;
    const active = isActive(item.path);
    const itemClasses = isOpen
      ? 'justify-start mx-2'
      : 'justify-center mx-0';

    return (
      <Link
        key={item.id}
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2 ${itemClasses} rounded-md transition-all text-sm font-medium ${
          active
            ? 'bg-blue-soft text-blue'
            : 'text-text-3 hover:text-text hover:bg-bg-app'
        }`}
        title={!isOpen ? item.label : ''}
      >
        <IconComponent size={18} />
        {isOpen && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 bg-bg-card border-r border-border transition-all duration-300 overflow-y-auto ${
        isOpen ? 'w-64' : 'w-20'
      } hidden md:block`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-20 border-b border-border">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <h1 className="text-lg font-bold text-navy">GRP Boyacá</h1>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-bg-app rounded-lg transition text-text-3"
            title={isOpen ? 'Colapsar' : 'Expandir'}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-6 space-y-8">
          {Object.entries(menuSections).map(([section, items]) => (
            <div key={section}>
              {isOpen && (
                <p className="px-4 text-xs font-bold uppercase tracking-wide text-text-3 mb-3">
                  {section}
                </p>
              )}
              <div className="space-y-1">
                {items.map(renderMenuItem)}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4 bg-bg-app">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-text-3 hover:text-red text-sm font-medium transition"
          >
            <LogOut size={18} />
            {isOpen && <span>Salir</span>}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } md:hidden`}
        onClick={closeMobile}
      />
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-bg-card border-r border-border shadow-xl transition-transform duration-300 md:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 h-20 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <h1 className="text-lg font-bold text-navy">GRP Boyacá</h1>
          </div>
          <button
            onClick={closeMobile}
            className="p-1.5 hover:bg-bg-app rounded-lg transition text-text-3"
            title="Cerrar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="py-6 space-y-8">
          {Object.entries(menuSections).map(([section, items]) => (
            <div key={section}>
              <p className="px-4 text-xs font-bold uppercase tracking-wide text-text-3 mb-3">
                {section}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={closeMobile}
                      className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-all text-sm font-medium ${
                        isActive(item.path)
                          ? 'bg-blue-soft text-blue'
                          : 'text-text-3 hover:text-text hover:bg-bg-app'
                      }`}
                    >
                      <IconComponent size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4 bg-bg-app">
          <button
            onClick={() => {
              logout();
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-text-3 hover:text-red text-sm font-medium transition"
          >
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Header - Estilo Rexora/Finora
export const Header = ({ isSidebarOpen, onToggleMobileSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/' || path === '/contactos') return 'Contactos';
    if (path === '/contactos') return 'Contactos';
    if (path === '/mapa') return 'Mapa';
    if (path === '/reportes') return 'Reportes';
    return 'Panel';
  };

  const headerWidthClass = isSidebarOpen
    ? 'md:left-64 md:w-[calc(100%-16rem)]'
    : 'md:left-20 md:w-[calc(100%-5rem)]';

  return (
    <header className={`fixed top-0 left-0 right-0 ${headerWidthClass} bg-bg-card border-b border-border z-30 transition-all duration-300`}>
      <div className="px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 h-auto md:h-20 w-full">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onToggleMobileSidebar()}
            className="md:hidden p-2 rounded-lg bg-bg-app text-text-3 hover:bg-bg-card transition"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-3">GRP /</span>
              <h2 className="text-lg font-bold text-navy truncate">{getBreadcrumb()}</h2>
            </div>
            {(location.pathname === '/' || location.pathname === '/contactos') && (
              <p className="text-xs text-text-3 mt-1">
                Resumen de contactos políticos en Boyacá
              </p>
            )}
          </div>
        </div>

        <div className="w-full md:w-64">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-app border border-border rounded-md focus-within:border-blue transition w-full">
            <Search size={16} className="text-text-3" />
            <input
              type="text"
              placeholder="Buscar contactos..."
              className="flex-1 bg-transparent text-sm placeholder-text-3 outline-none"
            />
            <span className="text-xs text-text-3 ml-2">⌘K</span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="w-px h-6 bg-border hidden md:block"></div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1 hover:bg-bg-app rounded-lg transition"
            >
              <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-text">{user?.username}</p>
                <p className="text-xs text-text-3">Admin</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-text-3 hover:bg-bg-app hover:text-red transition flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Footer
export const Footer = () => {
  return (
    <footer className="bg-bg-card border-t border-border py-4 text-center text-xs text-text-3">
      <p>© 2025 GRP</p>
    </footer>
  );
};
