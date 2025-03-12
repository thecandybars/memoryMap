// src/components/MobileMenu.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Menu, X, Map, ChevronDown, Layers, Navigation, Target, Compass } from 'lucide-react';
import { colombiaRegions, memoryTypes, type MacroRegion } from '../data/regions';

interface MobileMenuProps {
  onSelect: (type: 'macro' | 'department' | 'memory', id: string) => void;
  selectedMacro: MacroRegion | null;
  selectedDepartment: string | null;
  selectedMemoryType: string | null;
  onStartTour?: () => void;
  onResetView?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  onSelect,
  selectedMacro,
  selectedDepartment,
  selectedMemoryType,
  onStartTour,
  onResetView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Función para manejar la selección
  const handleSelection = (type: 'macro' | 'department' | 'memory', id: string) => {
    onSelect(type, id);
    
    // En móvil, cerrar el menú después de una selección
    // Pero sólo si seleccionamos un departamento o tipo de memoria
    if (type !== 'macro') {
      setTimeout(() => setIsOpen(false), 300);
    }
  };
  
  // Efecto para cerrar el menú con un swipe
  useEffect(() => {
    let startY = 0;
    let isDragging = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!isOpen) return;
      const menuElement = document.getElementById('mobile-menu-container');
      if (!menuElement || !e.target || !menuElement.contains(e.target as Node)) return;
      
      startY = e.touches[0].clientY;
      isDragging = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isOpen || !isDragging) return;
      
      const currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      
      // Si hay un swipe hacia abajo de más de 50px, cerrar el menú
      if (diffY > 50) {
        setIsOpen(false);
        isDragging = false;
      }
    };
    
    const handleTouchEnd = () => {
      isDragging = false;
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen]);
  
  // Generar opciones para las macrorregiones
  const macroOptions = Object.entries(colombiaRegions).map(([id, region]) => (
    <button
      key={`macro-${id}`}
      className={`mobile-menu-option ${selectedMacro === id ? 'active' : ''}`}
      onClick={() => handleSelection('macro', id)}
      style={{
        backgroundColor: selectedMacro === id 
          ? `${region.color}40` 
          : 'rgba(255, 255, 255, 0.1)',
        borderColor: selectedMacro === id 
          ? `${region.color}` 
          : 'rgba(255, 255, 255, 0.2)'
      }}
    >
      {region.name}
    </button>
  ));
  
  // Generar opciones para departamentos (sólo si hay una macrorregión seleccionada)
  const departmentOptions = selectedMacro 
    ? colombiaRegions[selectedMacro].departments.map(dept => (
        <button
          key={`dept-${dept.id}`}
          className={`mobile-menu-option ${selectedDepartment === dept.id ? 'active' : ''}`}
          onClick={() => handleSelection('department', dept.id)}
        >
          {dept.name}
        </button>
      ))
    : null;
  
  // Generar opciones para tipos de memoria
  const memoryTypeOptions = Object.entries(memoryTypes).map(([id, type]) => (
    <button
      key={`memory-${id}`}
      className={`mobile-menu-option ${selectedMemoryType === id ? 'active' : ''}`}
      onClick={() => handleSelection('memory', id)}
      style={{
        backgroundColor: selectedMemoryType === id 
          ? `${type.color}40` 
          : 'rgba(255, 255, 255, 0.1)',
        borderColor: selectedMemoryType === id 
          ? `${type.color}` 
          : 'rgba(255, 255, 255, 0.2)'
      }}
    >
      {type.name}
    </button>
  ));
  
  // Referencia al contenedor del menú móvil independiente
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Mostrar/ocultar menú móvil independiente
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isOpen) {
        mobileMenuRef.current.style.bottom = '0';
      } else {
        mobileMenuRef.current.style.bottom = '-90vh';
      }
    }
  }, [isOpen]);
  
  return (
    <>
      {/* Botón flotante para abrir/cerrar el menú */}
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
      </button>
      
      {/* Menú móvil completamente independiente */}
      <div 
        ref={mobileMenuRef}
        className="mobile-menu-panel" 
        id="mobile-menu-panel"
      >
        {/* Barra superior para arrastrar */}
        <div className="mobile-menu-handle"></div>
        
        {/* Sección de acciones principales */}
        <div className="mobile-menu-section">
          <div className="flex items-center justify-between">
            <h3>Acciones</h3>
            <button 
              onClick={() => {
                if (onResetView) {
                  onResetView();
                  setIsOpen(false);
                }
              }}
              className="text-xs text-white/70 flex items-center gap-1"
            >
              <Map size={12} /> Resetear vista
            </button>
          </div>
          <div className="mobile-menu-options">
            {onStartTour && (
              <button 
                className="mobile-menu-option" 
                onClick={() => {
                  if (onStartTour) {
                    onStartTour();
                    setIsOpen(false);
                  }
                }}
                style={{
                  backgroundColor: 'rgba(147, 51, 234, 0.3)',
                  borderColor: 'rgba(147, 51, 234, 0.5)'
                }}
              >
                Iniciar tour guiado
              </button>
            )}
          </div>
        </div>
        
        {/* Sección de Macrorregiones */}
        <div className="mobile-menu-section">
          <h3>Macrorregiones</h3>
          <div className="mobile-menu-options">
            {macroOptions}
          </div>
        </div>
        
        {/* Sección de Departamentos (condicional) */}
        {selectedMacro && (
          <div className="mobile-menu-section">
            <h3>Departamentos</h3>
            <div className="mobile-menu-options">
              {departmentOptions}
            </div>
          </div>
        )}
        
        {/* Sección de Tipos de Memoria */}
        <div className="mobile-menu-section">
          <h3>Tipos de lugares</h3>
          <div className="mobile-menu-options">
            {memoryTypeOptions}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;