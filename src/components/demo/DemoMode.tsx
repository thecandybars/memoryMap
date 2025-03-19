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
  
  useEffect(() => {
    if (mapRef?.current && mapLoadedRef?.current) {
      console.log("Iniciando secuencia de visualización para Colombia");
      
      loadRegionsGeoJSON(mapRef, mapLoadedRef);
      
      try {
        if (mapRef.current.getLayer('regiones-fill')) {
          mapRef.current.setPaintProperty('regiones-fill', 'fill-color', [
            'match',
            ['get', 'name'],
            'pacifico', '#57CACC',
            'amazonia', '#6BD88B',
            'andina', '#D4A76A',
            'caribe', '#F9B45C',
            'orinoquia', '#D76D6D',
            'rgba(255, 255, 255, 0.2)'
          ]);
        }
      } catch (error) {
        console.warn("Error al configurar colores de regiones:", error);
      }
      
      mapRef.current.flyTo({
        center: [-73.5, 4.5],
        zoom: 4.8,
        pitch: 0,
        bearing: 0,
        duration: 2000
      });
      
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

  const handleMenuSelect = (type: string, id: string) => {
    console.log(`Selección: ${type} - ${id}`);
    
    if (type === 'macro' && id !== 'center') {
      if (mapRef?.current && mapLoadedRef?.current) {
        highlightRegion(mapRef, getRegionNameForGeoJSON(id));
        
        if (selectedMacro === id) {
          setSelectedMacro(null);
          mapRef.current.flyTo({
            center: [-73.5, 4.5],
            zoom: 5.2,
            pitch: 45,
            bearing: 10,
            duration: 2000
          });
        } else {
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
      onStartTour();
    }
    
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

  const goToMap = () => {
    console.log("IR AL MAPA: Función ejecutada");
    
    try {
      setSelectedMacro(null);
      
      if (mapRef?.current && mapLoadedRef?.current) {
        highlightRegion(mapRef, null);
        mapRef.current.flyTo({
          center: [-73.5, 4.5],
          zoom: 5.2,
          pitch: 0,
          bearing: 0,
          duration: 1000
        });
      }
      
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
      
      setTimeout(() => {
        transitionOverlay.style.opacity = '1';
      }, 10);
      
      DemoStateManager.markDemoAsComplete();
      
      if (typeof onDemoComplete === 'function') {
        setTimeout(() => {
          console.log("Ejecutando onDemoComplete");
          onDemoComplete();
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
    <div className="fixed inset-0" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(3px)',
      zIndex: 9000
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <RadialMenu 
          onSelect={handleMenuSelect}
          onStartTour={onStartTour}
          isDemoMode={true}
          highlightSection={currentSection}
          selectedMacro={selectedMacro}
        />
      </div>
      
      <motion.div 
        style={{ 
          position: 'absolute',
          top: 'calc(50% - 60px)', 
          transform: 'translateY(-50%)' 
        }}
        initial={{ x: 'calc(50% - 200px)' }}
        animate={{ 
          // Mover de forma paralela según la sección activa
          x: currentSection === 'macro' ? 'calc(50% - 200px)' : 
             currentSection === 'department' ? 'calc(50% - 205px)' : 
             currentSection === 'memory' ? 'calc(50% - 210px)' : 
             'calc(50% - 200px)'
        }}
        transition={{ 
          duration: 0.5, 
          type: 'spring', 
          stiffness: 120, 
          damping: 14 
        }}
      >
        <DemoGuide 
          currentSection={currentSection}
          currentStep={currentStep}
          onSkipDemo={goToMap}
        />
      </motion.div>
      
      {/* Elementos de navegación inferior */}
      <div className="fixed bottom-8 z-50 w-full flex justify-between">
        {/* Texto informativo centrado con el menú radial */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="px-6 py-2 rounded-full bg-black/20 backdrop-blur-sm
                shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/5"
          >
            <p className="text-white/90 font-medium text-sm">
              Explora los lugares de memoria en cuatro pasos
            </p>
          </motion.div>
        </div>

        {/* Botón flotante para ir al mapa (a la derecha) */}
        <div className="ml-auto mr-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button 
              onClick={goToMap}
              className="px-6 py-3 rounded-full bg-black/25 backdrop-blur-md
                  hover:bg-black/35
                  shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center gap-3 group transition-all duration-300 
                  border border-white/5"
            >
              <span className="text-white font-medium">Ir al mapa</span>
              <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DemoMode;