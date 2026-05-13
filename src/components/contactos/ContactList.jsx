import { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Search, PencilLine, Trash2, UserRound } from 'lucide-react';
import { contactService } from '../../api/apiClient';
import { useContacts } from '../../contexts/ContactContext';
import { Modal, Spinner, Alert, EmptyState } from '../common/UIComponents';
import { ContactForm } from './ContactForm';
import * as XLSX from 'xlsx';

export const ContactList = () => {
  const { allContacts, loading, error: contextError, refreshContacts } = useContacts();
  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    nombre: '',
    municipio_nombre: '',
    cargo_nombre: '',
    afinidad: '',
    influencia: '',
    moviliza: '',
  });

  useEffect(() => {
    setContactos(allContacts || []);
  }, [allContacts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const uniqueOptions = useMemo(() => {
    const normalize = (value) => (value || '').trim();
    const uniqueSorted = (items) =>
      [...new Set(items.map(normalize).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));

    return {
      municipios: uniqueSorted(contactos.map((contacto) => contacto.municipio_nombre)),
      cargos: uniqueSorted(contactos.map((contacto) => contacto.cargo_nombre)),
      afinidades: uniqueSorted(contactos.map((contacto) => contacto.afinidad)),
      influencias: uniqueSorted(contactos.map((contacto) => contacto.influencia)),
    };
  }, [contactos]);

  const filteredContactos = useMemo(() => {
    let filtered = [...contactos];

    if (filters.nombre) {
      const term = filters.nombre.toLowerCase();
      filtered = filtered.filter((contacto) => {
        const haystack = [
          contacto.nombre,
          contacto.apellidos,
          contacto.cargo_nombre,
          contacto.municipio_nombre,
          contacto.provincia_nombre,
          contacto.telefono,
          contacto.relacion_nombre,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    if (filters.municipio_nombre) {
      filtered = filtered.filter((contacto) => contacto.municipio_nombre === filters.municipio_nombre);
    }

    if (filters.cargo_nombre) {
      filtered = filtered.filter((contacto) => contacto.cargo_nombre === filters.cargo_nombre);
    }

    if (filters.afinidad) {
      filtered = filtered.filter((contacto) => contacto.afinidad === filters.afinidad);
    }

    if (filters.influencia) {
      filtered = filtered.filter((contacto) => contacto.influencia === filters.influencia);
    }

    if (filters.moviliza !== '') {
      const wantsYes = filters.moviliza === 'si';
      filtered = filtered.filter((contacto) => Boolean(contacto.moviliza) === wantsYes);
    }

    return filtered;
  }, [contactos, filters]);

  const paginatedContactos = useMemo(() => {
    const itemsPerPage = 20;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContactos.slice(start, start + itemsPerPage);
  }, [currentPage, filteredContactos]);

  const totalPages = Math.max(1, Math.ceil(filteredContactos.length / 20));
  const startIndex = (currentPage - 1) * 20;
  const endIndex = Math.min(startIndex + 20, filteredContactos.length);

  const handleEdit = (contactoId) => {
    const contacto = contactos.find((item) => item.id === contactoId);
    setSelectedContacto(contacto || null);
    setShowFormModal(true);
  };

  const handleDelete = async (contactoId) => {
    if (!window.confirm('¿Está seguro que desea eliminar este contacto?')) {
      return;
    }

    try {
      await contactService.deleteContacto(contactoId);
      setContactos((prev) => prev.filter((contacto) => contacto.id !== contactoId));
      await refreshContacts();
      setError(null);
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedContacto) {
        await contactService.updateContacto(selectedContacto.id, formData);
      } else {
        await contactService.createContacto(formData);
      }

      await refreshContacts();
      setShowFormModal(false);
      setSelectedContacto(null);
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    }
  };

  const handleExportExcel = () => {
    const exportRows = filteredContactos.map((contacto) => ({
      Nombre: contacto.nombre || '',
      Apellidos: contacto.apellidos || '',
      Cargo: contacto.cargo_nombre || '',
      Municipio: contacto.municipio_nombre || '',
      Provincia: contacto.provincia_nombre || '',
      Afinidad: contacto.afinidad || '',
      Influencia: contacto.influencia || '',
      Moviliza: contacto.moviliza ? 'Sí' : 'No',
      Relación: contacto.relacion_nombre || contacto.relacion || '',
      Teléfono: contacto.telefono || '',
      Período: contacto.periodo || '',
      Partido: contacto.partido_nombre || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contactos');
    XLSX.writeFile(wb, `contactos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const resetFilters = () => {
    setFilters({
      nombre: '',
      municipio_nombre: '',
      cargo_nombre: '',
      afinidad: '',
      influencia: '',
      moviliza: '',
    });
  };

  const stats = useMemo(() => {
    return {
      total: filteredContactos.length,
      aliados: filteredContactos.filter((contacto) => contacto.afinidad === 'aliado').length,
      opositores: filteredContactos.filter((contacto) => contacto.afinidad === 'opositor').length,
      neutros: filteredContactos.filter((contacto) => contacto.afinidad === 'neutro').length,
      moviliza: filteredContactos.filter((contacto) => Boolean(contacto.moviliza)).length,
    };
  }, [filteredContactos]);

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (_, row) => `${row.nombre || ''} ${row.apellidos || row.apellido || ''}`.trim() || '—',
    },
    { key: 'cargo_nombre', label: 'Cargo' },
    { key: 'municipio_nombre', label: 'Municipio' },
    { key: 'provincia_nombre', label: 'Provincia' },
    {
      key: 'afinidad',
      label: 'Afinidad',
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'aliado'
              ? 'bg-green-soft text-green'
              : value === 'opositor'
              ? 'bg-red-soft text-red'
              : 'bg-bg-app text-text-3'
          }`}
        >
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
        </span>
      ),
    },
    { key: 'influencia', label: 'Influencia' },
    { key: 'relacion_nombre', label: 'Relación' },
    {
      key: 'moviliza',
      label: 'Moviliza',
      render: (value) => (value ? 'Sí' : 'No'),
    },
    { key: 'telefono', label: 'Teléfono' },
  ];

  const actions = [
    {
      label: 'Editar',
      icon: <PencilLine size={14} />,
      className: 'bg-blue-soft text-blue hover:bg-blue-100 border border-blue-200',
      onClick: (row) => handleEdit(row.id),
    },
    {
      label: 'Eliminar',
      icon: <Trash2 size={14} />,
      className: 'bg-red-soft text-red hover:bg-red-100 border border-red-200',
      onClick: (row) => handleDelete(row.id),
    },
  ];

  const catalogs = {
    municipios: uniqueOptions.municipios.map((nombre, index) => ({ id: index + 1, nombre })),
    cargos: uniqueOptions.cargos.map((nombre, index) => ({ id: index + 1, nombre })),
    partidos: [],
  };

  if (loading) {
    return (
      <div className="p-8">
        <Spinner size="lg" />
        <p className="text-center mt-4 text-text-3">Cargando contactos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mt-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-navy mb-2">Todos los Contactos</h1>
          <p className="text-text-3">Gestiona tu base de contactos políticos</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap lg:justify-end">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border border-green-200 bg-green-soft text-green hover:bg-green-100 transition whitespace-nowrap shadow-sm"
          >
            <Download size={18} /> Exportar Excel
          </button>
          <button
            onClick={() => {
              setSelectedContacto(null);
              setShowFormModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-navy text-white hover:bg-navy-mid transition shadow-md whitespace-nowrap"
          >
            <Plus size={18} /> Nuevo Contacto
          </button>
        </div>
      </div>

      {(error || contextError) && (
        <Alert type="error" message={error || contextError} onClose={() => setError(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="bg-bg-card border border-border rounded-lg p-4 shadow-sm xl:col-span-2">
          <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Buscar</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 focus-within:border-navy transition">
            <Search size={16} className="text-text-3" />
            <input
              type="text"
              value={filters.nombre}
              onChange={(e) => setFilters((prev) => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre, cargo, municipio o teléfono"
              className="w-full outline-none text-sm text-text bg-transparent"
            />
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-4 shadow-sm">
          <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Municipio</label>
          <select
            value={filters.municipio_nombre}
            onChange={(e) => setFilters((prev) => ({ ...prev, municipio_nombre: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:border-navy"
          >
            <option value="">Todos</option>
            {uniqueOptions.municipios.map((municipio) => (
              <option key={municipio} value={municipio}>{municipio}</option>
            ))}
          </select>
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-4 shadow-sm">
          <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Cargo</label>
          <select
            value={filters.cargo_nombre}
            onChange={(e) => setFilters((prev) => ({ ...prev, cargo_nombre: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:border-navy"
          >
            <option value="">Todos</option>
            {uniqueOptions.cargos.map((cargo) => (
              <option key={cargo} value={cargo}>{cargo}</option>
            ))}
          </select>
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-4 shadow-sm">
          <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Afinidad</label>
          <select
            value={filters.afinidad}
            onChange={(e) => setFilters((prev) => ({ ...prev, afinidad: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:border-navy"
          >
            <option value="">Todas</option>
            <option value="aliado">Aliado</option>
            <option value="opositor">Opositor</option>
            <option value="neutro">Neutro</option>
          </select>
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-4 shadow-sm">
          <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Moviliza</label>
          <select
            value={filters.moviliza}
            onChange={(e) => setFilters((prev) => ({ ...prev, moviliza: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:border-navy"
          >
            <option value="">Todos</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} color="blue" />
        <StatCard label="Aliados" value={stats.aliados} color="green" />
        <StatCard label="Opositores" value={stats.opositores} color="red" />
        <StatCard label="Neutros" value={stats.neutros} color="gray" />
        <StatCard label="Moviliza" value={stats.moviliza} color="accent" />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 border-t border-border pt-1">
        <p className="text-sm text-text-3">
          Mostrando <strong className="text-text">{filteredContactos.length ? startIndex + 1 : 0}</strong> a{' '}
          <strong className="text-text">{endIndex}</strong> de <strong className="text-text">{filteredContactos.length}</strong>
        </p>
        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded-lg border border-border bg-bg-app text-text hover:bg-border transition text-sm font-semibold"
        >
          Limpiar filtros
        </button>
      </div>

      {filteredContactos.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-lg">
          <EmptyState
            icon={<UserRound size={48} className="opacity-50" />}
            title="Sin resultados"
            description="No hay contactos que coincidan con los filtros aplicados"
          />
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-bg-app border-b border-border">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-3"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-text-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedContactos.map((row) => (
                  <tr key={row.id} className="hover:bg-bg-app transition">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 text-sm text-text">
                        {column.render ? column.render(row[column.key], row) : (row[column.key] || '—')}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 flex-nowrap min-w-[150px]">
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            onClick={() => action.onClick(row)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${action.className}`}
                          >
                            {action.icon}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-border bg-white text-text hover:bg-bg-app disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                    return false;
                  })
                  .reduce((acc, page, index, source) => {
                    const prev = source[index - 1];
                    if (index > 0 && page - prev > 1) {
                      acc.push(<span key={`dots-${page}`} className="px-1 text-text-3">...</span>);
                    }
                    acc.push(
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                          currentPage === page
                            ? 'bg-navy text-white shadow-sm'
                            : 'border border-border bg-white text-text hover:bg-bg-app'
                        }`}
                      >
                        {page}
                      </button>
                    );
                    return acc;
                  }, [])}
              </div>

              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-border bg-white text-text hover:bg-bg-app disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showFormModal}
        title={selectedContacto ? 'Editar Contacto' : 'Nuevo Contacto'}
        onClose={() => {
          setShowFormModal(false);
          setSelectedContacto(null);
        }}
        size="lg"
      >
        <ContactForm
          contacto={selectedContacto}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowFormModal(false);
            setSelectedContacto(null);
          }}
          catalogs={catalogs}
        />
      </Modal>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colorMap = {
    blue: { bg: 'rgba(79, 110, 247, 0.08)', text: '#4F6EF7', border: '#E0E7FF' },
    green: { bg: 'rgba(18, 183, 106, 0.08)', text: '#12B76A', border: '#D1F4E8' },
    red: { bg: 'rgba(240, 68, 56, 0.08)', text: '#F04438', border: '#FECDCA' },
    gray: { bg: 'rgba(102, 112, 133, 0.08)', text: '#667085', border: '#E5E7EB' },
    accent: { bg: 'rgba(196, 154, 34, 0.08)', text: '#C49A22', border: '#FEF0D9' },
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-lg border p-4 shadow-sm" style={{ backgroundColor: style.bg, borderColor: style.border }}>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: style.text }}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold" style={{ color: style.text }}>
        {value}
      </p>
    </div>
  );
};
