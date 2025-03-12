// src/components/demo/DemoMode.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import RadialMenu from '../RadialMenu';
import DemoGuide from './DemoGuide';
import { DemoStateManager } from '../../utils/demoState';
import { loadRegionsGeoJSON, highlightRegion, getRegionNameForGeoJSON } from '../../utils/regionLoader';
import { colombiaRegions } from '../../data/regions';
import { MapboxMap } from '../../types';
import { motion } from 'framer-motion';

interface DemoModeProps {
  onDemoComplete?: () => void;
  onStartTour?: () => void;
  mapRef?: React.MutableRefObject<MapboxMap | null>;
  mapLoadedRef?: React.MutableRefObject<boolean>;
}

const DemoMode: React.FC<DemoModeProps> = ({ onDemoComplete, onStartTour, mapRef, mapLoadedRef }) => {
  const [currentSection, setCurrentSection] = useState<'macro' | 'department' | 'memory' | 'center'>('macro');
  const [selectedMacro, setSelectedMacro] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Efecto para inicializar y cargar el mapa con una vista cinematográfica
  useEffect(() => {
    if (mapRef?.current && mapLoadedRef?.current) {
      console.log("Iniciando secuencia de visualización para Colombia");
      
      // Cargar las regiones con todas sus macroregiones
      loadRegionsGeoJSON(mapRef, mapLoadedRef);
      
      try {
        // Asegurarnos que la capa de regiones tenga la propiedad de color correcta
        // Esto garantiza que todas las macroregiones tengan sus colores correspondientes
        if (mapRef.current.getLayer('regiones-fill')) {
          mapRef.current.setPaintProperty('regiones-fill', 'fill-color', [
            'match',
            ['get', 'name'],
            'pacifico', '#57CACC',
            'amazonia', '#6BD88B',
            'andina', '#D4A76A',
            'caribe', '#F9B45C',
            'orinoquia', '#D76D6D',
            'rgba(255, 255, 255, 0.2)' // color por defecto
          ]);
        }
      } catch (error) {
        console.warn("Error al configurar colores de regiones:", error);
      }
      
      // Secuencia de visualización cinematográfica
      // Primero, vista amplia desde arriba
      mapRef.current.flyTo({
        center: [-73.5, 4.5],
        zoom: 4.8,
        pitch: 0,
        bearing: 0,
        duration: 2000
      });
      
      // Después de un breve momento, inclinar la cámara para una vista más interesante
      setTimeout(() => {
        if (mapRef?.current) {
          mapRef.current.flyTo({
            center: [-73.5, 4.5],
            zoom: 5.2,
            pitch: 45,
            bearing: 10,
            duration: 3000
          });
        }
      }, 2500);
    }
  }, [mapRef, mapLoadedRef]);

  // Función para manejar selecciones en el menú radial
  const handleMenuSelect = (type: string, id: string) => {
    console.log(`Selección: ${type} - ${id}`);
    
    if (type === 'macro' && id !== 'center') {
      if (mapRef?.current && mapLoadedRef?.current) {
        highlightRegion(mapRef, getRegionNameForGeoJSON(id));
        
        if (selectedMacro === id) {
          // Si ya está seleccionada, deseleccionar
          setSelectedMacro(null);
          mapRef.current.flyTo({
            center: [-73.5, 4.5],
            zoom: 5.2,
            pitch: 45,
            bearing: 10,
            duration: 2000
          });
        } else {
          // Seleccionar nueva región
          setSelectedMacro(id);
          const region = colombiaRegions[id];
          if (region && region.center) {
            mapRef.current.flyTo({
              center: region.center,
              zoom: 6.5,
              pitch: 50,
              bearing: 15,
              duration: 2000
            });
          }
        }
      }
    } else if (id === 'center' && onStartTour) {
      // Iniciar el tour guiado
      onStartTour();
    }
    
    // Actualizar la sección actual y el paso del tutorial
    switch (type) {
      case 'macro':
        setCurrentSection('department');
        setCurrentStep(2);
        break;
      case 'department':
        setCurrentSection('memory');
        setCurrentStep(3);
        break;
      case 'memory':
        setCurrentSection('center');
        setCurrentStep(4);
        break;
    }
  };

  // Función para ir directamente al mapa principal
  const goToMap = () => {
    console.log("IR AL MAPA: Función ejecutada");
    
    try {
      // Primero, limpiar cualquier región seleccionada y resetear el estado local
      setSelectedMacro(null);
      
      // Resetear el resaltado de regiones directamente aquí
      if (mapRef?.current && mapLoadedRef?.current) {
        // Quitar resaltado de la región actual
        highlightRegion(mapRef, null);
        
        // Restablecer la vista del mapa
        mapRef.current.flyTo({
          center: [-73.5, 4.5],
          zoom: 5.2,
          pitch: 0,
          bearing: 0,
          duration: 1000
        });
      }
      
      // Mostrar animación de transición
      const transitionOverlay = document.createElement('div');
      transitionOverlay.id = 'map-transition-overlay';
      transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.7);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.5s ease;
      `;
      
      const loadingText = document.createElement('div');
      loadingText.style.cssText = `
        color: white;
        font-size: 18px;
        background-color: rgba(0,0,0,0.8);
        padding: 16px 32px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
      `;
      loadingText.textContent = 'Preparando mapa interactivo...';
      
      transitionOverlay.appendChild(loadingText);
      document.body.appendChild(transitionOverlay);
      
      // Hacer visible el overlay con transición
      setTimeout(() => {
        transitionOverlay.style.opacity = '1';
      }, 10);
      
      // Marcar demo como completado
      DemoStateManager.markDemoAsComplete();
      
      // Verificar que onDemoComplete exista y sea una función
      if (typeof onDemoComplete === 'function') {
        // Esperar un momento antes de ejecutar la transición
        setTimeout(() => {
          console.log("Ejecutando onDemoComplete");
          onDemoComplete();
          
          // Eliminar el overlay después de la transición
          setTimeout(() => {
            if (transitionOverlay) {
              transitionOverlay.style.opacity = '0';
              setTimeout(() => transitionOverlay.remove(), 500);
            }
          }, 500);
        }, 1000);
      } else {
        console.error("ERROR: onDemoComplete no es una función");
        alert("Error al ir al mapa. Por favor, recarga la página.");
      }
    } catch (error) {
      console.error("Error al ir al mapa:", error);
      alert("Error al ir al mapa. Por favor, recarga la página.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Fondo semitransparente con blur para el modo demo */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Guía del Demo - Usando el nuevo componente DemoGuide */}
      <DemoGuide 
        currentSection={currentSection}
        currentStep={currentStep}
        onSkipDemo={goToMap}
      />
      
      
      {/* Contenedor principal con menú radial absolutamente centrado */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateX(-420px) translateY(-80px)' }}>
        <div style={{ width: '600px', height: '600px' }}>
          <RadialMenu 
            onSelect={handleMenuSelect}
            onStartTour={onStartTour}
            isDemoMode={true}
            highlightSection={currentSection}
            selectedMacro={selectedMacro}
          />
        </div>
      </div>
      
      {/* Botón flotante moderno - ahora en la esquina inferior derecha */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-8 right-6 z-50"
      >
        <button 
          onClick={goToMap}
          className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-md
              hover:bg-black/50
              shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center gap-3 group transition-all duration-300 
              border border-white/10"
        >
          <span className="text-white font-medium">Ir al mapa</span>
          <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
      
    </div>
  );
};

export default DemoMode;