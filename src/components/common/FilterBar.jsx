import { useState } from 'react';

export const FilterBar = ({ filters, onFilterChange, onReset, loading = false }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleInputChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-bold text-primary">Filtros de búsqueda</h3>
        <button
          onClick={handleReset}
          className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
          disabled={loading}
        >
          Limpiar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Búsqueda por nombre */}
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Juan García..."
            value={filters.nombre || ''}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-gold focus:outline-none bg-transparent placeholder-gray-400 text-gray-900 transition"
            disabled={loading}
          />
        </div>

        {/* Municipio */}
        {filters.municipios && (
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Municipio
            </label>
            <select
              value={filters.municipio_id || ''}
              onChange={(e) => handleInputChange('municipio_id', e.target.value)}
              className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-gold focus:outline-none bg-transparent text-gray-900 transition"
              disabled={loading}
            >
              <option value="">Todos los municipios</option>
              {filters.municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Cargo */}
        {filters.cargos && (
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Cargo
            </label>
            <select
              value={filters.cargo_id || ''}
              onChange={(e) => handleInputChange('cargo_id', e.target.value)}
              className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-gold focus:outline-none bg-transparent text-gray-900 transition"
              disabled={loading}
            >
              <option value="">Todos los cargos</option>
              {filters.cargos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Partido */}
        {filters.partidos && (
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Partido
            </label>
            <select
              value={filters.partido_id || ''}
              onChange={(e) => handleInputChange('partido_id', e.target.value)}
              className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-gold focus:outline-none bg-transparent text-gray-900 transition"
              disabled={loading}
            >
              <option value="">Todos los partidos</option>
              {filters.partidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Afinidad */}
        {filters.afinidades && (
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Afinidad
            </label>
            <select
              value={filters.afinidad || ''}
              onChange={(e) => handleInputChange('afinidad', e.target.value)}
              className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-gold focus:outline-none bg-transparent text-gray-900 transition"
              disabled={loading}
            >
              <option value="">Todas las afinidades</option>
              {filters.afinidades.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prioridad */}
        {filters.prioridades && (
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Prioridad
            </label>
            <select
              value={filters.prioridad || ''}
              onChange={(e) => handleInputChange('prioridad', e.target.value)}
              className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-gold focus:outline-none bg-transparent text-gray-900 transition"
              disabled={loading}
            >
              <option value="">Todas las prioridades</option>
              {filters.prioridades.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
