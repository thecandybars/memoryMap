// src/components/RadialMenu/config.ts
export const MENU_CONFIG = {
    dimensions: {
        viewBox: {
            width: 600,
            height: 600,
            center: 300
        },
        rings: {
            memory: {
                outer: 250,
                inner: 195
            },
            department: {
                outer: 185,
                inner: 130
            },
            macro: {
                outer: 120,
                inner: 70
            },
            center: 60
        },
        // Dimensiones específicas para móvil (utilizadas en detección de viewport)
        mobile: {
            viewBox: {
                width: 300,
                height: 300,
                center: 150
            },
            rings: {
                memory: {
                    outer: 130,
                    inner: 105
                },
                department: {
                    outer: 95,
                    inner: 70
                },
                macro: {
                    outer: 60, 
                    inner: 40
                },
                center: 32
            }
        }
    },
    colors: {
        // Colores para macroregiones
        macro: {
            pacifico: {
                base: '#57CACC',
                hover: '#7DE4E6',
                gradientStart: '#57CACC',
                gradientEnd: '#188889',
                pulse: '#A7F0F2'
            },
            amazonia: {
                base: '#6BD88B',
                hover: '#96E8AE',
                gradientStart: '#6BD88B',
                gradientEnd: '#35974E',
                pulse: '#B1F2C4'
            },
            andina: {
                base: '#D4A76A',
                hover: '#E8C28A',
                gradientStart: '#D4A76A',
                gradientEnd: '#B07D3A',
                pulse: '#FFD7A0'
            },
            caribe: {
                base: '#F9B45C',
                hover: '#FFC785',
                gradientStart: '#F9B45C',
                gradientEnd: '#D97A1F',
                pulse: '#FFD4A0'
            },
            orinoquia: {
                base: '#D76D6D',
                hover: '#F79090',
                gradientStart: '#D76D6D',
                gradientEnd: '#A33030',
                pulse: '#FFACAC'
            }
        },
        // Colores para tipos de memoria
        memory: {
            identificados: {
                base: '#FF9A3C',
                hover: '#FFAC61',
                gradientStart: '#FF9A3C',
                gradientEnd: '#D4721E'
            },
            caracterizados: {
                base: '#5B6EF5',
                hover: '#8390FF',
                gradientStart: '#5B6EF5',
                gradientEnd: '#3040C0'
            },
            solicitud: {
                base: '#5EC4CA',
                hover: '#7DDFE5',
                gradientStart: '#5EC4CA',
                gradientEnd: '#35999F'
            },
            horror: {
                base: '#D92D2D',
                hover: '#F05454',
                gradientStart: '#D92D2D',
                gradientEnd: '#A31515'
            },
            sanaciones: {
                base: '#6BD88B',
                hover: '#96E8AE',
                gradientStart: '#6BD88B',
                gradientEnd: '#35974E'
            }
        },
        // Colores para departamentos (gradientes basados en su macroregión)
        departments: {
            // Para departamentos sin asignación específica
            default: {
                base: '#999999',
                hover: '#BBBBBB',
                gradientStart: '#999999',
                gradientEnd: '#666666'
            }
        }
    },
    styles: {
        text: {
            macro: 'text-sm font-semibold uppercase',
            department: 'text-xs font-medium',
            memory: 'text-xs font-medium uppercase'
        }
    },
    animation: {
        pulse: {
            duration: 2,  // duración en segundos
            scale: 1.05    // escala máxima durante pulso
        },
        rotate: {
            speed: 0.04,   // velocidad de rotación en radianes
            direction: 1   // 1 = horario, -1 = antihorario
        }
    }
};
