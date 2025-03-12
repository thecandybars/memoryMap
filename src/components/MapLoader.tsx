// src/components/MapLoader.tsx
import React, { useEffect, useState } from 'react';
import { MemoryLocation } from '../types';
import { loadRealDataFromCSV } from '../utils/realData/importData';
import { memoryLocations as demoLocations } from '../utils/mapHelpers';

// Para depuración
console.log("MapLoader importado");

interface MapLoaderProps {
  onDataLoaded: (locations: MemoryLocation[]) => void;
  useRealData?: boolean;
  csvPath?: string;
}

const MapLoader: React.FC<MapLoaderProps> = ({ 
  onDataLoaded, 
  useRealData = true,
  csvPath = "/docs/lugar1.csv" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        
        if (useRealData) {
          // Cargar datos reales desde el CSV
          console.log("Cargando datos reales desde:", csvPath);
          const realLocations = await loadRealDataFromCSV(csvPath);
          
          if (realLocations.length === 0) {
            console.warn("No se cargaron datos reales, usando datos de demostración");
            onDataLoaded(demoLocations);
          } else {
            console.log(`Datos reales cargados: ${realLocations.length} ubicaciones`);
            onDataLoaded(realLocations);
          }
        } else {
          // Usar datos de demostración predefinidos
          console.log("Usando datos de demostración");
          onDataLoaded(demoLocations);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        // Si hay un error, usar datos de demostración como fallback
        onDataLoaded(demoLocations);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [onDataLoaded, useRealData, csvPath]);
  
  // Este componente no renderiza nada visible, solo gestiona la carga de datos
  return (
    <>
      {isLoading && <div className="hidden">Cargando datos...</div>}
      {error && <div className="hidden">Error: {error}</div>}
    </>
  );
};

export default MapLoader;