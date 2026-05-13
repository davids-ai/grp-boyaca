import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'boyaca2025';

    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        login(username);
        navigate('/');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex overflow-hidden">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 
          0%, 100% { box-shadow: 0 4px 12px rgba(26, 36, 86, 0.3); }
          50% { box-shadow: 0 8px 24px rgba(26, 36, 86, 0.5); }
        }
        .login-card { animation: slideInRight 500ms ease-out 150ms both; }
        .login-left { animation: fadeIn 600ms ease-out; }
        .form-field { animation: fadeInUp 400ms ease-out forwards; }
        .form-field:nth-child(1) { animation-delay: 200ms; }
        .form-field:nth-child(2) { animation-delay: 250ms; }
        .form-field:nth-child(3) { animation-delay: 300ms; }
        .form-field:nth-child(4) { animation-delay: 350ms; }
        .form-field:nth-child(5) { animation-delay: 400ms; }
        .form-field:nth-child(6) { animation-delay: 450ms; }
        .login-btn:hover { animation: glowPulse 2s ease-in-out infinite; transform: translateY(-2px); }
        .login-btn:active { transform: translateY(0); }
      `}</style>

      <div className="w-full h-full bg-white flex login-card rounded-none">
        {/* PANEL IZQUIERDO — 35% */}
        <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden login-left">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=85"
            alt="Edificio"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1509762176335-a1a6ca97d755?w=1000&q=85';
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(13,27,62,0.55) 0%, rgba(13,27,62,0.20) 40%, rgba(13,27,62,0.85) 100%)',
            }}
          ></div>
          
          {/* Logo grande semitransparente en el centro */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <img 
              src="/Logo.png" 
              alt="GRP Logo" 
              className="w-64 h-64 object-contain opacity-25"
              onError={(e) => {
                e.style.display = 'none';
              }}
            />
          </div>

          {/* Logo pequeño arriba a la izquierda */}
          <div className="absolute top-7 left-7 z-20">
            <img 
              src="/Logo.png" 
              alt="GRP Logo" 
              className="w-24 h-24 object-contain"
              onError={(e) => {
                e.style.display = 'none';
              }}
            />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-7 text-white z-10">
            <div></div>
            <div></div>
          </div>
        </div>

        {/* PANEL DERECHO — 65% */}
        <div 
          className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 lg:px-0 py-12 lg:py-0 login-card overflow-y-auto lg:overflow-y-visible"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FB 100%)',
          }}
        >
          <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col">
            {/* Logo centrado arriba del formulario */}
            <div className="flex justify-center mb-6 form-field">
              <img 
                src="/Logo.png" 
                alt="GRP Logo" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.style.display = 'none';
                }}
              />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-center form-field" style={{ color: '#1a2456' }}>
              Bienvenido a GRP
            </h1>

            <p className="text-xs text-center font-medium mb-2 form-field" style={{ color: '#667085' }}>
              Sistema de Gestión de Relaciones Políticas
            </p>

            <p className="text-sm leading-relaxed mb-8 text-center form-field" style={{ color: '#667085' }}>
              Ingrese sus credenciales para acceder al sistema.
            </p>

            {/* Campo Usuario */}
            <div className="mb-5 form-field">
              <label className="block text-xs font-semibold mb-2" style={{ color: '#1a2456' }}>
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none transition-all duration-200 bg-white"
                style={{
                  color: '#101828',
                  borderWidth: '2px',
                  borderColor: error ? '#F04438' : '#E5E7EB',
                  backgroundColor: '#FFFFFF',
                }}
                disabled={loading}
                required
                autoFocus
                onFocus={(e) => {
                  e.target.style.borderColor = '#1a2456';
                  e.target.style.boxShadow = '0 0 0 4px rgba(26, 36, 86, 0.08)';
                  e.target.style.backgroundColor = '#F8FAFC';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? '#F04438' : '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="mb-5 form-field">
              <label className="block text-xs font-semibold mb-2" style={{ color: '#1a2456' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full px-4 py-3 pr-12 rounded-lg text-sm focus:outline-none transition-all duration-200 bg-white"
                  style={{
                    color: '#101828',
                    borderWidth: '2px',
                    borderColor: error ? '#F04438' : '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                  }}
                  disabled={loading}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1a2456';
                    e.target.style.boxShadow = '0 0 0 4px rgba(26, 36, 86, 0.08)';
                    e.target.style.backgroundColor = '#F8FAFC';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error ? '#F04438' : '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                    e.target.style.backgroundColor = '#FFFFFF';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition hover:text-gray-700"
                  style={{ color: '#98A2B3' }}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Recordar sesión */}
            <div className="flex items-center justify-between mb-6 text-xs form-field">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#1a2456' }}
                />
                <span className="font-medium" style={{ color: '#344054' }}>
                  Recordar sesión
                </span>
              </label>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="login-btn w-full h-12 text-white font-semibold text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2 form-field"
              style={{
                backgroundColor: '#1a2456',
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>

            {/* Mensaje de error */}
            {error && (
              <div
                className="mt-3 p-3 rounded-lg flex items-start gap-3 form-field"
                style={{
                  backgroundColor: '#FEF3F2',
                  border: '1px solid #FECDCA',
                }}
              >
                <AlertCircle size={16} style={{ color: '#B42318' }} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium" style={{ color: '#B42318' }}>
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
