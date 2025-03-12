// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { Info, ChevronRight } from 'lucide-react';
import RadialMenuGuide from './components/RadialMenuGuide';
import { TutorialStateManager } from './utils/tutorialState';
import MobileMenu from './components/MobileMenu';

// Componentes
import RadialMenu from './components/RadialMenu';
import Preloader from './components/Preloader';
import DemoMode from './components/demo/DemoMode';
import { LocationInfo } from './components/LocationInfo';
import { TourMessage } from './components/TourMessage';
import { NavBar, SideButtons } from './components/NavComponents';
import LocationContext from './components/LocationContext';
import TourSelector from './components/TourSelector';
import ExilioGlobeView from './components/ExilioGlobeView';
import GuardianesMemoria from './components/GuardianesMemoria';

// Servicios
import { 
  addEnvironmentEffects,
  setupMapLayers,
  updateLayersVisibility,
  animateCamera,
  navigateToRegion,
  navigateToDepartment,
  initializeMap,
  resetMap,
  mapConfig,
  startGuidedTour,
  drawAreaOfInterest,
  hideAreaOfInterest,
  cinematicLocationFocus,
  // Clustering
  setupClusteredMarkers,
  updateVisibleMarkersWithClustering
} from './services/MapService';

// Utilidades y datos
import { DemoStateManager, thematicTours, type TourType } from './utils/demoState';
import { colombiaRegions, memoryTypes, type MacroRegion } from './data/regions';
import { AppState, MemoryLocation } from './types';
import { memoryLocations as demoLocations } from './utils/mapHelpers';
import { 
  loadRegionsGeoJSON,
  highlightRegion,
  getRegionNameForGeoJSON 
} from './utils/regionLoader';
import { loadRealDataFromCSV } from './utils/realData/importData';

mapboxgl.accessToken = 'pk.eyJ1IjoianVhbmVsbzY2Nzk2IiwiYSI6ImNtNzNmZ2pzbTA4bjIyaXEzZ2F3a2dnOHcifQ.Ew2kIfF9F-Q1ltBQ0xOf-g';

/**
 * Componente para agrupar los botones de información en la esquina inferior derecha
 */
