import { useState } from 'react';
import { Inbox } from 'lucide-react';
import { Spinner, EmptyState, SkeletonLoader } from './UIComponents';

export const DataTable = ({
  columns,
  data,
  loading = false,
  error = null,
  onRetry = null,
  pagination = true,
  itemsPerPage = 20,
  actions = [],
  selectedRows = [],
  onSelectRow = null,
  striped = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <SkeletonLoader count={5} type="table-row" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <EmptyState
          icon="⚠️"
          title="Error al cargar datos"
          description={error}
        />
        {onRetry && (
          <div className="text-center mt-4">
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition font-semibold"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <EmptyState
          icon={<Inbox size={48} className="opacity-50" />}
          title="Sin datos"
          description="No hay registros para mostrar"
        />
      </div>
    );
  }

  // Cálculos de paginación
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = pagination ? data.slice(startIndex, endIndex) : data;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {onSelectRow && (
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === displayData.length && displayData.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectRow(displayData.map((_, i) => startIndex + i));
                      } else {
                        onSelectRow([]);
                      }
                    }}
                    className="w-4 h-4 accent-gold rounded"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayData.map((row, index) => (
              <tr
                key={row.id || index}
                className="hover:bg-gray-50/50 transition duration-200"
              >
                {onSelectRow && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(startIndex + index)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectRow([...selectedRows, startIndex + index]);
                        } else {
                          onSelectRow(
                            selectedRows.filter((i) => i !== startIndex + index)
                          );
                        }
                      }}
                      className="w-4 h-4 accent-gold rounded"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-gray-900"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      {actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => action.onClick(row)}
                          className={`px-3 py-1.5 rounded text-xs font-semibold transition duration-200 ${
                            action.className ||
                            'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                          }`}
                          title={action.label}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <div className="flex justify-between items-center p-4 bg-gray-50/50 border-t border-gray-200">
          <span className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(endIndex, data.length)}</span> de <span className="font-bold text-gray-900">{data.length}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold text-gray-700"
            >
              ← Anterior
            </button>
            <div className="flex items-center gap-2 px-4 border border-gray-300 rounded-lg bg-white">
              <span className="text-sm font-bold text-gray-900">
                {currentPage}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-600">
                {totalPages}
              </span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold text-gray-700"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
