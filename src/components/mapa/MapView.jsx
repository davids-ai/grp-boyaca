import { useState } from 'react';
import { Info, MapPin } from 'lucide-react';

const municipios = [
  { name: 'TUNJA', region: 'Centro', x: 390, y: 180, count: 48, aliados: 18, opositores: 21, neutros: 9 },
  { name: 'DUITAMA', region: 'Sugamuxi', x: 420, y: 150, count: 64, aliados: 27, opositores: 23, neutros: 14 },
  { name: 'SOGAMOSO', region: 'Sugamuxi', x: 455, y: 165, count: 71, aliados: 25, opositores: 31, neutros: 15 },
  { name: 'PAIPA', region: 'Sugamuxi', x: 405, y: 150, count: 39, aliados: 14, opositores: 17, neutros: 8 },
  { name: 'CHIQUINQUIRÁ', region: 'Occidente', x: 310, y: 240, count: 33, aliados: 12, opositores: 16, neutros: 5 },
  { name: 'VILLA DE LEYVA', region: 'Centro', x: 360, y: 235, count: 29, aliados: 13, opositores: 9, neutros: 7 },
  { name: 'RÁQUIRA', region: 'Centro', x: 330, y: 260, count: 22, aliados: 8, opositores: 10, neutros: 4 },
  { name: 'PUERTO BOYACÁ', region: 'Occidente', x: 220, y: 320, count: 19, aliados: 6, opositores: 9, neutros: 4 },
  { name: 'GARAGOA', region: 'Oriente', x: 500, y: 250, count: 27, aliados: 11, opositores: 10, neutros: 6 },
  { name: 'GUATEQUE', region: 'Oriente', x: 470, y: 290, count: 31, aliados: 15, opositores: 9, neutros: 7 },
  { name: 'MONIQUIRÁ', region: 'Occidente', x: 260, y: 285, count: 24, aliados: 10, opositores: 9, neutros: 5 },
  { name: 'SANTA ROSA DE VITERBO', region: 'Tundama', x: 440, y: 190, count: 26, aliados: 9, opositores: 11, neutros: 6 },
];

