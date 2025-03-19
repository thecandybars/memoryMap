// src/utils/regionLoader.ts
import mapboxgl from 'mapbox-gl';
import { colombiaRegions, type MacroRegion } from '../data/regions';

/**
 * Carga el GeoJSON de macroregiones y lo añade como fuente al mapa
 */
export function loadRegionsGeoJSON(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoadedRef: React.MutableRefObject<boolean>
) {
  if (!mapRef.current || !mapLoadedRef.current) return;
  const map = mapRef.current;

  try {
    // Comprobar si la fuente ya existe
    if (map.getSource('macroregiones')) {
      if (map.getLayer('regiones-fill')) {
        console.log("GeoJSON de macroregiones ya cargado, capas existentes");
        return;
      } else {
        // La fuente existe pero las capas no
        console.log("Fuente existente, recreando capas");
        createRegionLayers(map);
        return;
      }
    }

    // Cargar el archivo GeoJSON
    fetch('/macroregiones.json')
      .then(response => response.json())
      .then(geojsonData => {
        try {
          // Añadir fuente
          map.addSource('macroregiones', {
            type: 'geojson',
            data: geojsonData
          });

          // Crear las capas usando función compartida
          createRegionLayers(map);
          
          console.log('GeoJSON de macroregiones cargado correctamente');
        } catch (error) {
          console.warn('Error al añadir capas de regiones:', error);
        }
      })
      .catch(error => {
        console.error('Error al cargar el GeoJSON de macroregiones:', error);
      });
  } catch (error) {
    console.warn('Error al verificar capas de regiones:', error);
  }
}

/**
 * Función auxiliar para crear capas de regiones
 */
function createRegionLayers(map: mapboxgl.Map) {
  try {
    // Añadir capa de relleno para las regiones con opacidad basada en zoom
    if (!map.getLayer('regiones-fill')) {
      map.addLayer({
        id: 'regiones-fill',
        type: 'fill',
        source: 'macroregiones',
        layout: {},
        paint: {
          'fill-color': [
            'match',
            ['get', 'name'],
            'pacifico', '#57CACC',
            'amazonia', '#6BD88B',
            'andina', '#D4A76A',
            'caribe', '#F9B45C',
            'orinoquia', '#D76D6D',
            'rgba(255, 255, 255, 0.2)' // color por defecto
          ],
          // Opacidad que disminuye automáticamente con el zoom
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.3,    // Zoom 7 o menos: opacidad 0.3
            10, 0.05   // Zoom 10 o más: opacidad 0.05
          ],
          'fill-outline-color': 'rgba(255, 255, 255, 0.5)'
        }
      });
    }

    // Añadir capa de contorno para las regiones con grosor y opacidad basados en zoom
    if (!map.getLayer('regiones-boundary')) {
      map.addLayer({
        id: 'regiones-boundary',
        type: 'line',
        source: 'macroregiones',
        layout: {},
        paint: {
          'line-color': 'rgba(255, 255, 255, 0.7)',
          // Grosor de línea que disminuye con el zoom
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,      // Zoom 7 o menos: grosor 1
            10, 0.2    // Zoom 10 o más: grosor 0.2
          ],
          // Opacidad que disminuye con el zoom
          'line-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.7,     // Zoom 7 o menos: opacidad 0.7
            10, 0.2     // Zoom 10 o más: opacidad 0.2
          ]
        }
      });
    }

    // Eliminar listeners anteriores para evitar duplicados
    map.off('mouseenter', 'regiones-fill');
    map.off('mouseleave', 'regiones-fill');

    // Añadir interactividad
    map.on('mouseenter', 'regiones-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'regiones-fill', () => {
      map.getCanvas().style.cursor = '';
    });
  } catch (error) {
    console.error('Error al crear capas de regiones:', error);
  }
}

/**
 * Variable para almacenar la región actualmente resaltada
 */
export let currentHighlightedRegion: string | null = null;

/**
 * Resalta una región específica en el mapa
 */
