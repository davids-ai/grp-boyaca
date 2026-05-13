import { useState, useEffect, useMemo } from 'react';
import { Download, Printer, Eye, Filter } from 'lucide-react';
import { useContacts } from '../../contexts/ContactContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const AFINIDAD_OPTIONS = ['aliado', 'opositor', 'neutro'];
const INFLUENCIA_OPTIONS = ['alto', 'medio', 'bajo'];

export const Reports = () => {
  const { allContacts, loading } = useContacts();
  const [filteredContactos, setFilteredContactos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(null);
  const itemsPerPage = 20;

  const [reportFilters, setReportFilters] = useState({
    afinidad: '',
    influencia: '',
    municipio_nombre: '',
    cargo_nombre: '',
    moviliza: '',
  });

  const [searchText, setSearchText] = useState('');

  // Obtener opciones únicas para dropdowns
  const uniqueOptions = useMemo(() => {
    if (!allContacts || allContacts.length === 0) return {};

    const municipios = [...new Set(allContacts.map(c => c.municipio_nombre).filter(Boolean))].sort();
    const cargos = [...new Set(allContacts.map(c => c.cargo_nombre).filter(Boolean))].sort();

    return { municipios, cargos };
  }, [allContacts]);

  // Filtrar contactos
  useEffect(() => {
    let filtered = allContacts || [];

    // Filtro por texto (búsqueda por nombre)
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(c => 
        (c.nombre && c.nombre.toLowerCase().includes(search)) ||
        (c.cargo_nombre && c.cargo_nombre.toLowerCase().includes(search))
      );
    }

    // Filtro por afinidad
    if (reportFilters.afinidad) {
      filtered = filtered.filter(c => c.afinidad === reportFilters.afinidad);
    }

    // Filtro por influencia
    if (reportFilters.influencia) {
      filtered = filtered.filter(c => c.influencia === reportFilters.influencia);
    }

    // Filtro por municipio
    if (reportFilters.municipio_nombre) {
      filtered = filtered.filter(c => c.municipio_nombre === reportFilters.municipio_nombre);
    }

    // Filtro por cargo
    if (reportFilters.cargo_nombre) {
      filtered = filtered.filter(c => c.cargo_nombre === reportFilters.cargo_nombre);
    }

    // Filtro por movilizadores
    if (reportFilters.moviliza === 'si') {
      filtered = filtered.filter(c => c.moviliza === true || c.moviliza === 1);
    } else if (reportFilters.moviliza === 'no') {
      filtered = filtered.filter(c => !c.moviliza || c.moviliza === 0 || c.moviliza === false);
    }

    setFilteredContactos(filtered);
    setCurrentPage(1);

    // Calcular estadísticas
    const aliados = filtered.filter(c => c.afinidad === 'aliado').length;
    const opositores = filtered.filter(c => c.afinidad === 'opositor').length;
    const neutros = filtered.filter(c => c.afinidad === 'neutro').length;
    const influenciaAlta = filtered.filter(c => c.influencia === 'alto').length;
    const movilizadores = filtered.filter(c => c.moviliza === true || c.moviliza === 1).length;

    setStats({
      total: filtered.length,
      aliados,
      opositores,
      neutros,
      influenciaAlta,
      movilizadores,
    });
  }, [allContacts, reportFilters, searchText]);

  const handleFilterChange = (field, value) => {
    setReportFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExportExcel = () => {
    const exportData = filteredContactos.map(c => ({
      'Nombre': c.nombre || '',
      'Cargo': c.cargo_nombre || '',
      'Municipio': c.municipio_nombre || '',
      'Provincia': c.provincia_nombre || '',
      'Afinidad': c.afinidad || '',
      'Influencia': c.influencia || '',
      'Moviliza': c.moviliza ? 'Sí' : 'No',
      'Relación': c.relacion_nombre || '',
      'Teléfono': c.telefono || '',
      'Período': c.periodo || '',
      'Partido': c.partido_nombre || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `reporte_contactos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Encabezado
    doc.setFontSize(18);
    doc.text('REPORTE GRP BOYACÁ', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Reporte de Contactos Políticos`, pageWidth / 2, yPosition, { align: 'center' });
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, pageWidth / 2, yPosition + 5, { align: 'center' });
    yPosition += 15;

    // Estadísticas
    doc.setFontSize(12);
    doc.text('📊 Estadísticas:', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    const statsText = [
      `Total de Contactos: ${stats?.total || 0}`,
      `Aliados: ${stats?.aliados || 0} | Opositores: ${stats?.opositores || 0} | Neutros: ${stats?.neutros || 0}`,
      `Influencia Alta: ${stats?.influenciaAlta || 0} | Movilizadores: ${stats?.movilizadores || 0}`,
    ];

    statsText.forEach((text) => {
      doc.text(text, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Tabla
    if (filteredContactos.length > 0) {
      const columns = ['Nombre', 'Cargo', 'Municipio', 'Afinidad', 'Influencia'];
      const rows = filteredContactos.slice(0, 50).map((c) => [
        c.nombre || '',
        c.cargo_nombre || '',
        c.municipio_nombre || '',
        c.afinidad || '',
        c.influencia || '',
      ]);

      try {
        doc.autoTable({
          columns,
          body: rows,
          startY: yPosition,
          margin: { top: 10, right: 10, bottom: 10, left: 10 },
          headStyles: {
            fillColor: [26, 36, 86],
            textColor: 255,
            fontSize: 9,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: 8,
          },
        });
      } catch (e) {
        console.error('Error en autoTable:', e);
      }
    }

    doc.save(`reporte_contactos_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Paginación
  const totalPages = Math.ceil(filteredContactos.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedData = filteredContactos.slice(startIdx, endIdx);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Reportes</h1>
        <p className="text-sm text-text-3">
          Análisis e informes de tus contactos políticos
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} style={{ color: '#1a2456' }} />
          <h2 className="text-lg font-bold text-navy">Parámetros del Reporte</h2>
        </div>

        {/* Búsqueda por nombre */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o cargo..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none transition-all"
            style={{
              borderColor: searchText ? '#1a2456' : '#E5E7EB',
            }}
          />
        </div>

        {/* Grid de filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Afinidad */}
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-navy mb-2">Afinidad</label>
            <select
              value={reportFilters.afinidad}
              onChange={(e) => handleFilterChange('afinidad', e.target.value)}
              className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:outline-none"
              style={{ borderColor: reportFilters.afinidad ? '#1a2456' : '#E5E7EB' }}
            >
              <option value="">Todas</option>
              {AFINIDAD_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Influencia */}
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-navy mb-2">Influencia</label>
            <select
              value={reportFilters.influencia}
              onChange={(e) => handleFilterChange('influencia', e.target.value)}
              className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:outline-none"
              style={{ borderColor: reportFilters.influencia ? '#1a2456' : '#E5E7EB' }}
            >
              <option value="">Todas</option>
              {INFLUENCIA_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Municipio */}
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-navy mb-2">Municipio</label>
            <select
              value={reportFilters.municipio_nombre}
              onChange={(e) => handleFilterChange('municipio_nombre', e.target.value)}
              className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:outline-none"
              style={{ borderColor: reportFilters.municipio_nombre ? '#1a2456' : '#E5E7EB' }}
            >
              <option value="">Todos</option>
              {uniqueOptions.municipios?.map(mun => (
                <option key={mun} value={mun}>
                  {mun}
                </option>
              ))}
            </select>
          </div>

          {/* Cargo */}
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-navy mb-2">Cargo</label>
            <select
              value={reportFilters.cargo_nombre}
              onChange={(e) => handleFilterChange('cargo_nombre', e.target.value)}
              className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:outline-none"
              style={{ borderColor: reportFilters.cargo_nombre ? '#1a2456' : '#E5E7EB' }}
            >
              <option value="">Todos</option>
              {uniqueOptions.cargos?.map(cargo => (
                <option key={cargo} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>
          </div>

          {/* Movilizadores */}
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-navy mb-2">Movilizadores</label>
            <select
              value={reportFilters.moviliza}
              onChange={(e) => handleFilterChange('moviliza', e.target.value)}
              className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:outline-none"
              style={{ borderColor: reportFilters.moviliza ? '#1a2456' : '#E5E7EB' }}
            >
              <option value="">Todos</option>
              <option value="si">Movilizadores</option>
              <option value="no">No Movilizadores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard label="Total" value={stats?.total || 0} color="blue" />
        <StatCard label="Aliados" value={stats?.aliados || 0} color="green" />
        <StatCard label="Opositores" value={stats?.opositores || 0} color="red" />
        <StatCard label="Neutros" value={stats?.neutros || 0} color="gray" />
        <StatCard label="Influencia Alta" value={stats?.influenciaAlta || 0} color="accent" />
      </div>

      {/* Botones de Exportación */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-stretch">
        <button
          onClick={handleExportExcel}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-soft text-green hover:bg-green-100 rounded-lg font-semibold transition"
        >
          <Download size={18} /> Exportar Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-soft text-red hover:bg-red-100 rounded-lg font-semibold transition"
        >
          <Download size={18} /> Exportar PDF
        </button>
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-bg-app text-text hover:bg-border rounded-lg font-semibold transition"
        >
          <Printer size={18} /> Imprimir
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-navy">Resultados ({filteredContactos.length})</h2>
        </div>

        {filteredContactos.length === 0 ? (
          <div className="p-8 text-center text-text-3">
            No hay resultados que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-full">
                <thead>
                  <tr className="border-b border-border bg-bg-app">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-2">NOMBRE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-2">CARGO</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-2">MUNICIPIO</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-2">AFINIDAD</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-2">INFLUENCIA</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-2 hidden lg:table-cell">RELACIÓN</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-2 hidden xl:table-cell">TELÉFONO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedData.map((contact, idx) => (
                    <tr key={contact.id || idx} className="hover:bg-bg-app transition">
                      <td className="px-6 py-3 text-sm text-text">{contact.nombre || ''}</td>
                      <td className="px-6 py-3 text-sm text-text-2">{contact.cargo_nombre || ''}</td>
                      <td className="px-6 py-3 text-sm text-text-2">{contact.municipio_nombre || ''}</td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor:
                              contact.afinidad === 'aliado'
                                ? 'rgba(18, 183, 106, 0.1)'
                                : contact.afinidad === 'opositor'
                                ? 'rgba(240, 68, 56, 0.1)'
                                : 'rgba(102, 112, 133, 0.1)',
                            color:
                              contact.afinidad === 'aliado'
                                ? '#12B76A'
                                : contact.afinidad === 'opositor'
                                ? '#F04438'
                                : '#667085',
                          }}
                        >
                          {contact.afinidad ? contact.afinidad.charAt(0).toUpperCase() + contact.afinidad.slice(1) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-text-2">{contact.influencia ? contact.influencia.charAt(0).toUpperCase() + contact.influencia.slice(1) : '—'}</td>
                      <td className="px-6 py-3 text-sm text-text-2 hidden lg:table-cell">{contact.relacion_nombre || '—'}</td>
                      <td className="px-6 py-3 text-sm text-text-2 hidden xl:table-cell">{contact.telefono || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex flex-col items-center gap-4 text-center">
                <div className="text-sm text-text-3">
                  Mostrando {startIdx + 1} a {Math.min(endIdx, filteredContactos.length)} de {filteredContactos.length}
                </div>
                <div className="flex gap-2 items-center justify-center flex-wrap">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-bg-app disabled:opacity-50"
                  >
                    ← Anterior
                  </button>
                  
                  {/* Números de página inteligentes */}
                  {(() => {
                    const pages = [];
                    const showPages = 5;
                    const halfShow = Math.floor(showPages / 2);
                    let start = Math.max(1, currentPage - halfShow);
                    let end = Math.min(totalPages, start + showPages - 1);
                    if (end - start + 1 < showPages) {
                      start = Math.max(1, end - showPages + 1);
                    }
                    
                    if (start > 1) {
                      pages.push(
                        <button key={1} onClick={() => setCurrentPage(1)} className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-bg-app">1</button>
                      );
                      if (start > 2) {
                        pages.push(<span key="dots1" className="px-2">...</span>);
                      }
                    }
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-3 py-1 rounded-lg text-sm transition ${
                            currentPage === i
                              ? 'bg-navy text-white'
                              : 'border border-border hover:bg-bg-app'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    if (end < totalPages) {
                      if (end < totalPages - 1) {
                        pages.push(<span key="dots2" className="px-2">...</span>);
                      }
                      pages.push(
                        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-bg-app">{totalPages}</button>
                      );
                    }
                    
                    return pages;
                  })()}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-bg-app disabled:opacity-50"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Componente StatCard
const StatCard = ({ label, value, color }) => {
  const colorMap = {
    blue: { bg: 'rgba(79, 110, 247, 0.08)', text: '#4F6EF7', border: '#E0E7FF' },
    green: { bg: 'rgba(18, 183, 106, 0.08)', text: '#12B76A', border: '#D1F4E8' },
    red: { bg: 'rgba(240, 68, 56, 0.08)', text: '#F04438', border: '#FECDCA' },
    gray: { bg: 'rgba(102, 112, 133, 0.08)', text: '#667085', border: '#E5E7EB' },
    accent: { bg: 'rgba(196, 154, 34, 0.08)', text: '#C49A22', border: '#FEF0D9' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className="p-6 rounded-lg border-2"
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      <p className="text-xs font-semibold text-text-3 mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: c.text }}>
        {value.toLocaleString('es-CO')}
      </p>
    </div>
  );
};
