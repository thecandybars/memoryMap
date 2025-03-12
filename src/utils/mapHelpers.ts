// src/utils/mapHelpers.ts
import { MemoryLocation } from "../types";
import { colombiaRegions, memoryTypes, type MacroRegion } from "../data/regions";

// NOTA: NO importamos los datos demo de realMemoryLocations
// Ahora importamos directamente desde el módulo que carga CSV
import { convertCSVToMemoryLocations } from "./realData/importData";

// Array vacío por defecto - será reemplazado por los datos reales
export const memoryLocations: MemoryLocation[] = [];

/**
 * Función mejorada para crear marcadores elegantes con transparencias
 */
export function createCustomMarker(
  location: MemoryLocation, 
  isCluster = false,
  clusterCount?: number,
  isSelected = false
): HTMLDivElement {
  const el = document.createElement("div");
  
  if (isCluster) {
    el.innerHTML = `
      <div class="cluster-marker">
        <div class="cluster-base">
          <span class="cluster-value">${clusterCount ?? 0}</span>
        </div>
      </div>
    `;
  } else if (location) {
    // Determinamos el color y el símbolo del icono basado en el tipo
    const iconColor = getIconColorByType(location.type);
    const iconSymbol = getIconSymbolByType(location.type);
    
    // Estructura más elegante con transparencias y sin emoticonos
    el.innerHTML = `
      <div class="memory-location-marker ${isSelected ? "selected" : ""}">
        <div class="memory-marker-outer-ring"></div>
        <div class="memory-marker-circle" style="background-color: ${iconColor}40; border-color: ${iconColor}80;">
          <div class="memory-marker-inner-circle" style="background-color: ${iconColor};">
            <div class="memory-marker-icon" style="color: white;">${iconSymbol}</div>
          </div>
        </div>
        <div class="memory-marker-label" style="margin-top: 2px; font-size: 10px; font-weight: bold; color: white; background-color: rgba(0, 0, 0, 0.7); padding: 2px 5px; border-radius: 3px; white-space: nowrap; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2);">${location.id.replace('loc', '')}</div>
      </div>
    `;
  }

  return el;
}

/**
 * Devuelve un color de icono basado en el tipo.
 */
function getIconColorByType(type: string): string {
  const colors: Record<string, string> = {
    identificados: "#FF9D4D",    // Naranja
    caracterizados: "#4CAF50",   // Verde
    solicitud: "#2196F3",         // Azul
    horror: "#F44336",            // Rojo
    sanaciones: "#9C27B0",        // Morado
    exilio: "#EC4899",            // Rosa fuerte para exilio
  };

  return colors[type] || "#FFFFFF";
}

/**
 * Devuelve un símbolo (icono SVG) basado en el tipo.
 */
function getIconSymbolByType(type: string): string {
  const symbols: Record<string, string> = {
    identificados: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L20 7L12 12L4 7L12 2Z"/>
      <path d="M20 14l-8 5l-8-5"/>
    </svg>`, // Marcador de lugar identificado - forma de diamante
    
    caracterizados: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18"/>
      <path d="M15 3v18"/>
    </svg>`, // Libro/documento - caracterización
    
    solicitud: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
      <path d="M10 9H8"/>
    </svg>`, // Documento con líneas - solicitud
    
    horror: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>`, // Triángulo de advertencia - lugares del horror
    
    sanaciones: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 11v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a4 4 0 1 0-10 0Z"/>
      <path d="M12 3v4"/>
      <path d="M10 7h4"/>
    </svg>`, // Lámpara/esperanza - sanaciones
    
    exilio: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 3.2A9 9 0 1 0 20.8 14a1 1 0 0 0-1-1H13a1 1 0 0 1-1-1V4.5a1 1 0 0 0-.5-.9 1 1 0 0 0-1.2.1L10 3.2Z"/>
      <path d="M3 9h2"/>
      <path d="M8 3.2V5"/>
      <path d="M11 3h2"/>
    </svg>`, // Icono de mundo/globo - exilio
  };

  return symbols[type] || `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>`; // Icono de ubicación predeterminado
}