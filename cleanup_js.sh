#\!/bin/bash

# Script para eliminar archivos .js que tienen una versión .tsx correspondiente
# Ejecutar desde el directorio raíz del proyecto

SRC_DIR="/Users/juancortes/Desktop/memory-map/src"
EXCLUDED_FILES=("$SRC_DIR/main.js")

# Buscar todos los archivos .js
find "$SRC_DIR" -type f -name "*.js" | while read js_file; do
    # Verificar si el archivo está en la lista de exclusión
    exclude=false
    for excluded in "${EXCLUDED_FILES[@]}"; do
        if [[ "$js_file" == "$excluded" ]]; then
            exclude=true
            break
        fi
    done

    if [ "$exclude" = true ]; then
        echo "Saltando archivo excluido: $js_file"
        continue
    fi

    # Crear la ruta al archivo .tsx correspondiente
    tsx_file="${js_file%.js}.tsx"
    
    # Verificar si existe el archivo .tsx
    if [ -f "$tsx_file" ]; then
        echo "Eliminando $js_file (tiene versión .tsx)"
        rm "$js_file"
    else
        echo "Manteniendo $js_file (no tiene versión .tsx)"
    fi
done

echo "Proceso completado."
