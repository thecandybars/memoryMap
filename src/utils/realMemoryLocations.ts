// src/utils/realMemoryLocations.ts
import { MemoryLocation } from "../types";
import { colombiaRegions, memoryTypes, type MacroRegion } from "../data/regions";

// Mapeo de tipologías específicas del CSV a nuestras categorías
export const tipoMappings: Record<string, keyof typeof memoryTypes> = {
  "Lugar de Memoria": "identificados",
  "Museo de Memoria": "caracterizados",
  "Santuario de memoria": "solicitud",
  "Lugar del horror": "horror",
  "Espacio para sanar": "sanaciones",
};

// Mapeo de regiones en minúsculas a nuestras macroregiones
export const regionMappings: Record<string, MacroRegion> = {
  "pacifico": "pacifico",
  "amazonia": "amazonia",
  "andina": "andina",
  "caribe": "caribe",
  "orinoquia": "orinoquia",
};

// Función para normalizar los nombres de departamento
export function normalizeDepartmentName(name: string): string {
  const normalizations: Record<string, string> = {
    "Valle del Cauca": "valle_del_cauca",
    "Norte de Santander": "norte_de_santander", 
    "Bogotá": "cundinamarca",
    "San Andrés": "sai",
    "Magdalena": "magdalena",
    "Bolívar": "bolivar",
    "Antioquia": "antioquia",
    "Chocó": "choco",
    "Nariño": "narino",
    "Cauca": "cauca",
    "Putumayo": "putumayo",
    "Caquetá": "caqueta",
    "Amazonas": "amazonas",
    "Guainía": "guainia",
    "Guaviare": "guaviare",
    "Vaupés": "vaupes",
    "Meta": "meta",
    "Vichada": "vichada",
    "Casanare": "casanare",
    "Arauca": "arauca",
    "Boyacá": "boyaca",
    "Santander": "santander",
    "Cundinamarca": "cundinamarca",
    "Huila": "huila",
    "Tolima": "tolima",
    "Caldas": "caldas",
    "Risaralda": "risaralda",
    "Quindío": "quindio",
    "Atlántico": "atlantico",
    "Cesar": "cesar",
    "La Guajira": "guajira",
    "Córdoba": "cordoba",
    "Sucre": "sucre",
  };
  
  // Intenta encontrar una normalización directa primero
  if (normalizations[name]) {
    return normalizations[name];
  }
  
  // Si no hay normalización directa, busca una coincidencia parcial
  for (const [key, value] of Object.entries(normalizations)) {
    if (name.includes(key)) {
      return value;
    }
  }
  
  // Si todo falla, utiliza la versión en minúsculas y sin espacios
  return name.toLowerCase().replace(/\s+/g, '_');
}

// Coordenadas predeterminadas por municipio
const defaultCoordinates: Record<string, [number, number]> = {
  "MEDELLÍN": [6.244747, -75.573101],
  "BOGOTÁ": [4.650173, -74.107359],
  "CALI": [3.414414, -76.521565],
  "SILOE": [3.445374, -76.538078], // Considerando Siloe parte de Cali
  "BARRANQUILLA": [10.964325, -74.796964],
  "SANTA MARTA": [11.229434, -74.190894],
  "BUENAVENTURA": [3.875802, -77.01174],
  "CARTAGENA": [10.400000, -75.514442],
  "CUCUTA": [7.905306, -72.508256],
  "POPAYÁN": [2.482503, -76.574065],
  "PASTO": [1.212124, -77.278576]
};

// Estructura para parsear el CSV
interface CSVLugar {
  lugarId: string;
  lugarNombre: string;
  latitud: string;
  longitud: string;
  descripcion: string;
  municipioNombre: string;
  departamentoNombre: string;
  regionName: string;
  regionFullName: string;
  tipologiaGeneralNombre: string;
  tipologiaEspecificaNombre: string;
  tipoLugarNombre: string;
  nombreCorto: string;
  imagenMedioId: string;
}