export const MapView = () => {
  const [hoveredMunicipio, setHoveredMunicipio] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState('BOYACÁ');

  const totalContactos = municipios.reduce((sum, municipio) => sum + municipio.count, 0);
  const maxContactos = Math.max(...municipios.map((municipio) => municipio.count));

  const getFillColor = (municipio) => {
    if (hoveredMunicipio === municipio.name) return '#C49A22';
    if (municipio.aliados > municipio.opositores && municipio.aliados > municipio.neutros) return '#12B76A';
    if (municipio.opositores > municipio.aliados && municipio.opositores > municipio.neutros) return '#F04438';
    return '#4F6EF7';
  };

  const selected = municipios.find((municipio) => municipio.name === selectedMunicipio);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2 flex items-center gap-3">
          <MapPin size={32} className="text-accent" />
          Mapa de Boyacá
        </h1>
        <p className="text-text-3">Vista geográfica ilustrativa de los municipios con actividad registrada.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-lg p-6">
          <svg viewBox="0 0 700 500" className="w-full h-[520px] rounded-lg bg-white">
            <rect width="700" height="500" fill="#F8F9FB" />

            <path
              d="M145 110 L215 80 L300 95 L370 70 L470 88 L565 145 L610 225 L585 320 L520 395 L430 418 L335 392 L245 410 L170 355 L135 270 L120 180 Z"
              fill="#EEF2F7"
              stroke="#D8E0EA"
              strokeWidth="2"
            />

            <text x="350" y="34" textAnchor="middle" fontSize="18" fill="#1a2456" fontFamily="Plus Jakarta Sans" fontWeight="700">
              Boyacá, Colombia
            </text>

            {municipios.map((municipio) => {
              const radius = 14 + (municipio.count / maxContactos) * 18;
              return (
                <g
                  key={municipio.name}
                  onMouseEnter={() => setHoveredMunicipio(municipio.name)}
                  onMouseLeave={() => setHoveredMunicipio(null)}
                  onClick={() => setSelectedMunicipio(municipio.name)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={municipio.x}
                    cy={municipio.y}
                    r={hoveredMunicipio === municipio.name ? radius + 4 : radius}
                    fill={getFillColor(municipio)}
                    stroke={selectedMunicipio === municipio.name ? '#1a2456' : 'white'}
                    strokeWidth={selectedMunicipio === municipio.name ? 3 : 2}
                    opacity="0.92"
                  />
                  <text
                    x={municipio.x}
                    y={municipio.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={radius > 24 ? '12' : '10'}
                    fill="white"
                    fontFamily="Plus Jakarta Sans"
                    fontWeight="700"
                  >
                    {municipio.count}
                  </text>
                  {hoveredMunicipio === municipio.name && (
                    <g>
                      <rect x={municipio.x - 62} y={municipio.y - 48} width="124" height="26" rx="6" fill="white" stroke="#1a2456" strokeWidth="1" />
                      <text x={municipio.x} y={municipio.y - 31} textAnchor="middle" fontSize="11" fill="#1a2456" fontFamily="Plus Jakarta Sans" fontWeight="700">
                        {municipio.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            <g transform="translate(22, 425)">
              <rect width="656" height="60" fill="white" stroke="#EAECF0" strokeWidth="1" rx="10" />
              <circle cx="24" cy="24" r="6" fill="#12B76A" />
              <text x="38" y="28" fontSize="11" fill="#667085" fontFamily="Plus Jakarta Sans">Aliados predominantes</text>
              <circle cx="196" cy="24" r="6" fill="#F04438" />
              <text x="210" y="28" fontSize="11" fill="#667085" fontFamily="Plus Jakarta Sans">Opositores predominantes</text>
              <circle cx="392" cy="24" r="6" fill="#4F6EF7" />
              <text x="406" y="28" fontSize="11" fill="#667085" fontFamily="Plus Jakarta Sans">Mixto / neutro</text>
              <text x="24" y="48" fontSize="11" fill="#667085" fontFamily="Plus Jakarta Sans">El tamaño de cada punto representa el volumen de contactos.</text>
            </g>
          </svg>
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Info size={20} />
            Información
          </h2>

          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase font-semibold text-text-3">Municipio</p>
                <p className="text-lg font-bold text-navy">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-text-3">Región</p>
                <p className="text-sm text-text-2">{selected.region}</p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs uppercase font-semibold text-text-3">Total de contactos</p>
                <p className="text-3xl font-bold text-accent">{selected.count}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-2">Aliados</span>
                  <span className="font-bold text-green-600">{selected.aliados}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-2">Opositores</span>
                  <span className="font-bold text-red-600">{selected.opositores}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-2">Neutros</span>
                  <span className="font-bold text-text-3">{selected.neutros}</span>
                </div>
                <div className="w-full bg-bg-app rounded-full h-2 mt-3">
                  <div className="bg-accent rounded-full h-2" style={{ width: `${(selected.count / totalContactos) * 100}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-3">Selecciona un municipio para ver su detalle.</p>
          )}
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-navy">Municipios destacados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-app border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-text-3">Municipio</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-text-3">Región</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase text-text-3">Total</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase text-text-3">Aliados</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase text-text-3">Opositores</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase text-text-3">Neutros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {municipios.map((municipio) => (
                <tr
                  key={municipio.name}
                  onClick={() => setSelectedMunicipio(municipio.name)}
                  className={`cursor-pointer hover:bg-bg-app transition ${selectedMunicipio === municipio.name ? 'bg-bg-app' : ''}`}
                >
                  <td className="px-6 py-3 font-medium text-navy">{municipio.name}</td>
                  <td className="px-6 py-3 text-sm text-text-2">{municipio.region}</td>
                  <td className="px-6 py-3 text-center font-bold text-navy">{municipio.count}</td>
                  <td className="px-6 py-3 text-center text-sm text-green-600">{municipio.aliados}</td>
                  <td className="px-6 py-3 text-center text-sm text-red-600">{municipio.opositores}</td>
                  <td className="px-6 py-3 text-center text-sm text-text-3">{municipio.neutros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
