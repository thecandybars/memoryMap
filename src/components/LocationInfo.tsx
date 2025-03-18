// src/components/LocationInfo.tsx
import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Info,
  MapPin,
  FileText,
  Calendar,
  Tag,
  MapIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface LocationInfoProps {
  title: string;
  description?: string;
  code?: string;
  region?: string;
  type?: string;
  onClose: () => void;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({
  title,
  description = "Este lugar forma parte de la red de sitios documentados por el Centro Nacional de Memoria Histórica como espacios significativos en la construcción de la memoria colectiva.",
  code,
  region = "Andina",
  type = "Lugar de Memoria",
  onClose,
}) => {
  console.log("🚀 ~ code:", code);
  const [activeTab, setActiveTab] = useState<string>("general");

  const navigate = useNavigate();

  const destination =
    code === "Casa de la Memoria de la Costa Pacífica Nariñense"
      ? "/tumaco"
      : code === "Museo Popular de Siloé"
      ? "/siloe"
      : code === "Paisajes de Memoria Bojayá"
      ? "/bojaya"
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, type: "tween" }}
      className="absolute top-20 left-0 z-50 max-w-lg w-full sm:w-auto md:max-w-lg motion-safe-transform"
    >
      <div className="bg-black/60 backdrop-blur-xl rounded-r-lg overflow-hidden border border-white/20 shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Header con difuminado */}
        <div className="relative overflow-hidden rounded-tr-lg bg-gradient-to-r from-black/60 to-black/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-20"></div>
          <div className="relative flex items-start p-6">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl text-white font-light mb-1">{title}</h2>
              <div className="flex items-center text-white/60 text-sm flex-wrap">
                <span className="mr-3">{type}</span>
                {code && (
                  <>
                    <span className="mr-3">•</span>
                    <span className="italic">{code}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-2 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-2 md:px-6 border-b border-white/10 overflow-x-auto whitespace-nowrap">
          <button
            className={`px-3 md:px-4 py-3 text-xs md:text-sm transition-colors ${
              activeTab === "general"
                ? "text-white border-b-2 border-white"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("general")}
          >
            Información General
          </button>
          <button
            className={`px-3 md:px-4 py-3 text-xs md:text-sm transition-colors ${
              activeTab === "ubicacion"
                ? "text-white border-b-2 border-white"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("ubicacion")}
          >
            Ubicación y Contexto
          </button>
          <button
            className={`px-3 md:px-4 py-3 text-xs md:text-sm transition-colors ${
              activeTab === "docs"
                ? "text-white border-b-2 border-white"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("docs")}
          >
            Documentación
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, type: "tween" }}
                className="space-y-4 motion-safe-transform"
              >
                <p className="text-white/80 text-sm leading-relaxed">
                  {description}
                </p>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={14} className="text-white/60" />
                    <span className="text-white/90 text-sm font-medium">
                      Características
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-white/60" />
                      <span className="text-white/80">Tipo: {type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-white/60" />
                      <span className="text-white/80">Documentado en 2020</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapIcon size={14} className="text-white/60" />
                      <span className="text-white/80">Región {region}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ubicacion" && (
              <motion.div
                key="ubicacion"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, type: "tween" }}
                className="space-y-4 motion-safe-transform"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2 bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-white/50 text-xs mb-1">Región</div>
                    <div className="text-white text-sm font-medium">
                      {region}
                    </div>
                  </div>
                  <div className="w-1/2 bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-white/50 text-xs mb-1">Tipo</div>
                    <div className="text-white text-sm font-medium">{type}</div>
                  </div>
                </div>

                <p className="text-white/80 text-sm leading-relaxed">
                  El entorno geográfico y social de este lugar contribuye
                  significativamente a su valor como espacio de memoria. La
                  ubicación tiene un significado histórico dentro del contexto
                  del conflicto armado y los procesos de construcción de paz en
                  Colombia.
                </p>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={14} className="text-white/60" />
                    <span className="text-white/90 text-sm font-medium">
                      Contexto territorial
                    </span>
                  </div>

                  <p className="text-white/80 text-xs leading-relaxed">
                    Esta zona ha sido afectada por diversos factores ambientales
                    y sociales que han impactado en la memoria colectiva de sus
                    habitantes. Las capas de información ambiental muestran
                    datos relevantes sobre estos impactos.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, type: "tween" }}
                className="space-y-4 motion-safe-transform"
              >
                <p className="text-white/70 text-sm mb-4">
                  La documentación asociada a este lugar de memoria incluye
                  informes, testimonios y registros históricos que ayudan a
                  preservar la memoria colectiva.
                </p>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <div className="flex items-center p-3 hover:bg-white/5 transition-colors">
                      <FileText className="w-4 h-4 mr-3 text-white/60" />
                      <div className="flex-grow">
                        <div className="text-white/90 text-sm">
                          Informe de caracterización
                        </div>
                        <div className="text-white/50 text-xs">
                          PDF · 2.4 MB · Creado 22/03/2020
                        </div>
                      </div>
                      <button className="text-white/60 hover:text-white/90 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <div className="flex items-center p-3 hover:bg-white/5 transition-colors">
                      <FileText className="w-4 h-4 mr-3 text-white/60" />
                      <div className="flex-grow">
                        <div className="text-white/90 text-sm">
                          Testimonios recolectados
                        </div>
                        <div className="text-white/50 text-xs">
                          PDF · 1.8 MB · Creado 15/04/2020
                        </div>
                      </div>
                      <button className="text-white/60 hover:text-white/90 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <div className="flex items-center p-3 hover:bg-white/5 transition-colors">
                      <FileText className="w-4 h-4 mr-3 text-white/60" />
                      <div className="flex-grow">
                        <div className="text-white/90 text-sm">
                          Registro fotográfico
                        </div>
                        <div className="text-white/50 text-xs">
                          ZIP · 12.7 MB · Creado 08/05/2020
                        </div>
                      </div>
                      <button className="text-white/60 hover:text-white/90 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <button className="bg-white/10 text-white/90 px-4 py-2 rounded text-sm hover:bg-white/20 transition-colors">
                    Ver todos los documentos
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center bg-gradient-to-r from-black/30 to-black/10">
          <div className="text-white/50 text-xs">
            Centro Nacional de Memoria Histórica
          </div>
          {destination && (
            <button
              onClick={() => navigate(destination)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded flex items-center space-x-1 transition-colors"
            >
              <span>Ver más</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