export function highlightRegion(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  regionName: string | null
) {
  if (!mapRef.current) return;
  const map = mapRef.current;
  
  if (!map.getLayer('regiones-fill')) return;
  
  if (regionName) {
    // Actualizar la región actualmente resaltada
    currentHighlightedRegion = regionName;
    
    // Filtrar para mostrar solo la región seleccionada
    map.setFilter('regiones-fill', ['==', ['get', 'name'], regionName.toLowerCase()]);
    map.setFilter('regiones-boundary', ['==', ['get', 'name'], regionName.toLowerCase()]);
    
    // Configurar la opacidad variable en función del zoom - SIEMPRE se aplica en todos los modos
    map.setPaintProperty('regiones-fill', 'fill-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      6, 0.6,    // Zoom 6 o menos: opacidad alta para resaltar
      8, 0.4,    // Zoom 8: opacidad media
      10, 0.1    // Zoom 10 o más: opacidad muy baja
    ]);
    
    map.setPaintProperty('regiones-boundary', 'line-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      6, 1.0,    // Zoom 6 o menos: opacidad alta para resaltar
      8, 0.7,    // Zoom 8: opacidad media
      10, 0.3    // Zoom 10 o más: opacidad baja
    ]);
    
    map.setPaintProperty('regiones-boundary', 'line-width', [
      'interpolate',
      ['linear'],
      ['zoom'],
      6, 2,      // Zoom 6 o menos: línea gruesa
      8, 1.5,    // Zoom 8: línea media
      10, 0.5    // Zoom 10 o más: línea delgada
    ]);
  } else {
    // Si se desactiva el resaltado, reset completo
    currentHighlightedRegion = null;
    
    // Mostrar todas las regiones con opacidad normal
    map.setFilter('regiones-fill', null);
    map.setFilter('regiones-boundary', null);
    
    // Restablecer opacidad variable por zoom - SIEMPRE se aplica en todos los modos 
    map.setPaintProperty('regiones-fill', 'fill-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 0.3,    // Zoom 7 o menos: opacidad 0.3
      10, 0.05   // Zoom 10 o más: opacidad 0.05
    ]);
    
    map.setPaintProperty('regiones-boundary', 'line-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 0.7,     // Zoom 7 o menos: opacidad 0.7
      10, 0.2     // Zoom 10 o más: opacidad 0.2
    ]);
    
    map.setPaintProperty('regiones-boundary', 'line-width', [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 1,      // Zoom 7 o menos: grosor 1
      10, 0.2    // Zoom 10 o más: grosor 0.2
    ]);
  }
}

/**
 * Esta función ya no es necesaria ya que el comportamiento está integrado directamente en
 * las capas del mapa y en la función highlightRegion utilizando expresiones de interpolación
 * nativas de Mapbox GL JS ('interpolate').
 * 
 * Mantenemos una función vacía para compatibilidad con el código existente.
 */
export function setupZoomBasedHighlighting(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>
) {
  // No hace nada, el comportamiento está integrado en las expresiones de opacidad
  return;
}

/**
 * Función para convertir región de colombiaRegions a nombre para el GeoJSON
 */
export function getRegionNameForGeoJSON(macroRegion: MacroRegion): string {
  const regionMapping: Record<MacroRegion, string> = {
    pacifico: 'pacifico',
    amazonia: 'amazonia',
    andina: 'andina',
    caribe: 'caribe',
    orinoquia: 'orinoquia'
  };
  
  return regionMapping[macroRegion] || macroRegion;
}

/**
 * Función para restablecer cualquier resaltado de regiones
 * Útil cuando cambiamos de modo o queremos limpiar el mapa
 */
export function resetRegionHighlighting(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>
) {
  if (!mapRef.current) return;
  const map = mapRef.current;
  
  if (!map.getLayer('regiones-fill')) {
    console.log('resetRegionHighlighting: capa regiones-fill no existe, recreando capas...');
    
    // Si las capas no existen, intentamos cargar el GeoJSON y crear las capas
    if (map.getSource('macroregiones')) {
      try {
        createRegionLayers(map);
      } catch (error) {
        console.error('Error al recrear capas de regiones:', error);
        return;
      }
    } else {
      // Si ni siquiera existe la fuente, intentamos cargar todo desde cero
      loadRegionsGeoJSON({ current: map }, { current: true });
      return;
    }
  }
  
  try {
    // Resetear el estado global
    currentHighlightedRegion = null;
    
    // Primero asegurarnos de que el color de relleno esté configurado correctamente
    map.setPaintProperty('regiones-fill', 'fill-color', [
      'match',
      ['get', 'name'],
      'pacifico', '#57CACC',
      'amazonia', '#6BD88B',
      'andina', '#D4A76A',
      'caribe', '#F9B45C',
      'orinoquia', '#D76D6D',
      'rgba(255, 255, 255, 0.2)' // color por defecto
    ]);
    
    // Quitar filtros para mostrar TODAS las regiones con sus colores
    map.setFilter('regiones-fill', null);
    map.setFilter('regiones-boundary', null);
    
    // Restablecer opacidad variable por zoom a los valores por defecto - SIEMPRE se aplica en todos los modos
    map.setPaintProperty('regiones-fill', 'fill-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 0.3,    // Zoom 7 o menos: opacidad 0.3
      10, 0.05   // Zoom 10 o más: opacidad 0.05
    ]);
    
    map.setPaintProperty('regiones-boundary', 'line-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 0.7,     // Zoom 7 o menos: opacidad 0.7
      10, 0.2     // Zoom 10 o más: opacidad 0.2
    ]);
    
    map.setPaintProperty('regiones-boundary', 'line-width', [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 1,      // Zoom 7 o menos: grosor 1
      10, 0.2    // Zoom 10 o más: grosor 0.2
    ]);
    
    console.log('Resaltado de regiones restablecido - TODAS las regiones son visibles ahora');
  } catch (error) {
    console.error('Error al restablecer regiones:', error);
  }
}