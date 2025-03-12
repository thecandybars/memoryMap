// src/components/RadialMenu/helpers.ts

/**
 * Convierte un ángulo en grados + un radio a coordenadas cartesianas (x, y),
 * asumiendo el centro en (centerX, centerY).
 * 
 * @param radius   Radio del círculo donde quieres ubicar el punto
 * @param angleInDegrees  Ángulo en grados (0° = eje X positivo, sentido horario)
 * @param centerX  Coordenada X del centro (por defecto 300)
 * @param centerY  Coordenada Y del centro (por defecto 300)
 */
export function polarToCartesian(
  radius: number,
  angleInDegrees: number,
  centerX = 300,
  centerY = 300
) {
  // Ajuste: el ángulo 0° lo consideramos arriba (eje Y negativo) y crece en sentido horario
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  const x = centerX + radius * Math.cos(angleInRadians);
  const y = centerY + radius * Math.sin(angleInRadians);
  return { x, y };
}

/**
 * Genera el path SVG para dibujar un sector de anillo (arco exterior e interior).
 * Incluye un pequeño espacio entre sectores para evitar sobreposiciones.
 */
export function createArcPath(
  startAngle: number,
  endAngle: number,
  outerRadius: number,
  innerRadius: number,
  centerX = 300,
  centerY = 300
): string {
  // Añadir un pequeño margen entre sectores (reducir el ángulo de barrido)
  const margin = 1; // 1 grado de margen
  const adjustedStartAngle = startAngle + margin / 2;
  const adjustedEndAngle = endAngle - margin / 2;

  // Coordenadas del arco exterior
  const startOuter = polarToCartesian(outerRadius, adjustedStartAngle, centerX, centerY);
  const endOuter = polarToCartesian(outerRadius, adjustedEndAngle, centerX, centerY);

  // Coordenadas del arco interior (en orden inverso para cerrar el sector)
  const startInner = polarToCartesian(innerRadius, adjustedEndAngle, centerX, centerY);
  const endInner = polarToCartesian(innerRadius, adjustedStartAngle, centerX, centerY);

  // ¿Es mayor de 180°? => largeArcFlag = 1
  const largeArcFlagOuter = (adjustedEndAngle - adjustedStartAngle) <= 180 ? 0 : 1;
  const largeArcFlagInner = (adjustedEndAngle - adjustedStartAngle) <= 180 ? 0 : 1;

  // Barrido en sentido horario => sweepFlag = 1
  // El arco interior lo dibujamos con sweepFlag = 0 (inverso)
  return `
    M ${startOuter.x},${startOuter.y}
    A ${outerRadius},${outerRadius} 0 ${largeArcFlagOuter} 1 ${endOuter.x},${endOuter.y}
    L ${startInner.x},${startInner.y}
    A ${innerRadius},${innerRadius} 0 ${largeArcFlagInner} 0 ${endInner.x},${endInner.y}
    Z
  `;
}

/**
 * Genera un path para colocar texto curvo (sin grosor, sólo el arco).
 * Útil para usar <textPath> con startOffset="50%" y textAnchor="middle".
 * También ajustamos los ángulos para alinear con los sectores y evitar sobreposiciones.
 */
export function createTextArcPath(
  startAngle: number,
  endAngle: number,
  radius: number,
  centerX: number,
  centerY: number
): string {
  // Añadir un pequeño margen entre sectores, igual que en createArcPath
  const margin = 1; // 1 grado de margen
  const adjustedStartAngle = startAngle + margin / 2;
  const adjustedEndAngle = endAngle - margin / 2;
  
  const start = polarToCartesian(radius, adjustedStartAngle, centerX, centerY);
  const end = polarToCartesian(radius, adjustedEndAngle, centerX, centerY);

  const angleDiff = adjustedEndAngle - adjustedStartAngle;
  const largeArcFlag = angleDiff <= 180 ? 0 : 1;
  // Sentido horario => sweepFlag = 1
  const sweepFlag = 1;

  return `
    M ${start.x},${start.y}
    A ${radius},${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x},${end.y}
  `;
}

/**
 * Genera un ID de gradiente para macro o memory, por ejemplo:
 * "gradient-macro-pacifico".
 */
export function createGradientId(
  type: 'macro' | 'memory',
  id: string
) {
  return `gradient-${type}-${id}`;
}

/**
 * Objeto que agrupa todas las funciones anteriores
 */
export const radialHelpers = {
  polarToCartesian,
  createArcPath,
  createTextArcPath,
  createGradientId,
};