// src/components/demo/DemoGuide.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Globe, Map, Layers, Target, X, ArrowRight, HelpCircle, ChevronRightCircle } from 'lucide-react';

interface DemoGuideProps {
  currentSection: 'macro' | 'department' | 'memory' | 'center';
  currentStep: number;
  onSkipDemo: () => void;
}

const DemoGuide: React.FC<DemoGuideProps> = ({ 
  currentSection, 
  currentStep,
  onSkipDemo
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Información detallada para cada sección del menú radial
  const sectionInfo = {
    macro: {
      title: "Macroregiones",
      description: "Explora las 5 grandes regiones de Colombia: Andina, Caribe, Pacífico, Amazonía y Orinoquía.",
      icon: <Globe className="w-7 h-7 text-gray-300" strokeWidth={1.5} />,
      position: 1
    },
    department: {
      title: "Departamentos",
      description: "Descubre los departamentos dentro de cada macroregión y sus lugares de memoria histórica.",
      icon: <Map className="w-7 h-7 text-gray-300" strokeWidth={1.5} />,
      position: 2
    },
    memory: {
      title: "Tipos de Memoria",
      description: "Filtra por categorías como Caracterizados, Identificados, En Solicitud, y más.",
      icon: <Layers className="w-7 h-7 text-gray-300" strokeWidth={1.5} />,
      position: 3
    },
    center: {
      title: "Centro: Recorrido Guiado",
      description: "Inicia un tour guiado por los lugares más significativos de memoria histórica en Colombia.",
      icon: <Target className="w-7 h-7 text-gray-300" strokeWidth={1.5} />,
      position: 4
    }
  };

  // Obtener la información de la sección actual
  const currentInfo = sectionInfo[currentSection];

  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-xs z-50"
        >
          <div className="bg-black/30 backdrop-blur-xl 
            rounded-2xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden max-w-sm">
            {/* Cabecera */}
            <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center
                bg-gradient-to-r from-gray-700/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="bg-gray-400/30 backdrop-blur-sm w-8 h-8 rounded-full 
                  flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <span className="font-bold text-white text-sm">{currentInfo.position}</span>
                </div>
                <h3 className="text-white font-medium text-base">{currentInfo.title}</h3>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-white/60 hover:text-white rounded-full p-1.5 hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Contenido */}
            <div className="p-4 px-3">
              <div className="flex items-start gap-2">
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentInfo.description}
                </p>
              </div>
              
              {/* Solo indicador de pasos - sin botón de ir al mapa */}
              <div className="flex justify-center mt-4">
                <div className="flex gap-1.5">
                  {['macro', 'department', 'memory', 'center'].map((section) => (
                    <div 
                      key={section}
                      className={`h-1.5 rounded-full transition-all ${
                        section === currentSection 
                          ? 'w-6 bg-gray-300' 
                          : 'w-1.5 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="minimized"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(true)}
          className="z-50 bg-gradient-to-br from-gray-400 to-gray-500 
            hover:from-gray-500 hover:to-gray-600 p-3 rounded-full shadow-xl 
            transition-all duration-300 hover:scale-110"
          title="Mostrar guía"
        >
          <HelpCircle size={22} className="text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default DemoGuide;