const InfoButtons: React.FC<{
  onInfoClick: () => void;
  onToggleLocationInfo: () => void;
  isLocationInfoVisible: boolean;
}> = ({ onInfoClick, onToggleLocationInfo, isLocationInfoVisible }) => {
  return (
    <div className="fixed bottom-8 left-8 z-40 flex flex-col items-end gap-4">
      {/* Grupo de botones de información */}
      <div className="bg-black/50 backdrop-blur-md rounded-full p-1 
                   shadow-lg border border-white/10 flex flex-col items-center gap-1">
        {/* Botón de información de ubicación */}
        <button
          onClick={onToggleLocationInfo}
          className={`p-2.5 rounded-full transition-all ${
            isLocationInfoVisible 
            ? 'bg-amber-500/50 hover:bg-amber-500/70 text-white' 
            : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
          title={isLocationInfoVisible ? "Ocultar ubicación" : "Mostrar ubicación"}
        >
          <Info size={20} className={isLocationInfoVisible ? "text-white" : "text-white/80"} />
        </button>
        
        {/* Separador */}
        <div className="w-8 h-px bg-white/10 mx-auto"></div>
        
        {/* Botón principal de información */}
        <button
          onClick={onInfoClick}
          className="p-2.5 text-white/70 hover:bg-white/10 hover:text-white rounded-full transition-all"
          title="Información del proyecto"
        >
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const isMobileRef = useRef<boolean>(window.innerWidth <= 768);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const animationFrameRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const selectedMarkerRef = useRef<string | null>(null);
  const mapLoadedRef = useRef<boolean>(false);

  // AppState principal
  const [appState, setAppState] = useState<AppState>({
    stage: 'preloader',
    selectedMacroRegion: null,
    selectedDepartment: null,
    selectedMemoryType: null,
    selectedLocation: null
  });

  // UI states
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [droneActive, setDroneActive] = useState(false); // false => no gira
  const [mapError, setMapError] = useState<string | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState(false); // Panel de información del lugar
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MemoryLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGuardianesOpen, setIsGuardianesOpen] = useState(false);
  
  // Estados para la carga del mapa
  const [mapProgress, setMapProgress] = useState(0);
  const [isMapFullyLoaded, setIsMapFullyLoaded] = useState(false);
  
  // Estado para el tutorial del menú radial
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Estado para la guía del menú radial
  const [showRadialGuide, setShowRadialGuide] = useState(false);
  const [highlightSection, setHighlightSection] = useState<'center' | 'macro' | 'department' | 'memory'>('center');
  
  // Estado para mantener la ubicación actual para el componente de contexto
  const [currentLocation, setCurrentLocation] = useState<{
    region?: string;
    department?: string;
    coordinates?: [number, number];
    name?: string;
  }>({});
  
  // Estado para controlar la visibilidad de la información de ubicación
  const [isLocationInfoVisible, setIsLocationInfoVisible] = useState(false);

  // Estado para almacenar las ubicaciones de memoria (demo o reales)
  const [memoryData, setMemoryData] = useState<MemoryLocation[]>([]);
  const [csvLoaded, setCsvLoaded] = useState(false);
  
  // Cargar datos del CSV y forzar uso de estos
  useEffect(() => {
    async function loadCSVData() {
      try {
        console.log("🚨 Cargando datos del CSV...");
        const csvPath = "/docs/lugar1.csv";
        const loadedData = await loadRealDataFromCSV(csvPath);
        
        if (loadedData.length > 0) {
          console.log(`🟢 Datos REALES cargados exitosamente: ${loadedData.length} ubicaciones`);
          
          // IMPORTANTE: Forzamos que los datos cargados se usen en todos lados
          // Esto modifica el array exportado por mapHelpers
          
          // Vaciar el array actual (para mantener referencias)
          const memoryLocationsArray = await import('./utils/mapHelpers').then(mod => mod.memoryLocations);
          memoryLocationsArray.length = 0; // Vaciar el array
          
          // Llenar con datos reales
          loadedData.forEach(item => memoryLocationsArray.push(item));
          
          // Actualizar el estado local
          setMemoryData([...loadedData]);
          
          console.log("🔄 Array de datos forzado a usar datos reales");
          
          // Si el mapa ya está cargado, actualizar los marcadores
          if (mapRef.current && mapLoadedRef.current) {
            console.log("Actualizando marcadores del mapa con datos reales");
            setupClusteredMarkers(
              mapRef,
              mapLoadedRef,
              loadedData,
              handleMarkerClick
            );
            
            updateVisibleMarkersWithClustering(
              mapRef,
              mapLoadedRef,
              appState,
              handleMarkerClick
            );
          }
        } else {
          console.warn("⚠️ No se pudieron cargar datos del CSV");
        }
      } catch (error) {
        console.error("❌ Error al cargar datos del CSV:", error);
      } finally {
        setCsvLoaded(true);
      }
    }
    
    loadCSVData();
  }, []);
  
  // Filtrar sugerencias basadas en la consulta de búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredLocations = memoryData.filter(location => {
      return (
        location.title.toLowerCase().includes(query) ||
        (location.description && location.description.toLowerCase().includes(query)) ||
        (location.code && location.code.toLowerCase().includes(query)) ||
        location.region.toLowerCase().includes(query) ||
        location.department.toLowerCase().includes(query) ||
        location.type.toLowerCase().includes(query)
      );
    });

    // Limitar a 5 sugerencias para no saturar la UI
    setSuggestions(filteredLocations.slice(0, 5));
  }, [searchQuery, memoryData]);

  /** 
   * Mapa está listo 
   */
  const handleMapReady = () => {
    // Iniciar un tiempo para incrementar gradualmente el progreso
    const totalLoadTime = 3000; // 3 segundos para asegurar carga completa
    const interval = 100; // Actualizar cada 100ms (menos frecuente)
    const steps = totalLoadTime / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        
        // Primero cargar las capas básicas
        setTimeout(() => {
          // Iniciar la configuración del mapa
          addEnvironmentEffects(mapRef, mapLoadedRef);
          
          // Cargar macroregiones
          loadRegionsGeoJSON(mapRef, mapLoadedRef);
          
          // Configurar la atenuación de regiones resaltadas basada en zoom
          import('./utils/regionLoader').then(module => {
            module.setupZoomBasedHighlighting(mapRef);
          });
          
          // Retrasar la carga de otras capas para evitar sobrecarga
          setTimeout(() => {
            // Configurar capas adicionales
            setupMapLayers(mapRef, mapLoadedRef);
            
            // Retrasar la carga de marcadores para evitar sobrecarga
            setTimeout(() => {
              // Configurar sistema de clustering para marcadores con los datos actuales
              setupClusteredMarkers(
                mapRef,
                mapLoadedRef,
                memoryData, // Usar los datos que estén disponibles
                handleMarkerClick
              );
              
              // Actualizar marcadores según el estado actual
              updateVisibleMarkersWithClustering(
                mapRef,
                mapLoadedRef,
                appState,
                handleMarkerClick
              );
              
              // Marcar como completamente cargado
              setIsMapFullyLoaded(true);
            }, 500);
          }, 500);
        }, 300);
      }
      
      setMapProgress(currentProgress);
    }, interval);
  };

  /**
   * Clic en un marcador
   */
  const handleMarkerClick = (location: MemoryLocation) => {
    console.log("🏠 Seleccionando lugar:", location.title, "- Región:", location.region);
    
    // Actualizar estado incluyendo la macroregión y reiniciando el departamento
    // Esto asegura que cuando seleccionamos un lugar, su región se active automáticamente
    setAppState(prev => ({
      ...prev,
      selectedLocation: location,
      selectedMacroRegion: location.region,
      // No reiniciamos selectedDepartment para mantener coherencia con la UI
    }));
    
    // Activar el panel de información detallada
    setShowLocationInfo(true);
    
    // Detener cualquier animación activa
    setDroneActive(false);
    
    // Volar al lugar de forma cinematográfica
    cinematicLocationFocus(mapRef, location);
    
    // Mostrar área de interés exactamente alrededor del punto del lugar de memoria
    drawAreaOfInterest(
      mapRef, 
      mapLoadedRef, 
      [location.longitude, location.latitude], 
      0.1 // Radio reducido para que siempre esté cerca del punto
    );
    
    // Marcarlo como seleccionado
    selectedMarkerRef.current = location.id;
    
    // Resaltar la región a la que pertenece este lugar
    highlightRegion(mapRef, getRegionNameForGeoJSON(location.region));
    
    console.log("✅ Región seleccionada automáticamente:", location.region);
  };

  /**
   * Manejar selección de sugerencia
   */
  const handleSuggestionSelect = (location: MemoryLocation) => {
    handleMarkerClick(location);
    setSearchQuery(location.title);
    setShowSuggestions(false);
  };
  
  /**
   * Manejar cierre del tutorial
   */
  const handleCloseTutorial = () => {
    setShowTutorial(false);
    setShowRadialGuide(false);
    TutorialStateManager.dismissTutorial();
  };
  
  /**
   * Manejar finalización del tutorial
   */
  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    setShowRadialGuide(false);
    TutorialStateManager.markTutorialAsCompleted();
  };

  /**
   * Manejar búsqueda
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionSelect(suggestions[0]);
    }
  };

  /**
   * Renderiza un mensaje de tour en un contenedor
   */
  const renderTourMessage = (props: any, container: HTMLElement, onClose: () => void) => {
    const root = createRoot(container);
    root.render(
      <TourMessage
        title={props.title}
        message={props.message}
        location={props.location}
        isLastStep={props.isLastStep}
        onNext={props.onNext}
        skipFunction={props.skipFunction}
        onClose={() => {
          root.unmount();
          onClose();
        }}
      />
    );
  };

  /**
   * Inicia Tour Guiado
   */
  async function startTour() {
    console.log("==== LLAMADA A startTour en App.tsx ====");
    console.log("Estado actual de la app:", appState.stage);
    console.log("Mapa disponible:", mapRef.current ? "Sí" : "No");
    console.log("Mapa cargado:", mapLoadedRef.current ? "Sí" : "No");
    
    if (!mapRef.current || !mapLoadedRef.current) {
      console.error("ERROR: No hay mapa disponible para iniciar el tour");
      alert("Espera a que el mapa termine de cargar para iniciar el recorrido");
      return;
    }
    
    // Eliminamos el mensaje de bienvenida para que no interrumpa la experiencia
    
    console.log("Llamando a startGuidedTour directamente...");
    startGuidedTour(
      mapRef,
      mapLoadedRef,
      setDroneActive,
      setAppState,
      renderTourMessage,
      [], // Array vacío para indicar que use el tour por defecto
      handleDemoComplete // Pasar la función para saltar el demo
    );
  }

  /**
   * Iniciar mapa
   */
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      initializeMap(
        mapContainerRef,
        mapRef,
        mapLoadedRef,
        setIsMapLoaded,
        setMapError,
        droneActive,
        setDroneActive,
        handleMapReady
      );
    }
    return () => {
      // limpieza
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mapRef.current) {
        console.log("Eliminando mapa al desmontar");
        mapRef.current.remove();
        mapRef.current = null;
        mapLoadedRef.current = false;
      }
    };
  }, []);

  /**
   * Animación de cámara (droneActive)
   */
  useEffect(() => {
    if (droneActive && mapRef.current && mapLoadedRef.current) {
      animationFrameRef.current = requestAnimationFrame((timestamp) =>
        animateCamera(
          timestamp,
          mapRef,
          mapLoadedRef,
          droneActive,
          lastFrameTime,
          animationFrameRef,
          setDroneActive
        )
      );
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [droneActive]);

  // Actualizar marcadores cuando cambia el tipo de memoria seleccionado
  useEffect(() => {
    if (mapRef.current && mapLoadedRef.current) {
      // Reemplazar la función original con la versión de clustering
      updateVisibleMarkersWithClustering(
        mapRef,
        mapLoadedRef,
        appState,
        handleMarkerClick
      );
    }
  }, [appState.selectedMemoryType, appState.selectedMacroRegion, appState.selectedDepartment]);

  // Actualizar ubicación actual cuando cambie el estado de la aplicación
  useEffect(() => {
    // Actualizar información de ubicación basada en el estado actual
    const newLocation: any = {};
    
    if (appState.selectedMacroRegion) {
      newLocation.region = colombiaRegions[appState.selectedMacroRegion].name;
      
      if (appState.selectedDepartment) {
        const department = colombiaRegions[appState.selectedMacroRegion].departments.find(
          d => d.id === appState.selectedDepartment
        );
        if (department) {
          newLocation.department = department.name;
        }
      }
    }
    
    if (appState.selectedLocation) {
      newLocation.name = appState.selectedLocation.title;
      newLocation.coordinates = [
        appState.selectedLocation.longitude,
        appState.selectedLocation.latitude
      ];
    }
    
    setCurrentLocation(newLocation);
  }, [appState.selectedMacroRegion, appState.selectedDepartment, appState.selectedLocation]);
  
  // Efecto para mostrar el tutorial en el momento adecuado
  useEffect(() => {
    // Mostrar el tutorial solo cuando:
    // 1. El mapa está completamente cargado
    // 2. Estamos en la vista principal (app)
    // 3. No estamos en modo tour
    // 4. El tutorial debe mostrarse según las reglas del TutorialStateManager
    if (isMapFullyLoaded && appState.stage === 'app') {
      // Pequeño retraso para asegurar que todo esté renderizado
      const timer = setTimeout(() => {
        if (TutorialStateManager.shouldShowTutorial()) {
          setShowTutorial(true);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isMapFullyLoaded, appState.stage]);

  // Preloader -> Demo
  const handlePreloaderComplete = () => {
    // Al iniciar el demo, nos aseguramos que no haya regiones seleccionadas
    setAppState(prev => ({ 
      ...prev, 
      stage: 'demo',
      selectedMacroRegion: null
    }));
    
    // También nos aseguramos de que las capas del mapa muestren todas las regiones
    if (mapRef.current && mapLoadedRef.current) {
      console.log("Inicializando mapa para modo demo...");
      
      // Cargar regiones en caso de que no estén cargadas
      loadRegionsGeoJSON(mapRef, mapLoadedRef);
      
      // Resetear cualquier selección previa de regiones
      import('./utils/regionLoader').then(module => {
        module.resetRegionHighlighting(mapRef);
      });
    }
  };

  // Demo -> App
  const handleDemoComplete = () => {
    try {
      console.log("Completando modo demo y mostrando app principal con menú radial");
      
      // Marcar demo como completado y cambiar el estado a 'app'
      DemoStateManager.markDemoAsComplete();
      // Al salir del demo, asegurarse de que no haya macroregiones seleccionadas
      setAppState(prev => ({ 
        ...prev, 
        stage: 'app',
        selectedMacroRegion: null, // Resetear la macroregión seleccionada
        selectedDepartment: null,  // Resetear el departamento seleccionado
        selectedMemoryType: null   // Resetear el tipo de memoria seleccionado
      }));
      
      // Asegurar que el mapa está en modo app y listo para interactuar
      if (mapRef.current) {
        // Restablecer la vista del mapa a la vista completa de Colombia
        mapRef.current.flyTo({
          center: [-73.5, 4.8],
          zoom: 6,
          pitch: 30,
          bearing: 0,
          duration: 2000
        });
        
        // Quitar resaltado de regiones si hay alguna seleccionada
        import('./utils/regionLoader').then(module => {
          module.resetRegionHighlighting(mapRef);
        });
      }
      
      // Asegurar que el menú radial sea visible (importante)
      setTimeout(() => {
        // Forzar visibilidad del menú radial con múltiples comprobaciones
        const menuContainer = document.getElementById('menu-radial-container');
        if (menuContainer) {
          console.log("Forzando visibilidad del menú radial");
          menuContainer.style.display = 'flex';
          menuContainer.style.opacity = '1';
          menuContainer.style.visibility = 'visible';
          menuContainer.style.pointerEvents = 'auto';
          menuContainer.style.zIndex = '9999';
          
          // NO mostramos la guía del menú radial en la transición a app
          // Sólo nos aseguramos que el menú sea visible
          if (menuContainer) {
            menuContainer.style.display = 'flex';
            menuContainer.style.opacity = '1';
            menuContainer.style.visibility = 'visible';
          }
        } else {
          console.error("No se pudo encontrar el contenedor del menú radial");
          // Forzar recarga de componentes críticos
          setAppState(prev => ({ ...prev }));
        }
      }, 1000);
    } catch (error) {
      console.error("ERROR EN handleDemoComplete:", error);
      // En caso de error, forzar el cambio a modo app
      setAppState(prev => ({ 
        ...prev, 
        stage: 'app',
        selectedMacroRegion: null,
        selectedDepartment: null,
        selectedMemoryType: null
      }));
    }
  };

  // Manejar radial select
  const handleRadialSelect = (
    type: 'macro' | 'department' | 'memory',
    id: string
  ) => {
    if (!mapRef.current || !mapLoadedRef.current) return;
    
    console.log(`RadialSelect: tipo=${type}, id=${id}, stage=${appState.stage}`);

    if (type === 'macro') {
      if (id === 'center') {
        startTour();
      } else {
        // Resaltar la región seleccionada
        highlightRegion(mapRef, getRegionNameForGeoJSON(id as MacroRegion));
        
        // En modo APP: Forzar movimiento de cámara directo sin verificar condiciones
        // La navegación a regiones solo debe ocurrir después del modo demo
        if (appState.stage === 'app') {
          console.log(`🚨 NAVEGANDO a región ${id}`);
          
          // Obtener región y coordenadas
          const region = colombiaRegions[id as MacroRegion];
          
          if (region && region.bounds) {
            // Calcular el centro manual en vez de usar la función
            const centerLng = (region.bounds.lng[0] + region.bounds.lng[1]) / 2;
            const centerLat = (region.bounds.lat[0] + region.bounds.lat[1]) / 2;
            
            // Mover cámara directamente con método básico
            if (mapRef.current) {
              // Forzar movimiento directo
              mapRef.current.easeTo({
                center: [centerLng, centerLat],
                zoom: 7.5,
                pitch: 60,
                bearing: Math.random() * 60 - 30,
                duration: 2000,
                essential: true
              });
            }
            
            // Actualizar estado
            setAppState(prev => ({ 
              ...prev, 
              selectedMacroRegion: id as MacroRegion,
              selectedDepartment: null
            }));
          }
        } else {
          console.log(`Navegación ignorada, modo demo activo: ${appState.stage}`);
        }
      }
    } else if (type === 'department') {
      navigateToDepartment(id, appState, mapRef, mapLoadedRef, setAppState);
    } else if (type === 'memory') {
      setAppState(prev => ({
        ...prev,
        selectedMemoryType: prev.selectedMemoryType === id as keyof typeof memoryTypes ? null : id as keyof typeof memoryTypes
      }));
      
      // Actualizar el sistema de clustering con el nuevo filtro
      updateVisibleMarkersWithClustering(
        mapRef,
        mapLoadedRef,
        {
          ...appState,
          selectedMemoryType: appState.selectedMemoryType === id as keyof typeof memoryTypes ? null : id as keyof typeof memoryTypes
        },
        handleMarkerClick
      );
    }
  };

  // on/off de capas (deforestation, mining, erosion)
  const handleToggleLayer = (layerId: string) => {
    const newActiveLayers = activeLayers.includes(layerId)
      ? activeLayers.filter((id) => id !== layerId)
      : [...activeLayers, layerId];

    const updatedLayers = updateLayersVisibility(
      mapRef,
      mapLoadedRef,
      newActiveLayers,
      handleMarkerClick
    );
    setActiveLayers(updatedLayers || newActiveLayers);
  };

  // Reiniciar mapa
  const handleResetMap = () => {
    resetMap(
      mapRef,
      mapContainerRef,
      markersRef,
      mapLoadedRef,
      setIsMapLoaded,
      setMapError,
      droneActive,
      setDroneActive,
      handleMapReady
    );
  };

  // Funciones para los controles de navegación
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleResetRotation = () => {
    if (mapRef.current) {
      mapRef.current.resetNorth();
    }
  };

  // Estados para controlar la visibilidad de componentes modales
  const [isTourSelectorOpen, setIsTourSelectorOpen] = useState(false);
  const [isExilioViewOpen, setIsExilioViewOpen] = useState(false);

  // Función para manejar la selección de un recorrido temático
  const handleTourSelect = (tourId: TourType) => {
    // Obtener el recorrido seleccionado
    const selectedTour = thematicTours.find(tour => tour.id === tourId);
    
    // Cerrar el selector
    setIsTourSelectorOpen(false);
    
    // Iniciar el recorrido con las ubicaciones específicas
    if (selectedTour && mapRef.current && mapLoadedRef.current) {
      console.log(`Iniciando recorrido: ${selectedTour.title}`);
      
      // Usar las ubicaciones específicas del tour seleccionado
      startGuidedTour(
        mapRef,
        mapLoadedRef,
        setDroneActive,
        setAppState,
        renderTourMessage,
        selectedTour.locations, // Pasamos las ubicaciones específicas
        handleDemoComplete // Pasar la función para saltar el demo
      );
    }
  };

  // Funciones para los botones de navegación
  const handleRouteClick = () => {
    // Abrir el selector de recorridos en lugar de iniciar directamente el tour
    setIsTourSelectorOpen(true);
  };

  const handleInfoClick = () => {
    console.log("Información");
    // Mostrar panel de información
  };

  const handleHelpClick = () => {
    console.log("Ayuda");
    // Mostrar panel de ayuda
  };

  const handleExilioClick = () => {
    // Abrir la vista del globo con los lugares del exilio
    setIsExilioViewOpen(true);
  };
  
  const handleGuardianesClick = () => {
    // Abrir el panel de Guardianes de la Memoria
    setIsGuardianesOpen(true);
  };
  
  const handleLocationClick = () => {
    console.log("Ubicación");
    // Zooming a ubicación actual
    if (mapRef.current && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 14,
              pitch: 60,
              bearing: 0,
              duration: 2000
            });
          }
        },
        (error) => {
          console.error("Error getting current position:", error);
        }
      );
    }
  };

  const handleUserProfileClick = () => {
    console.log("Perfil de usuario");
    // Mostrar panel de perfil
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Mapa */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 map-container"
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />

      {/* Pantalla de carga */}
      <AnimatePresence>
        {isMapLoaded && !isMapFullyLoaded && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="text-white text-center">
              <div className="mb-4">Cargando mapa ({mapProgress.toFixed(0)}%)</div>
              <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-out" 
                  style={{ width: `${mapProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Etapas */}
      {appState.stage === 'preloader' && (
        <Preloader onStart={handlePreloaderComplete} />
      )}

      {appState.stage === 'demo' && (
        <DemoMode 
          onDemoComplete={() => {
            console.log("DemoMode solicitó completar demo - llamando a handleDemoComplete");
            handleDemoComplete();
          }}
          onStartTour={startTour}
          mapRef={mapRef}
          mapLoadedRef={mapLoadedRef}
        />
      )}

      {(appState.stage === 'app' || appState.stage === 'tour') && isMapFullyLoaded && (
        <>
          {/* Navegación y contexto de ubicación */}
          <NavBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onRouteClick={handleRouteClick}
            onInfoClick={handleInfoClick}
            onHelpClick={handleHelpClick}
            onLocationClick={handleLocationClick}
            onUserProfileClick={handleUserProfileClick}
            onExilioClick={handleExilioClick}
            onGuardianesClick={handleGuardianesClick}
            appState={appState}
            memoryLocations={memoryData}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSuggestionSelect={handleSuggestionSelect}
          />
          
          {/* Movido debajo del RadialMenu */}
          
          <SideButtons
            activeLayers={activeLayers}
            onToggleLayer={handleToggleLayer}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetRotation={handleResetRotation}
            onStartTour={startTour}
          />

          {/* POSICIONADO EXACTAMENTE EN LA ESQUINA INFERIOR DERECHA */}
          {appState.stage !== 'tour' && (
            <>
              {/* MENÚ RADIAL PEGADO A LA ESQUINA INFERIOR DERECHA */}
              {/* SOLO versión desktop: Menú radial normal */}
              {!isMobileRef.current && (
                <div id="menu-radial-container" className="fixed bottom-2 right-2 w-[400px] h-[400px] z-[9999] pointer-events-auto">
                  <RadialMenu
                    onSelect={handleRadialSelect}
                    onStartTour={startTour}
                    onResetView={() => {
                      console.log("Reseteando mapa"); 
                      resetMap(
                        mapRef,
                        mapContainerRef,
                        markersRef,
                        mapLoadedRef,
                        setIsMapLoaded,
                        setMapError,
                        droneActive,
                        setDroneActive,
                        handleMapReady
                      );
                    }}
                    isDemoMode={false}
                    selectedMacro={appState.selectedMacroRegion}
                    highlightSection={highlightSection}
                  />
                </div>
              )}
              
              {/* SOLO versión móvil: Menú móvil completamente independiente */}
              {isMobileRef.current && (
                <MobileMenu 
                  selectedMacro={appState.selectedMacroRegion}
                  selectedDepartment={appState.selectedDepartment}
                  selectedMemoryType={appState.selectedMemoryType}
                  onSelect={handleRadialSelect}
                  onStartTour={startTour}
                  onResetView={handleResetView}
                />
              )}
              
              {/* Eliminamos la guía del menú radial en modo app */}
              
              
              {/* LocationContext en el centro inferior - ahora controlado por estado de visibilidad */}
              {Object.keys(currentLocation).length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center">
                  <LocationContext 
                    currentLocation={currentLocation}
                    isActive={true}
                    isVisible={isLocationInfoVisible}
                    onToggleVisibility={() => setIsLocationInfoVisible(!isLocationInfoVisible)}
                  />
                </div>
              )}
            </>
          )}

          {/* Panel de información detallada de lugar de memoria */}
          {showLocationInfo && appState.selectedLocation && (
            <LocationInfo
              title={appState.selectedLocation.title}
              description={appState.selectedLocation.description || "Este lugar forma parte de la red de sitios documentados por el Centro Nacional de Memoria Histórica como espacios significativos en la construcción de la memoria colectiva."}
              code={appState.selectedLocation.code}
              region={appState.selectedLocation.region}
              type={appState.selectedLocation.type ? memoryTypes[appState.selectedLocation.type]?.name : "Lugar de Memoria"}
              onClose={() => {
                setShowLocationInfo(false);
                hideAreaOfInterest(mapRef, mapLoadedRef);
              }}
            />
          )}

          {/* Botón de información unificado con control de ubicación */}
          <InfoButtons 
            onInfoClick={handleInfoClick} 
            onToggleLocationInfo={() => setIsLocationInfoVisible(!isLocationInfoVisible)}
            isLocationInfoVisible={isLocationInfoVisible}
          />

          {/* Error */}
          {mapError && (
            <div
              className="absolute bottom-14 left-1/2 transform -translate-x-1/2
                         bg-red-600/80 text-white px-4 py-2 rounded-lg max-w-md
                         text-center z-[9999]"
            >
              {mapError}
            </div>
          )}

          {/* Selector de recorridos temáticos */}
          <AnimatePresence>
            {isTourSelectorOpen && (
              <TourSelector 
                isOpen={isTourSelectorOpen}
                onClose={() => setIsTourSelectorOpen(false)}
                onSelectTour={handleTourSelect}
              />
            )}
          </AnimatePresence>
          
          {/* Vista del Globo con lugares de exilio */}
          <ExilioGlobeView 
            isOpen={isExilioViewOpen}
            onClose={() => setIsExilioViewOpen(false)}
          />
          
          {/* Panel de Guardianes de la Memoria */}
          <GuardianesMemoria
            isOpen={isGuardianesOpen}
            onClose={() => setIsGuardianesOpen(false)}
          />
        </>
      )}
    </div>
  );
}