// Función para convertir un string a número o proporcionar un valor por defecto
function parseNumOrDefault(value: string, defaultValue: number): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Función principal para convertir datos del CSV a MemoryLocation
function convertCSVToMemoryLocations(csv: string): MemoryLocation[] {
  console.log("Convirtiendo CSV a objetos MemoryLocation");
  
  // Dividir el CSV en líneas y encabezados
  const lines = csv.split('\n');
  
  if (lines.length < 2) {
    console.error("El CSV no tiene suficientes líneas");
    return [];
  }
  
  // Procesar cada línea del CSV (omitir la primera que son los encabezados)
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map((line, index) => {
      // Parsear CSV a un objeto estructurado, manejando comas dentro de comillas
      const values: string[] = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Añadir el último valor
      values.push(currentValue);
      
      const lugarData: CSVLugar = {
        lugarId: values[0] || '',
        lugarNombre: values[1]?.replace(/"/g, '') || '',
        latitud: values[2] || '',
        longitud: values[3] || '',
        descripcion: values[4]?.replace(/"/g, '') || '',
        municipioNombre: values[5] || '',
        departamentoNombre: values[6] || '',
        regionName: values[7] || '',
        regionFullName: values[8] || '',
        tipologiaGeneralNombre: values[9] || '',
        tipologiaEspecificaNombre: values[10] || '',
        tipoLugarNombre: values[11] || '',
        nombreCorto: values[12] || '',
        imagenMedioId: values[13] || ''
      };
      
      // 1. Determinar región
      const region = (regionMappings[lugarData.regionName.toLowerCase()] || 'andina') as MacroRegion;
      
      // 2. Normalizar nombre de departamento
      const department = normalizeDepartmentName(lugarData.departamentoNombre);
      
      // 3. Determinar tipo basado en tipoLugarNombre
      const type = tipoMappings[lugarData.tipoLugarNombre] || 'identificados';
      
      // 4. Determinar coordenadas
      let latitude = parseNumOrDefault(lugarData.latitud, 0);
      let longitude = parseNumOrDefault(lugarData.longitud, 0);
      
      // Si las coordenadas no son válidas, usar coordenadas predeterminadas
      if (!latitude || !longitude) {
        const municipioKey = lugarData.municipioNombre.toUpperCase();
        if (defaultCoordinates[municipioKey]) {
          [latitude, longitude] = defaultCoordinates[municipioKey];
        }
      }
      
      // Crear código basado en ID
      const code = `LM${lugarData.lugarId.padStart(3, '0')}`;
      
      // Crear objeto MemoryLocation
      return {
        id: `loc${lugarData.lugarId}`,
        latitude,
        longitude,
        title: lugarData.lugarNombre,
        description: lugarData.descripcion,
        type,
        region,
        department,
        code
      };
    })
    .filter(location => location.latitude && location.longitude); // Filtrar ubicaciones sin coordenadas válidas
}

// Intentar cargar el CSV directamente
console.log("Cargando datos del CSV desde realMemoryLocations.ts");

// Lista vacía por defecto
let realMemoryLocations: MemoryLocation[] = [];

// Cargar CSV inmediatamente (de forma síncrona para IIFE)
(async function loadRealData() {
  try {
    console.log("Intentando cargar CSV de forma síncrona");
    const response = await fetch("/docs/lugar1.csv");
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log("CSV cargado, longitud:", csvText.length, "bytes");
    
    const locations = convertCSVToMemoryLocations(csvText);
    console.log(`Convertido ${locations.length} ubicaciones del CSV`);
    
    if (locations.length > 0) {
      realMemoryLocations = locations;
      console.log("¡Datos reales cargados exitosamente!");
    } else {
      console.warn("No se pudieron cargar datos del CSV, usando un conjunto vacío");
    }
  } catch (error) {
    console.error("Error al cargar CSV:", error);
  }
})();

// Datos de respaldo por si la carga falla (solo incluimos estos 5)
const fallbackLocations: MemoryLocation[] = [
  {
    id: "loc1",
    latitude: 3.445374,
    longitude: -76.538078,
    title: "Museo Popular de síloé",
    description: "Junto con las mujeres artesanas que hacen parte del movimiento de víctimas se elaboró la presentación de la memoria en telas transparentes que cubren todas las paredes de la capilla.",
    type: "identificados",
    region: "pacifico",
    department: "valle_del_cauca",
    code: "LM001"
  },
  {
    id: "loc4",
    latitude: 3.563834,
    longitude: -73.794013,
    title: "Parque y Casa de la memoria de El Castillo",
    description: "El parque de la memoria de El castillo busca visibilizar las afectaciones de la violencia y honrar a quienes fallecieron o desaparecieron durante el conflicto en la región.",
    type: "caracterizados",
    region: "orinoquia",
    department: "meta",
    code: "LM004"
  }
];

// Exportar los datos completos (si la carga falló, exportamos los fallback)
export { realMemoryLocations as memoryLocations };