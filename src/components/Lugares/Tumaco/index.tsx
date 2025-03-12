// src/components/Lugares/Tumaco/index.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Importar imágenes como recursos estáticos
import guardianes from "./assets/guardianes-Cht_TaET.png";
import guardianesWhite from "./assets/guardianes_white-fFc-3HNg.png";
import logoGov from "./assets/logoGov-BjUkN4y4.png";
import logoMuseoWhite from "./assets/logoMuseo_white-BCWvtNva.png";
import mapIcon from "./assets/map-BwVuyPF2.png";
import fondoHistoria from "./assets/fondoHistoria-D56AINpP.png";

// Importar imágenes de capturas de pantalla
import imagenPrincipal from "./assets/Captura de pantalla 2024-10-21 125000.png";
// import imagenInfoLeft from "./assets/Captura de pantalla 2024-10-21 125445.png";
import imagenUbicacion from "./assets/image (1).png";
import imagenGaleria1 from "./assets/Captura de pantalla 2024-10-29 144059.png";
import imagenGaleria2 from "./assets/Captura de pantalla 2024-10-29 144440.png";
import imagenGaleria3 from "./assets/Captura de pantalla 2024-12-25 185915.png";
import imagenGrid1 from "./assets/Captura de pantalla 2024-10-21 130532.png";
import imagenGrid2 from "./assets/Captura de pantalla 2024-10-21 125020.png";
import imagenGrid3 from "./assets/Captura de pantalla 2024-10-21 125411.png";
import imagenGrid4 from "./assets/Captura de pantalla 2024-10-21 124512.png";
import imagenGrid5 from "./assets/Captura de pantalla 2024-10-21 124639.png";
import imagenSocial from "./assets/imagen_2024-12-23_142214243.png";
import { MapPin } from "lucide-react";

