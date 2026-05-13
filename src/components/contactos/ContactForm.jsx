import { useEffect, useState } from 'react';
import { Alert, Spinner } from '../common/UIComponents';

export const ContactForm = ({ contacto, onSubmit, onCancel, catalogs }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    provincia_id: '',
    municipio_id: '',
    cargo_id: '',
    partido_id: '',
    afinidad: 'neutro',
    influencia: 'medio',
    relacion: '',
    prioridad: 'medio',
    responsable: '',
    ultimo_contacto: '',
    proximo_contacto: '',
    moviliza: false,
    notas: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contacto) {
      setFormData({
        nombre: contacto.nombre || '',
        apellidos: contacto.apellidos || contacto.apellido || '',
        telefono: contacto.telefono || '',
        provincia_id: contacto.provincia_id || '',
        municipio_id: contacto.municipio_id || '',
        cargo_id: contacto.cargo_id || '',
        partido_id: contacto.partido_id || '',
        afinidad: (contacto.afinidad || 'neutro').toLowerCase(),
        influencia: (contacto.influencia || 'medio').toLowerCase(),
        relacion: contacto.relacion || contacto.relacion_nombre || '',
        prioridad: (contacto.prioridad || 'medio').toLowerCase(),
        responsable: contacto.responsable || '',
        ultimo_contacto: contacto.ultimo_contacto || '',
        proximo_contacto: contacto.proximo_contacto || '',
        moviliza: Boolean(contacto.moviliza || contacto.estructura_moviliza),
        notas: contacto.notas || '',
      });
    }
  }, [contacto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.nombre.trim()) nextErrors.nombre = 'El nombre es requerido';
    if (!formData.telefono.trim()) nextErrors.telefono = 'El teléfono es requerido';
    if (!formData.municipio_id) nextErrors.municipio_id = 'El municipio es requerido';
    if (!formData.cargo_id) nextErrors.cargo_id = 'El cargo es requerido';
    if (!formData.afinidad) nextErrors.afinidad = 'La afinidad es requerida';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit({
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        telefono: formData.telefono.trim(),
        provincia_id: formData.provincia_id ? Number(formData.provincia_id) : null,
        municipio_id: formData.municipio_id ? Number(formData.municipio_id) : null,
        cargo_id: formData.cargo_id ? Number(formData.cargo_id) : null,
        partido_id: formData.partido_id ? Number(formData.partido_id) : null,
        afinidad: formData.afinidad,
        influencia: formData.influencia,
        relacion: formData.relacion.trim(),
        prioridad: formData.prioridad,
        responsable: formData.responsable.trim(),
        ultimo_contacto: formData.ultimo_contacto || null,
        proximo_contacto: formData.proximo_contacto || null,
        moviliza: formData.moviliza,
        notas: formData.notas.trim(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError = false) =>
    `w-full px-0 py-2 border-0 border-b-2 focus:outline-none bg-transparent placeholder-gray-400 transition ${
      hasError ? 'border-b-red-500 text-red-600' : 'border-b-gray-300 focus:border-b-navy text-gray-900'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del contacto"
            className={inputClass(!!errors.nombre)}
            disabled={loading}
          />
          {errors.nombre && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Apellidos del contacto"
            className={inputClass()}
            disabled={loading}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Teléfono *</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+57 300 1234567"
            className={inputClass(!!errors.telefono)}
            disabled={loading}
          />
          {errors.telefono && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.telefono}</p>}
        </div>

        {/* Municipio */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Municipio *</label>
          <select
            name="municipio_id"
            value={formData.municipio_id}
            onChange={handleChange}
            className={inputClass(!!errors.municipio_id)}
            disabled={loading}
          >
            <option value="">Seleccionar municipio</option>
            {catalogs.municipios?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          {errors.municipio_id && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.municipio_id}</p>}
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Cargo *</label>
          <select
            name="cargo_id"
            value={formData.cargo_id}
            onChange={handleChange}
            className={inputClass(!!errors.cargo_id)}
            disabled={loading}
          >
            <option value="">Seleccionar cargo</option>
            {catalogs.cargos?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errors.cargo_id && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.cargo_id}</p>}
        </div>

        {/* Partido */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Partido</label>
          <select
            name="partido_id"
            value={formData.partido_id}
            onChange={handleChange}
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-b-navy focus:outline-none bg-transparent text-gray-900 transition"
            disabled={loading}
          >
            <option value="">Seleccionar partido</option>
            {catalogs.partidos?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Afinidad */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Afinidad *</label>
          <select
            name="afinidad"
            value={formData.afinidad}
            onChange={handleChange}
            className={inputClass(!!errors.afinidad)}
            disabled={loading}
          >
            <option value="aliado">Aliado</option>
            <option value="neutro">Neutro</option>
            <option value="opositor">Opositor</option>
          </select>
          {errors.afinidad && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.afinidad}</p>}
        </div>

        {/* Influencia */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Influencia</label>
          <select
            name="influencia"
            value={formData.influencia}
            onChange={handleChange}
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-b-navy focus:outline-none bg-transparent text-gray-900 transition"
            disabled={loading}
          >
            <option value="alto">Alta</option>
            <option value="medio">Media</option>
            <option value="bajo">Baja</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Prioridad</label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-b-navy focus:outline-none bg-transparent text-gray-900 transition"
            disabled={loading}
          >
            <option value="alto">Alta</option>
            <option value="medio">Media</option>
            <option value="bajo">Baja</option>
          </select>
        </div>

        {/* Responsable */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Responsable</label>
          <input
            type="text"
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            placeholder="Responsable del contacto"
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-b-navy focus:outline-none bg-transparent placeholder-gray-400 text-gray-900 transition"
            disabled={loading}
          />
        </div>

        {/* Último Contacto */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Último Contacto</label>
          <input
            type="date"
            name="ultimo_contacto"
            value={formData.ultimo_contacto}
            onChange={handleChange}
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-b-navy focus:outline-none bg-transparent text-gray-900 transition"
            disabled={loading}
          />
        </div>

        {/* Próximo Contacto */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Próximo Contacto</label>
          <input
            type="date"
            name="proximo_contacto"
            value={formData.proximo_contacto}
            onChange={handleChange}
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-b-navy focus:outline-none bg-transparent text-gray-900 transition"
            disabled={loading}
          />
        </div>
      </div>

      {/* Checkbox Moviliza */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          name="moviliza"
          checked={formData.moviliza}
          onChange={handleChange}
          className="w-4 h-4 accent-navy rounded cursor-pointer"
          disabled={loading}
        />
        <label className="text-sm font-semibold text-text cursor-pointer">
          ¿Moviliza gente?
        </label>
      </div>

      {/* Notas */}
      <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-3">Notas adicionales</label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          placeholder="Escribe aquí tus notas sobre el contacto..."
          rows="4"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy bg-transparent placeholder-gray-400 text-gray-900 transition resize-none"
          disabled={loading}
        ></textarea>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-lg text-text hover:bg-bg-app transition font-semibold"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-mid transition flex items-center gap-2 disabled:opacity-50 font-semibold"
          disabled={loading}
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Guardando...' : 'Guardar Contacto'}
        </button>
      </div>
    </form>
  );
};
