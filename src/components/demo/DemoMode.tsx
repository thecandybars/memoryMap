// src/components/demo/DemoMode.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import RadialMenu from '../RadialMenu';
import DemoGuide from './DemoGuide';
import { DemoStateManager } from '../../utils/demoState';
import { loadRegionsGeoJSON, highlightRegion, getRegionNameForGeoJSON, resetRegionHighlighting } from '../../utils/regionLoader';
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
  
  // Cargar regiones y configurar el mapa
  useEffect(() => {
    if (mapRef?.current && mapLoadedRef?.current) {
      console.log("Iniciando secuencia de visualización para Colombia");
      
      // Cargar regiones y asegurarnos que todas son visibles
      loadRegionsGeoJSON(mapRef, mapLoadedRef);
      
      // Esperar a que las regiones se carguen y luego hacerlas visibles
      setTimeout(() => {
        try {
          if (mapRef.current && mapRef.current.getLayer('regiones-fill')) {
            // Configurar colores de las regiones
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
            
            // Asegurar que todas las regiones son visibles
            mapRef.current.setFilter('regiones-fill', null);
            mapRef.current.setFilter('regiones-boundary', null);
            
            // Mantener configuración por defecto con transparencia al zoom
            resetRegionHighlighting(mapRef);
            
            // IMPORTANTE: Agregar manejador de eventos para zoom
            // Este manejador se encargará de ajustar la transparencia en tiempo real
            console.log("Agregando manejador de eventos de zoom para transparencia");
            
            // Remover cualquier handler previo para evitar duplicados
            mapRef.current.off('zoom', handleMapZoom);
            
            // Agregar el nuevo manejador
            mapRef.current.on('zoom', handleMapZoom);
          }
        } catch (error) {
          console.warn("Error al configurar colores de regiones:", error);
        }
      }, 500);
      
      // Configurar vista inicial
      mapRef.current.flyTo({
        center: [-73.5, 4.5],
        zoom: 4.8,
        pitch: 0,
        bearing: 0,
        duration: 2000
      });
      
      // Luego ajustar a una vista más detallada
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
    
    // Función para manejar el evento de zoom
    function handleMapZoom() {
      if (!mapRef?.current || !mapRef.current.getLayer('regiones-fill')) return;
      
      // Obtener el nivel de zoom actual
      const currentZoom = mapRef.current.getZoom();
      console.log(`Zoom actual: ${currentZoom}`);
      
      // Calcular opacidad basada en el zoom (más zoom = menos opacidad)
      let fillOpacity, lineOpacity;
      
      if (currentZoom <= 6) {
        fillOpacity = 0.4;
        lineOpacity = 0.7;
      } else if (currentZoom >= 10) {
        fillOpacity = 0.05;
        lineOpacity = 0.15;
      } else {
        // Interpolación lineal entre zoom 6 y 10
        const t = (currentZoom - 6) / (10 - 6);
        fillOpacity = 0.4 - (t * 0.35);
        lineOpacity = 0.7 - (t * 0.55);
      }
      
      // Aplicar las opacidades calculadas
      mapRef.current.setPaintProperty('regiones-fill', 'fill-opacity', fillOpacity);
      mapRef.current.setPaintProperty('regiones-boundary', 'line-opacity', lineOpacity);
    }
    
    // Cleanup: remover el manejador cuando el componente se desmonte
    return () => {
      if (mapRef?.current) {
        mapRef.current.off('zoom', handleMapZoom);
      }
    };
  }, [mapRef, mapLoadedRef]);
  
  // Función para mantener la configuración por defecto de las regiones
  // manteniendo la opacidad basada en zoom (que se vuelvan transparentes al acercarse)
  const resetRegionsDefaultSettings = () => {
    if (mapRef?.current && mapRef.current.getLayer('regiones-fill')) {
      console.log("Restableciendo configuración por defecto para las regiones (con transparencia al zoom)");
      
      // Aplicar la configuración original con opacidad basada en zoom
      resetRegionHighlighting(mapRef);
    }
  };
  
  // Manejadores para eventos personalizados
  useEffect(() => {
    const handleLoadAllRegions = () => {
      console.log("DemoMode: Recibido evento loadAllRegions");
      if (mapRef?.current && mapLoadedRef?.current) {
        // Cargar y mostrar todas las regiones (manteniendo la transparencia con el zoom)
        loadRegionsGeoJSON(mapRef, mapLoadedRef);
        resetRegionHighlighting(mapRef);
      }
    };
    
    const handleMemoryTypeSelected = () => {
      console.log("DemoMode: Recibido evento memoryTypeSelected");
      if (mapRef?.current && mapLoadedRef?.current) {
        // Activar todas las macroregiones con transparencia al acercarse
        loadRegionsGeoJSON(mapRef, mapLoadedRef);
        
        // Asegurar que todas las regiones sean visibles con la transparencia por zoom
        setTimeout(() => {
          if (mapRef?.current) {
            // Mostrar todas las regiones
            if (mapRef.current.getLayer('regiones-fill')) {
              // Quitar cualquier filtro previo para mostrar TODAS las regiones
              mapRef.current.setFilter('regiones-fill', null);
              mapRef.current.setFilter('regiones-boundary', null);
              
              // APLICAR DIRECTAMENTE la configuración de transparencia sin llamar a otra función
              console.log("Aplicando transparencia directamente desde evento memoryTypeSelected");
              
              // Opacidad que disminuye con el zoom
              mapRef.current.setPaintProperty('regiones-fill', 'fill-opacity', [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.4,    // Zoom 6 o menos: opacidad 0.4
                9, 0.1,    // Zoom 9: opacidad muy baja
                12, 0.05   // Zoom 12 o más: casi transparente
              ]);
              
              // Opacidad del borde que disminuye con el zoom
              mapRef.current.setPaintProperty('regiones-boundary', 'line-opacity', [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.8,    // Zoom 6 o menos: opacidad 0.8
                9, 0.3,    // Zoom 9: opacidad baja
                12, 0.1    // Zoom 12 o más: casi transparente
              ]);
            }
          }
        }, 500);
      }
    };
    
    // Agregar listeners
    document.addEventListener('loadAllRegions', handleLoadAllRegions);
    document.addEventListener('memoryTypeSelected', handleMemoryTypeSelected);
    
    // Limpiar
    return () => {
      document.removeEventListener('loadAllRegions', handleLoadAllRegions);
      document.removeEventListener('memoryTypeSelected', handleMemoryTypeSelected);
    };
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
        
        // Activar todas las macroregiones con transparencia al acercarse
        if (mapRef?.current && mapLoadedRef?.current) {
          console.log("ACTIVANDO TODAS LAS MACROREGIONES CON TRANSPARENCIA AL ACERCARSE");
          
          // Cargar y mostrar todas las macroregiones
          loadRegionsGeoJSON(mapRef, mapLoadedRef);
          
          // Asegurar que todas las regiones sean visibles con la transparencia por zoom
          setTimeout(() => {
            if (mapRef?.current) {
              // Mostrar todas las regiones
              if (mapRef.current.getLayer('regiones-fill')) {
                // Quitar cualquier filtro previo para mostrar TODAS las regiones
                mapRef.current.setFilter('regiones-fill', null);
                mapRef.current.setFilter('regiones-boundary', null);
                
                console.log("SOLUCIÓN RADICAL: Forzar transparencia a valor fijo y actualizar con listener de zoom");
                
                // Remover listener previo para evitar duplicados
                mapRef.current.off('zoom', handleZoomTransparency);
                
                // Aplicar transparencia inicial basada en el zoom actual
                const currentZoom = mapRef.current.getZoom();
                let initialFillOpacity = 0.4;
                let initialLineOpacity = 0.7;
                
                if (currentZoom > 6) {
                  const t = Math.min(1, (currentZoom - 6) / 4);
                  initialFillOpacity = 0.4 - (t * 0.35);
                  initialLineOpacity = 0.7 - (t * 0.55);
                }
                
                // Aplicar los valores calculados iniciales
                mapRef.current.setPaintProperty('regiones-fill', 'fill-opacity', initialFillOpacity);
                mapRef.current.setPaintProperty('regiones-boundary', 'line-opacity', initialLineOpacity);
                
                // Agregar listener de zoom que mantendrá actualizadas las transparencias
                mapRef.current.on('zoom', handleZoomTransparency);
                
                // Forzar un refresco de la capa para asegurar que la transparencia se aplique
                mapRef.current.triggerRepaint();
              } else {
                console.error("ERROR: No se encontró la capa 'regiones-fill'");
              }
            }
          }, 500);
        }
        break;
        
        // Función interna para manejar transparencia según zoom
        function handleZoomTransparency() {
          if (!mapRef?.current || !mapRef.current.getLayer('regiones-fill')) return;
          
          // Obtener zoom actual
          const zoom = mapRef.current.getZoom();
          console.log(`handleZoomTransparency: Zoom actual = ${zoom}`);
          
          // Calcular opacidades
          let fillOpacity, lineOpacity;
          
          if (zoom <= 6) {
            fillOpacity = 0.4;
            lineOpacity = 0.7;
          } else if (zoom >= 10) {
            fillOpacity = 0.05;
            lineOpacity = 0.15;
          } else {
            // Interpolación lineal
            const t = (zoom - 6) / (10 - 6);
            fillOpacity = 0.4 - (t * 0.35);
            lineOpacity = 0.7 - (t * 0.55);
          }
          
          // Aplicar opacidades calculadas directamente
          mapRef.current.setPaintProperty('regiones-fill', 'fill-opacity', fillOpacity);
          mapRef.current.setPaintProperty('regiones-boundary', 'line-opacity', lineOpacity);
        }
    }
  };

  const goToMap = () => {
    console.log("IR AL MAPA: Función ejecutada");
    
    try {
      setSelectedMacro(null);
      
      if (mapRef?.current && mapLoadedRef?.current) {
        // Cargar y mostrar todas las macroregiones
        console.log("Cargando GeoJSON para mostrar todas las macroregiones");
        loadRegionsGeoJSON(mapRef, mapLoadedRef);
        
        // Reset any highlight but ensure all regions are visible with good opacity
        setTimeout(() => {
          if (mapRef?.current) {
            // Reset los filtros para mostrar todas las regiones
            if (mapRef.current.getLayer('regiones-fill')) {
              mapRef.current.setFilter('regiones-fill', null);
              mapRef.current.setFilter('regiones-boundary', null);
              
              console.log("IR AL MAPA: Aplicando transparencia dinámica basada en eventos de zoom");
              
              // Remover listener previo para evitar duplicados
              mapRef.current.off('zoom', handleGoToMapZoom);
              
              // Aplicar transparencia inicial basada en el zoom actual
              const currentZoom = mapRef.current.getZoom();
              updateOpacityBasedOnZoom(currentZoom);
              
              // Agregar listener de zoom que mantendrá actualizadas las transparencias
              mapRef.current.on('zoom', handleGoToMapZoom);
              
              // Función para manejar cambios de transparencia con el zoom
              function handleGoToMapZoom() {
                const zoom = mapRef.current.getZoom();
                updateOpacityBasedOnZoom(zoom);
              }
              
              // Función auxiliar para actualizar la opacidad según el zoom
              function updateOpacityBasedOnZoom(zoom) {
                let fillOpacity, lineOpacity;
                
                if (zoom <= 6) {
                  fillOpacity = 0.4;
                  lineOpacity = 0.7;
                } else if (zoom >= 10) {
                  fillOpacity = 0.05;
                  lineOpacity = 0.15;
                } else {
                  // Interpolación lineal
                  const t = (zoom - 6) / (10 - 6);
                  fillOpacity = 0.4 - (t * 0.35);
                  lineOpacity = 0.7 - (t * 0.55);
                }
                
                console.log(`Zoom: ${zoom.toFixed(2)}, Opacidad relleno: ${fillOpacity.toFixed(2)}, Opacidad borde: ${lineOpacity.toFixed(2)}`);
                
                mapRef.current.setPaintProperty('regiones-fill', 'fill-opacity', fillOpacity);
                mapRef.current.setPaintProperty('regiones-boundary', 'line-opacity', lineOpacity);
              }
            }
            
            // Mover la vista
            mapRef.current.flyTo({
              center: [-73.5, 4.5],
              zoom: 5.2,
              pitch: 0,
              bearing: 0,
              duration: 1000
            });
          }
        }, 300);
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
    <div id="map-visualizer" className="fixed inset-0" style={{
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
          top: 'calc(50% - 80px)', 
          transform: 'translateY(-50%)' 
        }}
        initial={{ x: 'calc(50% - 40px)' }}
        animate={{ 
          // Mover de forma paralela según la sección activa
          x: currentSection === 'macro' ? 'calc(50% - 40px)' : 
             currentSection === 'department' ? 'calc(50% - 60px)' : 
             currentSection === 'memory' ? 'calc(50% - 80px)' : 
             'calc(50% - 40px)'
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
        {/* Texto informativo eliminado */}

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