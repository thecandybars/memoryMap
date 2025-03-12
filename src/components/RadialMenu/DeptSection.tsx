// src/components/RadialMenu/DeptSection.tsx

import React from 'react';
import { colombiaRegions, type MacroRegion } from '../../data/regions';
import { MENU_CONFIG } from './config';
import {
  createArcPath,
  createTextArcPath,
} from './helpers';

// Función para generar colores para los departamentos basados en la macroregión
const getDeptColor = (macroRegion: MacroRegion, index: number, totalDepts: number): string => {
  // Obtener los colores base de la macroregión
  const regionColors = MENU_CONFIG.colors.macro[macroRegion];
  
  // Convertir colores hexadecimales a RGB
  const startColor = hexToRgb(regionColors.gradientStart);
  const endColor = hexToRgb(regionColors.gradientEnd);
  
  if (!startColor || !endColor) {
    return "255, 255, 255, 0.08"; // Color por defecto si hay error
  }
  
  // Calcular color para este departamento específico
  const ratio = index / (totalDepts - 1);
  const r = Math.round(startColor.r * (1 - ratio) + endColor.r * ratio);
  const g = Math.round(startColor.g * (1 - ratio) + endColor.g * ratio);
  const b = Math.round(startColor.b * (1 - ratio) + endColor.b * ratio);
  
  // Añadir variación aleatoria pero consistente para cada departamento
  const seed = index * 10;
  const variation = 15; // Cantidad de variación de color
  const vr = ((seed * 13) % variation) - variation/2;
  const vg = ((seed * 17) % variation) - variation/2;
  const vb = ((seed * 23) % variation) - variation/2;
  
  const finalR = Math.max(0, Math.min(255, r + vr));
  const finalG = Math.max(0, Math.min(255, g + vg));
  const finalB = Math.max(0, Math.min(255, b + vb));
  
  // Retornar color con opacidad para efecto de transparencia
  return `${finalR}, ${finalG}, ${finalB}, 0.4`;
};

// Función auxiliar para convertir hex a RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

interface DeptSectionProps {
  selectedMacro: MacroRegion | null;
  hoveredItem: string | null;
  highlightSection?: string;
  onHover: (id: string | null) => void;
  onSelect: (type: 'department', id: string) => void;
}

const DeptSection: React.FC<DeptSectionProps> = ({
  selectedMacro,
  hoveredItem,
  highlightSection,
  onHover,
  onSelect
}) => {
  if (!selectedMacro) return null;

  // Detectar si estamos en móvil
  const isMobile = window.innerWidth <= 768;
  
  // Usar dimensiones para móvil o desktop según corresponda
  const dimensions = isMobile 
    ? MENU_CONFIG.dimensions.mobile 
    : MENU_CONFIG.dimensions;
    
  const { outer, inner } = dimensions.rings.department;
  const center = dimensions.viewBox.center;
  const textRadius = (outer + inner) / 2;

  const departments = colombiaRegions[selectedMacro].departments;
  const itemCount = departments.length;
  const anglePerItem = 360 / itemCount;
  const isHighlighted = highlightSection === 'department';

  return (
    <>
      {departments.map((dept, index) => {
        const startAngle = index * anglePerItem;
        const endAngle = startAngle + anglePerItem;
        const isHovered = hoveredItem === `dept-${dept.id}`;

        // ID único para la trayectoria del texto
        const textArcId = `dept-textarc-${dept.id}`;

        return (
          <g
            key={`dept-${dept.id}`}
            className="dept-section transition-transform duration-300 hover:scale-[1.02]"
            onMouseEnter={() => onHover(`dept-${dept.id}`)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect('department', dept.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Arco para el departamento con color basado en la macroregión */}
            <path
              d={createArcPath(startAngle, endAngle, outer, inner, center, center)}
              fill={`rgba(${getDeptColor(selectedMacro, index, itemCount)})`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={0.5}
              className={`
                transition-all duration-300 ease-out
                ${isHovered || isHighlighted ? 'filter brightness-150' : ''}
              `}
            />

            {/* Definición de la trayectoria para texto */}
            <defs>
              <path
                id={textArcId}
                fill="none"
                stroke="none"
                d={createTextArcPath(
                  startAngle,
                  endAngle,
                  textRadius,
                  center,
                  center
                )}
              />
            </defs>

            {/* Texto curvo */}
            <text
              fill="white"
              fontSize={isMobile ? "5" : "8"}
              fontWeight="400" 
              opacity={isMobile ? "0.95" : "0.9"}
            >
              <textPath
                href={`#${textArcId}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {dept.name}
              </textPath>
            </text>
          </g>
        );
      })}
    </>
  );
};

export default DeptSection;