// No necesitamos props con React Router
const TumacoPage: React.FC = () => {
  const navigate = useNavigate();
  const [guardianesOpen, setGuardianesOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [textSize, setTextSize] = useState("normal");
  const [contrast, setContrast] = useState("normal");

  // Alternar panel de guardianes
  const toggleGuardianes = () => {
    setGuardianesOpen(!guardianesOpen);
  };

  // Cambiar de diapositiva en la galería
  const changeSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Funciones de accesibilidad
  const increaseTextSize = () => {
    setTextSize("large");
  };

  const decreaseTextSize = () => {
    setTextSize("small");
  };

  const toggleContrast = () => {
    setContrast(contrast === "normal" ? "high" : "normal");
  };

  return (
    <div
      className={`flex flex-col flex-grow ${
        contrast === "high" ? "filter invert" : ""
      }`}
    >
      {/* Barra de navegación superior */}
      {/* <div className="fixed z-[100]">
        <header className="bg-[#3366CC] w-screen text-white flex justify-between items-center relative h-[48px] z-10">
          <img src={logoGov} alt="Logo" className="h-[24px] pl-4" />
        </header>
      </div> */}

      {/* Breadcrumb */}
      <div className="fixed w-screen bg-gray-800/50 backdrop-blur-md text-white flex justify-start items-center mt-[48px] h-7 md:pl-5 pl-2 z-[100]">
        <MapPin size="16" color="white" />
        <p className="md:text-xs text-[11px] font-bold pl-2">Usted está en</p>
        <div className="flex items-center space-x-2 pl-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
          <span className="md:text-xs text-[11px] font-semibold text-white">
            Región Pacífico
          </span>
          <span className="md:text-xs text-[11px] font-semibold">&gt;</span>
          <span className="md:text-xs text-[11px] font-semibold text-orange px-1 rounded">
            Casa de la Memoria del Pacífico Nariñense
          </span>
        </div>
      </div>

      {/* Botón de Guardianes */}
      <div className="relative z-[101]">
        {/* <button
          onClick={toggleGuardianes}
          className="flex items-center justify-center bg-orange fixed z-[1000] top-[76px] right-0 md:w-[62px] w-[50px] md:h-[58px] h-[45px] rounded-l-lg transition-all duration-300 ease-in-out z-[1000]"
        >
          <img src={guardianes} alt="botón" className="w-[80%] h-auto" />
        </button> */}

        {/* Panel de Guardianes */}
        {/* <motion.div
          className="fixed top-[76px] right-0 md:w-[360px] w-[250px] h-[100%] bg-[#2C2C2C] 2xl:p-[60px] lg:p-14 flex flex-col 2xl:justify-center lg:justify-start md:justify-center items-center md:px-0 px-4 md:py-0 py-10 z-[100]"
          initial={{ x: "100%" }}
          animate={{ x: guardianesOpen ? 0 : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={guardianesWhite}
            alt="logo"
            className="2xl:w-[80%] lg:w-[70%] h-auto 2xl:mb-4 lg:mb-0"
          />
          <h2 className="text-orange text-center font-medium text-2xl mt-0">
            Guardianes de memoria
          </h2>
          <p className="text-white text-center font-light md:text-lg text-sm mt-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="bg-orange text-black font-bold px-5 py-2 text-sm rounded-lg 2xl:mt-12 lg:mt-7 mt-5">
            QUIERO SER GUARDIAN
          </button>
        </motion.div> */}
      </div>

      {/* Gradiente y logo inferior */}
      <div
        className="fixed justify-end w-screen content-end h-[100vh] z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 25%)",
          pointerEvents: "none",
        }}
      >
        <img
          src={logoMuseoWhite}
          alt="Logo"
          className="w-[35%] md:w-[15%] ml-5 md:ml-10 mb-8 md:mb-8"
        />
      </div>

      {/* Botón para regresar al mapa usando React Router */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-4 bg-orange text-black font-bold px-4 py-2 rounded-lg z-[1000]"
      >
        ← Volver al mapa
      </button>

      {/* Botón de mapa */}
      <button className="flex md:w-[52px] md:h-[51px] h-[45px] w-[51px] items-center justify-center bg-orange fixed z-[100] top-[76px] left-0 rounded-r-lg">
        <img src={mapIcon} alt="botón" className="w-[90%] h-auto" />
      </button>

      {/* Barra de accesibilidad */}
      {/* <div className="content-example-barra z-[1000]">
        <div className="barra-accesibilidad-govco">
          <button
            id="botoncontraste"
            className="icon-contraste"
            onClick={toggleContrast}
          >
            <span id="titlecontraste">Contraste</span>
          </button>
          <button
            id="botondisminuir"
            className="icon-reducir"
            onClick={decreaseTextSize}
          >
            <span id="titledisminuir">Reducir letra</span>
          </button>
          <button
            id="botonaumentar"
            className="icon-aumentar"
            onClick={increaseTextSize}
          >
            <span id="titleaumentar">Aumentar letra</span>
          </button>
        </div>
      </div> */}

      {/* Contenido principal */}
      <motion.div
        className="opacity-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Sección de héroe */}
        <div className="flex h-screen w-full relative">
          <img
            src={imagenPrincipal}
            alt="fondo"
            className="w-full h-full object-cover z-1"
          />
          <div className="absolute inset-0 bg-[#00000066] z-2"></div>
          <div className="flex flex-col justify-between items-center absolute w-full h-full z-5">
            <h1 className="text-center text-[32px] md:text-5xl font-bold text-white mt-auto mb-auto">
              Casa de la Memoria del Pacífico Nariñense
            </h1>
            <div className="pb-14">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATHSURBVHgBzVrRdds2FL2knX7rN2naQ09gZYLaE8SZwNIEaSaIM0HdCURN4HiCqBNYniA8bd30r/5OarLvUpD6CAIkBVK27jk8FEERxAXee3i4YISB8GWGpIjxuigwlkseI3WskUVyPBS4PYxx85Dj9uUUSwyACD3AxiPGeV5gIpcJwpDJ89eHwOXzKTIEIojIHzOcHER4XwAnGBZpXOBDCKGtiJTmE+EXIXC2xWOZOSfojq0JdSby9xxvxbYvULV5jXs5PoqP/Cbn5TchcDQtyzb4PMPo2YoQfegkivAT/ASzOMLF83PM0QGdiPyVlqPws+uelC+k8R9+mGKBANBMpRETIXUOdwMvX0zwrq2eRiLswe8ifMKqByvoS8AGzfYBuPAQWn4tcGqPsIaXSAOJezGx6Y9TfMQO8OesHJ33qJtcI5nYV6GHxFKc8NWuSBAyr9DRT/ku69bYtMkJJxH6BCwSYkZz9kifWN8VfMf3E7ziO61bY9O2GmqmZYZ2pstYofTUBE8AaU9q+01U4N2LKS4rZfqCDpevhi9RxUv2Dp4IHl+9p4lr66iYFqMGqiQyeeANnhB0btMG7eQjTsz6f5sRMaPxWd+UCWnSdULaNX6f4UzSoitdJjna6Tr8b0bEjIZGui8kCEZK6fWFLjtYhekSJRGOhu1QzHWwZ3iw2sSktczAYYj8W08/0scIs9uCZmSPirR9wnNJRHzhtb6ZF/tjUjbsUYmNJUUSp8diVjfqHiejI+wx7lL8A5WFixsccUTsNGTRUg++zHEuld0wxmMgsC7Wybrb/isT9LW+lkB1JmSqRGSoFk2V8EVieilM7jMEGT3pse4OZBb6QizqOJYQdqwLKQj4nubawZBYozcZ18zNd/BdDY/VEkqOSKJLvsEfrRg1XIlcKBnfUoHvaFrnONo4oo8kuqRp8UIweRyCTBOJtgTV0caRncZn6IC+ZPqQ8LR1FCMQoWQGIlEDiehhSrAFtiUzMIlEX9hEsK3TdiUzJAlHG7MakWcB0mcbmaHNyW5jUa6biuq8kTukny5oIrMDn7DruuWIVCaXg5X6FwQfGQzs2LA0Zyr78QFq0s4ZesBDZoMhhIzI6mxmI7FZd2SqfNSSHrTCR2YIEqZtiSrKuMdSziP2+kMvIUNhkxlKUopQrSM3mXApPriEB72w7wPqUjwPQcIpkMhahFa1UVFEwfukN264pBQV/BR7BIdYl8oicMof/6sojoU9JRjsCYwC6hVINkTMwr4SwcRXZmuV4ilhVB7bb1Ov0khNFZaiJzZ5NeSSNgT5SphLVFFmy1UVImRY1PUszs5OBfwxcJeWgrq9HL+w5arI9bDE6kv581ureONYjwGTn7EDJ7pcoumv4ga2DuffsbpLS4nItdHzZtfinQmzV673+3YGvAurr55dI247dJFsQsFImUfuTjRtciJ4MxQ9NvddaPkIIXwz1HqJy2fWSPMW1aOl7savKHw+YaMTEaJht3WNTI4FBT5mo20fDJgMlhOu9wMERtCX1habD52JEC174T5k5px0fYATM+e0nXzCoRFIqBV9PkIIIrIGCXFvxWxLJAgDP3OaH/bck+lFRIPbE3IaFyv7P45WxBL1l3t1LOU/yyjH9VBR7z9A6lmwMv4jNQAAAABJRU5ErkJggg=="
                alt="logo"
                className="w-[60px]"
              />
            </div>
          </div>
        </div>

        {/* Sección de información */}
        <div className="flex flex-col md:flex-row h-auto md:h-screen w-full pb-5 md:pb-0 dark:bg-gray-900 dark:text-gray-100">
          <div className="w-full md:w-1/2 flex items-center justify-center p-4 order-1 md:order-none">
            {/* <img
              src={imagenInfoLeft}
              alt="Left Side"
              className="max-h-full max-w-full object-contain dark:filter dark:brightness-75"
            /> */}
          </div>
          <div className="w-full md:w-1/2 relative flex flex-col justify-center pl-8 order-2 md:order-none">
            <div className="relative flex flex-col items-start">
              <div
                className="absolute bg-black dark:bg-gray-500 left-[22px] md:top-[calc(6%)] top-[calc(6%)] block md:-[140px]"
                style={{ width: "4px", height: "440px" }}
              ></div>

              {/* Elemento de información 1 */}
              <div className="flex items-center mb-10 last:mb-0 dark:text-gray-100">
                <div className="relative flex items-start justify-center w-12 h-12">
                  <div className="h-6 w-6 bg-orange rounded-full dark:bg-orange-400"></div>
                </div>
                <div className="flex flex-col pl-14 ml-6">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAdCAYAAAC0T3x2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgB3VbdUcJAEP5OUXnER8Y/6EA7gA60AkgHdGCogLGCYAdYgdCBHXAz4vjKo8NA1u9icEjMJSEQHvxmMneXXPbL7n27G3wMIbMhXlEyjnAgHIyosrlgCAcKuEd+zBeCdtPBPGtjhAiCcyg04sbCKwm1Kq+U5xaiGIEveLhyMMYeYCU6UuhddDF+99BiOBu2fQLoPB8TIfKBkRLogEgwmXqokTBV+iLocxhjG6JrByMOo8179KhPshubAXr0hhywqo4etetOEBYXe0Cq6j49NERhIDlUlQaG96mSuWm7vEqCvnTglF4ZeL6uGSMekbnLobtem9BhN+h6B89/iIzhZZgzy1BNguIJy7OZrOcRohXg0tWOmVcFTaM6TtvYA1LFYBL2lKpDAawEL2FeZhOZgulvnNk2OEFQMX5RlurmX7Hcs9a6BTeGLaAIajTc4+gmEsVrHc8IFSkmBhrWsbUdpnNS8hoFYcS07r6pRCavfIUpCuLsJweDiJRagpjsLdM4M4nChNXYAccKj5lEwVfxvwE5m1vi+/Rq5uE2s02w0BqSO+yI//en+g252oDF4b2FYwAAAABJRU5ErkJggg=="
                    alt="Icon 1"
                    className="h-8 w-8 mb-2 dark:filter dark:brightness-75"
                  />
                  <div className="text-black text-[14px] mb-1 text-left dark:text-gray-300">
                    Año de creación
                  </div>
                  <div className="text-black text-[24px] text-left dark:text-gray-100">
                    2012
                  </div>
                </div>
              </div>

              {/* Elemento de información 2 */}
              <div className="flex items-center mb-10 last:mb-0 dark:text-gray-100">
                <div className="relative flex items-start justify-center w-12 h-12">
                  <div className="h-6 w-6 bg-orange rounded-full dark:bg-orange-400"></div>
                </div>
                <div className="flex flex-col pl-14 ml-6">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAdCAYAAAC0T3x2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgB3VbdUcJAEP5OUXnER8Y/6EA7gA60AkgHdGCogLGCYAdYgdCBHXAz4vjKo8NA1u9icEjMJSEQHvxmMneXXPbL7n27G3wMIbMhXlEyjnAgHIyosrlgCAcKuEd+zBeCdtPBPGtjhAiCcyg04sbCKwm1Kq+U5xaiGIEveLhyMMYeYCU6UuhddDF+99BiOBu2fQLoPB8TIfKBkRLogEgwmXqokTBV+iLocxhjG6JrByMOo8179KhPshubAXr0hhywqo4etetOEBYXe0Cq6j49NERhIDlUlQaG96mSuWm7vEqCvnTglF4ZeL6uGSMekbnLobtem9BhN+h6B89/iIzhZZgzy1BNguIJy7OZrOcRohXg0tWOmVcFTaM6TtvYA1LFYBL2lKpDAawEL2FeZhOZgulvnNk2OEFQMX5RlurmX7Hcs9a6BTeGLaAIajTc4+gmEsVrHc8IFSkmBhrWsbUdpnNS8hoFYcS07r6pRCavfIUpCuLsJweDiJRagpjsLdM4M4nChNXYAccKj5lEwVfxvwE5m1vi+/Rq5uE2s02w0BqSO+yI//en+g252oDF4b2FYwAAAABJRU5ErkJggg=="
                    alt="Icon 2"
                    className="h-8 w-8 mb-2 dark:filter dark:brightness-75"
                  />
                  <div className="text-black text-[14px] mb-1 text-left dark:text-gray-300">
                    Tipo de Lugar de Memoria
                  </div>
                  <div className="text-black text-[24px] text-left dark:text-gray-100">
                    Casa
                  </div>
                </div>
              </div>

              {/* Elemento de información 3 */}
              <div className="flex items-center mb-10 last:mb-0 dark:text-gray-100">
                <div className="relative flex items-start justify-center w-12 h-12">
                  <div className="h-6 w-6 bg-orange rounded-full dark:bg-orange-400"></div>
                </div>
                <div className="flex flex-col pl-14 ml-6">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAdCAYAAAC0T3x2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgB3VbdUcJAEP5OUXnER8Y/6EA7gA60AkgHdGCogLGCYAdYgdCBHXAz4vjKo8NA1u9icEjMJSEQHvxmMneXXPbL7n27G3wMIbMhXlEyjnAgHIyosrlgCAcKuEd+zBeCdtPBPGtjhAiCcyg04sbCKwm1Kq+U5xaiGIEveLhyMMYeYCU6UuhddDF+99BiOBu2fQLoPB8TIfKBkRLogEgwmXqokTBV+iLocxhjG6JrByMOo8179KhPshubAXr0hhywqo4etetOEBYXe0Cq6j49NERhIDlUlQaG96mSuWm7vEqCvnTglF4ZeL6uGSMekbnLobtem9BhN+h6B89/iIzhZZgzy1BNguIJy7OZrOcRohXg0tWOmVcFTaM6TtvYA1LFYBL2lKpDAawEL2FeZhOZgulvnNk2OEFQMX5RlurmX7Hcs9a6BTeGLaAIajTc4+gmEsVrHc8IFSkmBhrWsbUdpnNS8hoFYcS07r6pRCavfIUpCuLsJweDiJRagpjsLdM4M4nChNXYAccKj5lEwVfxvwE5m1vi+/Rq5uE2s02w0BqSO+yI//en+g252oDF4b2FYwAAAABJRU5ErkJggg=="
                    alt="Icon 3"
                    className="h-8 w-8 mb-2 dark:filter dark:brightness-75"
                  />
                  <div className="text-black text-[14px] mb-1 text-left dark:text-gray-300">
                    Red a la que pertenece
                  </div>
                  <div className="text-black text-[24px] text-left dark:text-gray-100">
                    Coalición por la Memoria, la Cultura y la Paz
                  </div>
                </div>
              </div>

              {/* Elemento de información 4 */}
              <div className="flex items-center mb-10 last:mb-0 dark:text-gray-100">
                <div className="relative flex items-start justify-center w-12 h-12">
                  <div className="h-6 w-6 bg-orange rounded-full dark:bg-orange-400"></div>
                </div>
                <div className="flex flex-col pl-14 ml-6">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAdCAYAAAC0T3x2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgB3VbdUcJAEP5OUXnER8Y/6EA7gA60AkgHdGCogLGCYAdYgdCBHXAz4vjKo8NA1u9icEjMJSEQHvxmMneXXPbL7n27G3wMIbMhXlEyjnAgHIyosrlgCAcKuEd+zBeCdtPBPGtjhAiCcyg04sbCKwm1Kq+U5xaiGIEveLhyMMYeYCU6UuhddDF+99BiOBu2fQLoPB8TIfKBkRLogEgwmXqokTBV+iLocxhjG6JrByMOo8179KhPshubAXr0hhywqo4etetOEBYXe0Cq6j49NERhIDlUlQaG96mSuWm7vEqCvnTglF4ZeL6uGSMekbnLobtem9BhN+h6B89/iIzhZZgzy1BNguIJy7OZrOcRohXg0tWOmVcFTaM6TtvYA1LFYBL2lKpDAawEL2FeZhOZgulvnNk2OEFQMX5RlurmX7Hcs9a6BTeGLaAIajTc4+gmEsVrHc8IFSkmBhrWsbUdpnNS8hoFYcS07r6pRCavfIUpCuLsJweDiJRagpjsLdM4M4nChNXYAccKj5lEwVfxvwE5m1vi+/Rq5uE2s02w0BqSO+yI//en+g252oDF4b2FYwAAAABJRU5ErkJggg=="
                    alt="Icon 4"
                    className="h-8 w-8 mb-2 dark:filter dark:brightness-75"
                  />
                  <div className="text-black text-[14px] mb-1 text-left dark:text-gray-300">
                    Colectivo / Organización gestora
                  </div>
                  <div className="text-black text-[24px] text-left dark:text-gray-100">
                    Pastoral Social de Diócesis de Tumaco
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de ubicación */}
        <div className="flex flex-col md:flex-row h-auto md:h-screen w-full">
          <div className="w-full md:w-1/2 flex items-center justify-center bg-[#5A5A5A] dark:bg-gray-700 order-1 md:order-none p-4">
            <img
              src={imagenUbicacion}
              alt="Left Side"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center pl-6 md:pl-14 bg-[#2C2C2C] dark:bg-gray-900 order-2 md:order-none py-8 md:py-0">
            <div className="flex items-center space-x-5 mb-10 ml-6 md:ml-14">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAA2CAMAAABz93A5AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJlQTFRFAAAA358A5J8A5aAA5aAA5aAA5aAA5qAA458A4p8A458A558A5qAA56EA5J8A5aAA5J8A5p8A5aAA5aAA5aAA5aAA5aAA5aAA5aAA5aAA5aAA5aAA458A5aAA5aAA5aAA5aAA5aAA5aAA5aAA5aAA5aAA5aAA4p8A5aAA5aAA5KAA5Z8A5aAA5J8A5aAA5aAA56EA5aAA5qEAvkj2fgAAADN0Uk5TABBgn8/f/7+QUEAgr38w76Bw+KhfMgsPL7Uhu4CGiIe4AbbzHB2nYFcnv7CvcLO9X7lv9CxkLQAAAelJREFUeJyNlelOAjEQgGfILndQYyJKxBNEUeP7v4XRRMX7ICoaQ6IsKrDWPbrttNtdmD8004+5O4tABQMBYBnEH6bckHPRVa7cvGPiimP6H52M7rA00ilfcl8qVxrFjIWSdRjhKvhtxgD+wqAx1ZoEcRrmZeNybn6Yhnl2+gGXsYiuHJZ6wthA6AqfzOds4nURn/mphu9Cu9T1OGqu+kRMr70Sgwg52ayVByWu9RdpEEtjoa/hncJtYpef8Bel2zpea4k2P6JkbJRF2bgEXXbuhWkZ3tZFjNu95YcMzonObp/HuL0bfnAxK5QLvRhX7fNDY2ZuNr9NlF1Lz+NAVCOtLi3M/0XK8uKV7rYX1dnC4kR6OdG4IxHxCLEin0biHDTOlHmB5UeC1WWd2scIxDHAfs80p2A7CNRxMPcWC0TOvf+SvOqtvsEUsYY+h/YUjI1ne5ftY/7Ox6mYby7cG+kGfXN8v1iJa4ib4/sqLWVrKDm0EjdRsIXEniy4CVhh4lBO6TKVJf7UIy4hFRaVTMR12DFxtqNzRs+RV8oZPDPZKFKPmOcoV42Lta91CkZOq7ZLa6rcKJ8bNmFJHA2RBhfjQL76YJoSObAy4a+snJnj37DsANK5MBc1ByPnjxjLOrrWMJ+VRieGwT8QO6cyHUB45wAAAABJRU5ErkJggg=="
                alt="botón"
                className="h-8 w-7 md:h-11 md:w-10"
              />
              <p className="text-white dark:text-gray-100 text-[36px] md:text-[48px] font-bold">
                UBICACIÓN
              </p>
            </div>
            <div className="space-y-8 ml-6 md:ml-14">
              <div className="flex flex-col items-start">
                <div className="text-orange text-[14px] mb-1 text-left">
                  Departamento
                </div>
                <div className="text-white dark:text-gray-300 text-[24px] text-left">
                  Nariño
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-orange text-[14px] mb-1 text-left">
                  Ciudad
                </div>
                <div className="text-white dark:text-gray-300 text-[24px] text-left">
                  San Andres De Tumaco
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-orange text-[14px] mb-1 text-left">
                  Dirección
                </div>
                <div className="text-white dark:text-gray-300 text-[24px] text-left">
                  Calle del Comercio-Sector El Bucanero
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-orange text-[14px] mb-1 text-left">
                  Macrorregión
                </div>
                <div className="text-white dark:text-gray-300 text-[24px] text-left">
                  PACÍFICO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de historia */}
        <div className="relative flex h-screen w-full bg-[#D9D9D9] dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 justify-content content-center">
            <div className="text-[20px] leading-relaxed [column-fill:balance] md:columns-1 lg:columns-2 xl:columns-3 gap-8">
              <h1 className="text-4xl font-bold mb-10 break-inside-avoid text-gray-800 dark:text-gray-100">
                SU HISTORIA
              </h1>
              <p className="text-gray-800 dark:text-gray-200">
                La Casa de la Memoria del Pacífico Nariñense se encuentra
                ubicada en la Calle del Comercio, sector El Bucanero en el
                distrito de Tumaco, departamento de Nariño. Este municipio
                portuario se conoce como la Perla del Pacífico, es territorio de
                frontera con el Ecuador y posee ecosistemas marítimos, de
                manglar y de bosque tropical. Alberga comunidades étnicas,
                afrocolombianas e indígenas en su mayoría, que han sufrido
                históricamente los efectos del conflicto armado interno.
              </p>
            </div>
          </div>
          <img
            src={fondoHistoria}
            alt="Fondo Decorativo"
            className="absolute bottom-0 right-0 object-contain dark:filter dark:brightness-75"
          />
        </div>

        {/* Sección de experiencias */}
        <div className="relative flex flex-col items-center w-full p-14 h-auto md:h-screen dark:bg-gray-900">
          <h1 className="text-right text-[32px] md:text-[48px] font-bold text-gray-800 dark:text-gray-100 mb-6 w-full max-w-[1500px]">
            EXPERIENCIAS
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-[1300px] mt-8">
            {/* Aquí irían los elementos de experiencias */}
          </div>
        </div>

        {/* Carrusel de imágenes */}
        <div className="relative h-screen w-full overflow-hidden pt-14 mt-14 dark:bg-gray-900">
          <motion.div
            className="h-screen w-full flex flex-col transition-transform duration-500"
            animate={{ y: `-${currentSlide * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-screen w-full flex-shrink-0 flex items-center justify-center bg-gray-800 dark:bg-gray-900">
              <img
                src={imagenGaleria1}
                alt="Imagen 1"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-screen w-full flex-shrink-0 flex items-center justify-center bg-gray-800 dark:bg-gray-900">
              <img
                src={imagenGaleria2}
                alt="Imagen 2"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-screen w-full flex-shrink-0 flex items-center justify-center bg-gray-800 dark:bg-gray-900">
              <img
                src={imagenGaleria3}
                alt="Imagen 3"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                currentSlide === 0
                  ? "bg-orange border-orange"
                  : "bg-gray-300 border-gray-300 dark:bg-gray-600 dark:border-gray-600"
              } cursor-pointer`}
              onClick={() => changeSlide(0)}
            ></div>
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                currentSlide === 1
                  ? "bg-orange border-orange"
                  : "bg-gray-300 border-gray-300 dark:bg-gray-600 dark:border-gray-600"
              } cursor-pointer`}
              onClick={() => changeSlide(1)}
            ></div>
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                currentSlide === 2
                  ? "bg-orange border-orange"
                  : "bg-gray-300 border-gray-300 dark:bg-gray-600 dark:border-gray-600"
              } cursor-pointer`}
              onClick={() => changeSlide(2)}
            ></div>
          </div>
        </div>

        {/* Galería de cuadrícula */}
        <div className="relative h-screen overflow-hidden bg-white dark:bg-gray-900 mt-8">
          <div className="mx-auto h-full w-[90%] overflow-y-scroll relative custom-scroll">
            <div
              className="flex justify-between mb-4 gap-4"
              style={{ height: "70vh" }}
            >
              <div className="flex flex-col gap-4 w-1/3">
                <img
                  src={imagenGrid1}
                  alt=""
                  className="w-full object-cover"
                  style={{ height: "65%" }}
                />
                <img
                  src={imagenGrid2}
                  alt=""
                  className="w-full object-cover"
                  style={{ height: "35%" }}
                />
              </div>
              <div className="flex flex-col gap-4 w-1/3">
                <img
                  src={imagenGrid3}
                  alt=""
                  className="w-full object-cover"
                  style={{ height: "35%" }}
                />
                <img
                  src={imagenGrid4}
                  alt=""
                  className="w-full object-cover"
                  style={{ height: "65%" }}
                />
              </div>
              <div className="flex flex-col gap-4 w-1/3">
                <img
                  src={imagenGrid5}
                  alt=""
                  className="w-full object-cover"
                  style={{ height: "65%" }}
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>

        {/* Redes sociales */}
        <div className="relative flex flex-wrap justify-center h-[15vh] md:h-[20vh] items-center bg-[#3C3C3B] dark:bg-gray-800 gap-14 p-4">
          <a
            href="https://www.instagram.com/casamemoriatumaco"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <img
              src={imagenSocial}
              alt="Logo de https://www.instagram.com/casamemoriatumaco"
              className="h-8 w-8 md:h-12 md:w-12 object-contain"
            />
          </a>
        </div>

        {/* Footer */}
        <div className="govco-footer">
          <div className="govco-portales-contenedor grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="govco-footer-logo-portal flex items-center justify-center">
              <div className="govco-logo-container-portal flex items-center">
                <span className="govco-logo block w-auto h-60"></span>
                <span className="govco-separator border-l-2 h-10 border-gray-400"></span>
                <span className="govco-co block w-12 h-12"></span>
              </div>
            </div>
            <div className="govco-info-datos-portal">
              <div className="govco-separator-rows border-t-2 border-gray-400 mb-4"></div>
              <div className="govco-texto-datos-portal space-y-2">
                <p className="govco-text-header-portal-1 font-semibold text-lg">
                  Museo Virtual del Centro Nacional de Memoria Histórica
                </p>
                <p className="text-sm">
                  Dirección: <br className="govco-mostrar" />
                  Carrera 7 No 32-42 Pisos 30 y 31{" "}
                  <br className="govco-mostrar" />
                  Bogotá, Colombia.
                  <br />
                  Código Postal: 110421 <br />
                  <br className="govco-mostrar" />
                  Horario de atención:
                  <br className="govco-mostrar" />
                  Horario de atención: Lunes a viernes 08:00 a.m. - 05:00 p.m.
                </p>
              </div>
              <div className="govco-network extramt-network row mt-4">
                <div className="govco-iconContainer flex items-center">
                  <span className="icon-portal govco-twitter-square w-6 h-6"></span>
                  <a
                    href="https://twitter.com/CentroMemoriaH"
                    className="govco-link-portal text-sm"
                  >
                    @CentroMemoriaH
                  </a>
                </div>
                <div className="govco-iconContainer flex items-center">
                  <span className="icon-portal govco-instagram-square w-6 h-6"></span>
                  <a
                    href="https://www.instagram.com/centromemoriah/"
                    className="govco-link-portal text-sm"
                  >
                    @CentroMemoriaH
                  </a>
                </div>
                <div className="govco-iconContainer flex items-center">
                  <span className="icon-portal govco-facebook-square w-6 h-6"></span>
                  <a
                    href="https://web.facebook.com/CentroMemoriaH"
                    className="govco-link-portal text-sm"
                  >
                    @CentroMemoriaH
                  </a>
                </div>
              </div>
            </div>
            <div className="govco-info-telefonos">
              <div className="govco-separator-rows border-t-2 border-gray-400 mb-4"></div>
              <div className="govco-texto-telefonos space-y-2">
                <p className="govco-text-header-portal-1 font-semibold text-lg flex items-center space-x-2 mb-4 md:mb-0">
                  <span className="govco-phone-alt w-6 h-6"></span>
                  <span>Contacto</span>
                </p>
                <p className="text-sm">
                  Teléfono <br className="govco-mostrar" />
                  conmutador: <br className="govco-mostrar-inv" />
                  +57(601) 7965060
                  <br />
                  Línea gratuita: +57(601) 7965060 <br />
                  Correo institucional: <br />
                  radicacion@cnmh.gov.co Correo de notificaciones judiciales:{" "}
                  <br />
                  notificaciones@cnmh.gov.co
                </p>
              </div>
              <div className="govco-links-portal-container mt-4">
                <a
                  className="govco-link-portal text-blue-600 hover:underline"
                  href="https://centrodememoriahistorica.gov.co/politicas-lineamientos-y-manuales/"
                >
                  Políticas
                </a>
                <a
                  className="govco-link-portal text-blue-600 hover:underline"
                  href="https://centrodememoriahistorica.gov.co/mapa-de-sitio/"
                >
                  Mapa del sitio
                </a>
                <a
                  className="govco-link-portal text-blue-600 hover:underline"
                  href="https://centrodememoriahistorica.gov.co/terminos-y-condiciones/"
                >
                  Términos y condiciones
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TumacoPage;
