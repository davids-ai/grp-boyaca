import { useState, useEffect } from 'react';
import { MapPin, Phone, Target } from 'lucide-react';

// Spinner de carga con color oro
export const Spinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-gold rounded-full animate-spin`}></div>
    </div>
  );
};

// Chip de afinidad con color según tipo - Colores semánticos
export const AfinidadBadge = ({ afinidad }) => {
  const styles = {
    'Aliado': 'bg-aliado/10 text-aliado border border-aliado/20',
    'Neutro': 'bg-neutral/10 text-neutral border border-neutral/20',
    'Opositor': 'bg-opositor/10 text-opositor border border-opositor/20',
  };

  const style = styles[afinidad] || 'bg-gray-100 text-gray-700 border border-gray-200';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${style}`}>
      {afinidad}
    </span>
  );
};

// Tarjeta de estadística con animación de contador
export const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = parseInt(value) || 0;
    const duration = 800; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.floor(progress * numValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numValue);
      }
    };

    animate();
  }, [value]);

  const colorClass = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-aliado/10 text-aliado',
    red: 'bg-opositor/10 text-opositor',
    yellow: 'bg-gold/10 text-gold',
  }[color];

  const borderColor = {
    blue: 'border-t-blue-500',
    green: 'border-t-aliado',
    red: 'border-t-opositor',
    yellow: 'border-t-gold',
  }[color];

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-t-4 ${borderColor} hover:shadow-md transition-all duration-300 transform hover:scale-102`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">{title}</p>
          <p className="text-4xl font-bold text-primary">{displayValue.toLocaleString()}</p>
        </div>
        {icon && <div className={`${colorClass} p-3 rounded-lg`}>{icon}</div>}
      </div>
    </div>
  );
};

// Modal genérico reutilizable con backdrop blur
export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Guardar', cancelText = 'Cancelar', size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-2xl ${sizeClass} w-full transform transition-all`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-display font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-semibold"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition font-semibold"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Tarjeta de contacto para listados
export const ContactCard = ({ contact, onEdit, onDelete, onView }) => {
  // Generar iniciales para avatar
  const initials = `${contact.nombre?.[0] || ''}${contact.apellido?.[0] || ''}`.toUpperCase();
  const avatarBg = 'bg-gold text-white';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md hover:border-gold/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className={`${avatarBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-semibold`}>
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">{contact.nombre} {contact.apellido}</h3>
            <p className="text-sm text-gray-600">{contact.cargo}</p>
          </div>
        </div>
        <AfinidadBadge afinidad={contact.afinidad} />
      </div>
import { MapPin, Phone, Target } from 'lucide-react';

// ... resto del código existente ...

      <div className="text-sm text-gray-700 mb-4 space-y-1 ml-15">
        <p className="flex items-center gap-2"><MapPin size={16} /> {contact.municipio}, {contact.provincia}</p>
        <p className="flex items-center gap-2"><Phone size={16} /> {contact.telefono}</p>
        <p className="flex items-center gap-2"><Target size={16} /> Influencia: <span className="font-semibold">{contact.influencia}</span></p>
      </div>
      <div className="flex gap-2">
        {onView && (
          <button
            onClick={() => onView(contact.id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold transition"
          >
            Ver
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(contact.id)}
            className="flex-1 px-3 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 text-sm font-semibold transition"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(contact.id)}
            className="flex-1 px-3 py-2 bg-opositor/10 text-opositor rounded-lg hover:bg-opositor/20 text-sm font-semibold transition"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

// Alerta/Notificación con nuevos colores
export const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    success: 'bg-aliado/10 text-aliado border border-aliado/20',
    error: 'bg-opositor/10 text-opositor border border-opositor/20',
    warning: 'bg-gold/10 text-gold border border-gold/20',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  };

  return (
    <div className={`${colors[type]} px-4 py-3 rounded-lg flex justify-between items-center mb-4 backdrop-blur-sm`}>
      <span className="font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-lg font-bold ml-2 hover:opacity-70 transition">
          ×
        </button>
      )}
    </div>
  );
};

// Estado vacío mejorado
export const EmptyState = ({ title, description, icon }) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-7xl mb-6 opacity-50">{icon}</div>
      <h3 className="text-2xl font-display font-bold text-primary mb-2">{title}</h3>
      <p className="text-gray-500 text-lg max-w-md mx-auto">{description}</p>
    </div>
  );
};

// Skeleton Loader para estados de carga
export const SkeletonLoader = ({ count = 1, type = 'card' }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <div className="space-y-2">
        {skeletons.map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
