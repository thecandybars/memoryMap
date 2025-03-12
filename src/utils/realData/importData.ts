// src/utils/realData/importData.ts
import { MemoryLocation } from "../../types";
import { MacroRegion } from "../../data/regions";
import { normalizeDepartmentName, regionMappings, tipoMappings } from "../realMemoryLocations";

// Estructura del CSV lugar1.csv:
// lugarId,lugarNombre,latitud,longitud,descripcion,municipioNombre,departamentoNombre,regionName,regionFullName,tipologiaGeneralNombre,tipologiaEspecificaNombre,tipoLugarNombre,nombreCorto,imagenMedioId

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

// Coordenadas predeterminadas por municipio
const defaultCoordinates: Record<string, [number, number]> = {
  // Estas son coordenadas aproximadas para algunos municipios
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

// Función principal para convertir datos del CSV a MemoryLocation
export function convertCSVToMemoryLocations(csv: string): MemoryLocation[] {
  console.log("[CSV Parser] Convirtiendo CSV a objetos MemoryLocation");
  
  // Dividir el CSV en líneas y encabezados
  const lines = csv.split('\n');
  
  if (lines.length < 2) {
    console.error("[CSV Parser] El CSV no tiene suficientes líneas");
    return [];
  }
  
  console.log(`[CSV Parser] Procesando ${lines.length} líneas de CSV`);
  
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
      
      // Mapear a la estructura de MemoryLocation
      
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
      
      // Usar el nombre real del lugar como código en lugar de LM01, LM02, etc.
      const code = lugarData.lugarNombre;
      
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

// Función para cargar los datos del CSV
export async function loadRealDataFromCSV(csvPath: string): Promise<MemoryLocation[]> {
  try {
    console.log("[CSV Loader] Intentando cargar CSV desde:", csvPath);
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log("[CSV Loader] CSV cargado exitosamente, longitud:", csvText.length, "bytes");
    const locations = convertCSVToMemoryLocations(csvText);
    console.log("[CSV Loader] Datos convertidos:", locations.length, "ubicaciones");
    return locations;
  } catch (error) {
    console.error("[CSV Loader] Error loading CSV data:", error);
    return [];
  }
}

// Exportamos el memoryLocations inicial vacío que será reemplazado por datos reales
export const memoryLocations: MemoryLocation[] = [];