'use client';

import mapData from '../data/bolivia-map.json';

interface BoliviaMapProps {
  counts?: Record<string, number>;
  selectedDepartment?: string;
  onSelectDepartment: (dept: string) => void;
}

const COLOR_TIERS = [
  { minimo: 0.75, relleno: '#E0357A', tinta: '#FFFFFF' },
  { minimo: 0.5, relleno: '#E85C63', tinta: '#FFFFFF' },
  { minimo: 0.3, relleno: '#FF7A3D', tinta: '#1E1037' },
  { minimo: 0.15, relleno: '#FF9C38', tinta: '#1E1037' },
  { minimo: 0.001, relleno: '#FFB627', tinta: '#1E1037' },
];

function getDepartmentColor(count: number, maxCount: number) {
  if (!count) {
    return { relleno: '#FFF6DE', tinta: '#7E5200' };
  }
  const ratio = maxCount ? count / maxCount : 0;
  let chosen = COLOR_TIERS[COLOR_TIERS.length - 1];
  for (const tier of COLOR_TIERS) {
    if (ratio >= tier.minimo) {
      chosen = tier;
      break;
    }
  }
  return { relleno: chosen.relleno, tinta: chosen.tinta };
}

export function BoliviaMap({
  counts = {},
  selectedDepartment,
  onSelectDepartment,
}: BoliviaMapProps) {
  const { gk, dk, mk } = mapData;
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${dk} ${mk}`}
        className="h-auto w-full select-none"
        role="img"
        aria-label="Mapa de Bolivia con la cantidad de preguntas por departamento"
      >
        {/* Department Paths matching base44 yk exact */}
        {gk.map((dept) => {
          const count = counts[dept.nombre] || 0;
          const { relleno } = getDepartmentColor(count, maxCount);
          const isSelected = selectedDepartment === dept.nombre;

          return (
            <path
              key={dept.nombre}
              d={dept.d}
              fill={relleno}
              stroke={isSelected ? '#4a1fa8' : '#ffffff'}
              strokeWidth={isSelected ? 2.6 : 1.2}
              className="cursor-pointer transition-all duration-300 hover:opacity-85 focus:outline-none"
              onClick={() => onSelectDepartment(dept.nombre)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDepartment(dept.nombre);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={`${dept.nombre}: ${count} preguntas`}
            >
              <title>{`${dept.nombre}: ${count} preguntas`}</title>
            </path>
          );
        })}

        {/* Department Labels matching base44 yk exact */}
        {gk.map((dept) => {
          const count = counts[dept.nombre] || 0;
          const { tinta } = getDepartmentColor(count, maxCount);
          const isWhite = tinta === '#ffffff';

          return (
            <text
              key={`${dept.nombre}-etiqueta`}
              x={dept.cx}
              y={dept.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8.5"
              fontWeight="700"
              fill={tinta}
              stroke={isWhite ? 'none' : '#ffffff'}
              strokeWidth={isWhite ? 0 : 2.6}
              paintOrder="stroke"
              className="pointer-events-none select-none font-heading"
            >
              {dept.nombre}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
