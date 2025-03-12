// src/components/RadialMenu/MacroSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { colombiaRegions, type MacroRegion } from '../../data/regions';
import { MENU_CONFIG } from './config';
import {
  createArcPath,
  createTextArcPath,
  createGradientId,
} from './helpers';

interface MacroSectionProps {
  selectedMacro: MacroRegion | null;
  hoveredItem: string | null;
  highlightSection?: string;
  onHover: (id: string | null) => void;
  onSelect: (type: 'macro', id: string) => void;
}

const MacroSection: React.FC<MacroSectionProps> = ({
  selectedMacro,
  hoveredItem,
  highlightSection,
  onHover,
  onSelect
}) => {
  const regionEntries = Object.entries(colombiaRegions);
  const itemCount = regionEntries.length;
  const anglePerItem = 360 / itemCount;
  const isHighlighted = highlightSection === 'macro';

  // Detectar si estamos en móvil
  const isMobile = window.innerWidth <= 768;
  
  // Usar dimensiones para móvil o desktop según corresponda
  const dimensions = isMobile 
    ? MENU_CONFIG.dimensions.mobile 
    : MENU_CONFIG.dimensions;
    
  const { outer, inner } = dimensions.rings.macro;
  const center = dimensions.viewBox.center;
  // Radio donde va el texto (a la mitad del anillo)
  const textRadius = (outer + inner) / 2;

  return (
    <>
      {regionEntries.map(([id, region], index) => {
        const startAngle = index * anglePerItem;
        const endAngle = startAngle + anglePerItem;
        const isHovered = hoveredItem === `macro-${id}`;
        const isSelected = selectedMacro === (id as MacroRegion);
        // Cuando hay una selección, solo la región seleccionada está activa
        // De lo contrario, todas están activas
        const isActive = !selectedMacro || isSelected;
        
        // Obtener colores específicos para cada región
        const colors = MENU_CONFIG.colors.macro[id as MacroRegion];
        
        // ID único para el path del texto
        const textArcId = `macro-textarc-${id}`;

        return (
          <motion.g
            key={`macro-${id}`}
            className="macro-section"
            onMouseEnter={() => onHover(`macro-${id}`)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect('macro', id)}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              opacity: isActive ? 1 : 0.2,
              scale: isHighlighted || isSelected ? 1.05 : 1,
              filter: isActive ? 'brightness(1)' : 'brightness(0.6)'
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            {/* Arco coloreado con efecto de pulso */}
            <motion.path
              d={createArcPath(startAngle, endAngle, outer, inner, center, center)}
              fill={`url(#${createGradientId('macro', id)})`}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={0.5}
              animate={{
                fill: isHighlighted ? 
                  [
                    `url(#${createGradientId('macro', id)})`, 
                    colors.pulse, 
                    `url(#${createGradientId('macro', id)})`
                  ] : 
                  `url(#${createGradientId('macro', id)})`,
                filter: isHovered || isSelected ? 'brightness(1.3)' : 
                       isHighlighted ? 'brightness(1.2)' : 'brightness(1)'
              }}
              transition={{
                fill: isHighlighted ? { 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                } : { duration: 0.3 },
                filter: { duration: 0.3 }
              }}
              className="transition-all duration-300 ease-out"
            />

            {/* Definición del arco para texto curvo */}
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
              fontSize={isMobile ? "6" : "9"}
              fontWeight={isMobile ? "500" : "600"}
              letterSpacing={isMobile ? "0.5" : "1"}
              className="uppercase"
            >
              <textPath
                href={`#${textArcId}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {region.name}
              </textPath>
            </text>
          </motion.g>
        );
      })}
    </>
  );
};

export default MacroSection;