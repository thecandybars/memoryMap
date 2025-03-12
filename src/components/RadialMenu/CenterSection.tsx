// src/components/RadialMenu/CenterSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MENU_CONFIG } from './config';

interface CenterSectionProps {
  highlightSection?: string;
  onClick: () => void;
  isDemoMode?: boolean;
}

const CenterSection: React.FC<CenterSectionProps> = ({
  highlightSection,
  onClick,
  isDemoMode = false
}) => {
  // Detectar si estamos en móvil
  const isMobile = window.innerWidth <= 768;
  
  // Usar dimensiones para móvil o desktop según corresponda
  const dimensions = isMobile 
    ? MENU_CONFIG.dimensions.mobile 
    : MENU_CONFIG.dimensions;
    
  const { center } = dimensions.viewBox;
  const rCenter = dimensions.rings.center;
  const isHighlighted = highlightSection === 'center';
  
  // Función para contraer/expandir el menú o iniciar el tour
  const handleCenterClick = () => {
    console.log(`Botón central - Modo demo: ${isDemoMode}`);
    
    // En modo demo, siempre iniciar el tour
    if (isDemoMode) {
      console.log("Iniciando tour (modo demo)");
      onClick();
      return;
    }
    
    // --- MODO NO DEMO - Lógica para contraer/expandir el menú ---
    
    // Estado actual del menú
    let menuIsExpanded = false;
    
    // Intentamos determinar si el menú está expandido 
    // verificando si hay secciones macro visibles
    const macroSections = document.querySelectorAll('.macro-section');
    if (macroSections.length > 0) {
      const firstSection = macroSections[0] as HTMLElement;
      const opacityStyle = window.getComputedStyle(firstSection).opacity;
      menuIsExpanded = opacityStyle !== '0';
    }
    
    console.log(`Estado actual del menú: ${menuIsExpanded ? 'EXPANDIDO' : 'CONTRAÍDO'}`);
    
    // 1. CONTRAER: Si el menú está expandido, lo contraemos
    if (menuIsExpanded) {
      console.log("Contrayendo menú radial...");
      
      // Ocultar todas las secciones externas
      document.querySelectorAll('.macro-section').forEach(el => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.pointerEvents = 'none';
      });
      
      document.querySelectorAll('.dept-section').forEach(el => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.pointerEvents = 'none';
      });
      
      document.querySelectorAll('.memory-section').forEach(el => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.pointerEvents = 'none';
      });
      
      // Reducir el tamaño del círculo principal
      const mainCircle = document.querySelector('#radial-menu circle');
      if (mainCircle) {
        (mainCircle as SVGCircleElement).setAttribute('r', String(rCenter + 10));
      }
      
      // Si hay función para resetear vista, la invocamos
      if (onResetView) {
        console.log("Invocando resetView()...");
        onResetView();
      }
    }
    // 2. EXPANDIR: Si el menú está contraído, lo expandimos
    else {
      console.log("Expandiendo menú radial...");
      
      // Mostrar secciones macro
      document.querySelectorAll('.macro-section').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.pointerEvents = 'auto';
      });
      
      // Expandir el círculo principal
      const mainCircle = document.querySelector('#radial-menu circle');
      if (mainCircle) {
        const macroRadius = isMobile
          ? MENU_CONFIG.dimensions.mobile.rings.macro.outer + 15
          : MENU_CONFIG.dimensions.rings.macro.outer + 15;
        (mainCircle as SVGCircleElement).setAttribute('r', String(macroRadius));
      }
    }
  };

  return (
    <motion.g
      onClick={() => {
        console.log("Botón centro - clic detectado");
        handleCenterClick(); // Llamar a nuestra función personalizada
      }}
      style={{ 
        cursor: 'pointer',
        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))', // Añade un halo dorado sutil
        transformOrigin: `${center}px ${center}px` // Establecer punto de transformación en el centro 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Círculo central */}
      <circle
        cx={center}
        cy={center}
        r={rCenter}
        fill="url(#centerGradient)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={isHighlighted ? 2 : 1}
        className={`
          transition-all duration-300 ease-out
          ${isHighlighted ? 'filter drop-shadow(0 0 6px rgba(255,255,255,0.3))' : ''}
        `}
      />
      
      {/* Círculo interior decorativo */}
      <circle
        cx={center}
        cy={center}
        r={rCenter - 10}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1}
      />

      {/* Texto central */}
      <text
        x={center}
        y={center - (isMobile ? 10 : 12)}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={isMobile ? "12" : "14"}
        fontWeight="500"
        letterSpacing="1"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}
      >
        LUGARES
      </text>
      <text
        x={center}
        y={center + (isMobile ? 2 : 3)}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={isMobile ? "12" : "14"}
        fontWeight="500"
        letterSpacing="1"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}
      >
        DE
      </text>
      <text
        x={center}
        y={center + (isMobile ? 14 : 18)}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={isMobile ? "12" : "14"}
        fontWeight="500"
        letterSpacing="1"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}
      >
        MEMORIA
      </text>
      
      {/* Eliminamos el botón extra de ir al mapa */}
    </motion.g>
  );
};

export default CenterSection;