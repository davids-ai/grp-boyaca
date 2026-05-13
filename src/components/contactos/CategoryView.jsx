import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contactService } from '../../api/apiClient';
import { DataTable } from '../common/DataTable';
import { AfinidadBadge, Spinner, Alert } from '../common/UIComponents';

export const CategoryView = () => {
  const { category } = useParams();
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryNames = {
    alcaldes: { nombre: 'Alcaldes 2024-2027', label: 'Alcalde' },
    diputados: { nombre: 'Diputados 2024-2027', label: 'Diputado' },
    concejales: { nombre: 'Concejales 2024-2027', label: 'Concejal' },
    jac: { nombre: 'JAC 2024', label: 'JAC' },
    mujeres: { nombre: 'Mujeres Presidentas', label: 'Presidenta' },
    jovenes: { nombre: 'Jóvenes', label: 'Joven' },
  };

  const currentCategory = categoryNames[category] || { nombre: 'Categoría', label: '' };

  useEffect(() => {
    loadContactosByCategory();
  }, [category]);

  const loadContactosByCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los contactos
      const response = await contactService.getContactos();
      const contactos = response.items || [];

      // Filtrar por categoría (simulado - en real sería por cargo o tipo)
      const filtered = contactos.filter((c) =>
        c.cargo?.toLowerCase().includes(currentCategory.label.toLowerCase())
      );

      setContactos(filtered);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando categoría:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre', render: (v, row) => `${row.nombre} ${row.apellido || ''}` },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'municipio', label: 'Municipio' },
    { key: 'partido', label: 'Partido' },
    { key: 'afinidad', label: 'Afinidad', render: (v) => <AfinidadBadge afinidad={v} /> },
    { key: 'influencia', label: 'Influencia' },
    { key: 'prioridad', label: 'Prioridad' },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <Spinner size="lg" />
        <p className="text-center mt-4 text-gray-500">Cargando contactos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-title font-bold text-primary mb-2">
          {currentCategory.nombre}
        </h1>
        <p className="text-gray-600">
          Total: <strong>{contactos.length}</strong> contacto{contactos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Tabla */}
      <DataTable columns={columns} data={contactos} pagination={true} itemsPerPage={20} />
    </div>
  );
};
