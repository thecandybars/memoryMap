import {
  MapPin,
  Calendar,
  School,
  Workflow,
  Library,
  ArrowBigLeftDash,
  ChevronDown,
  CalendarDays,
  Globe,
} from "lucide-react";
import React, { useState } from "react";
import imagenPrincipal from "./assets/portada.png";
import historia from "./assets/historia.png";
import historia2 from "./assets/historia2.png";
import fotoBasicData from "./assets/fotoBasicData.png";
import mapa from "./assets/mapa.png";
import foto01 from "./assets/foto01.png";
import foto02 from "./assets/foto02.png";
import foto03 from "./assets/foto03.png";
import foto04 from "./assets/foto04.png";
import foto05 from "./assets/foto05.png";
import foto06 from "./assets/foto06.png";
import { Link } from "react-router-dom";

export default function index() {
  const [contrast, setContrast] = useState("normal");
  const styles = {
    fotos: {
      padding: 8,
    },
  };
  // BREACRUMB
  const renderBreadcrumb = (
    <div className="fixed w-screen bg-gray-800/80 backdrop-blur-md text-white flex justify-start items-center h-8 md:pl-5 pl-2 z-[100]">
      <MapPin size="16" color="white" />
      <p className=" text-[13px] font-bold pl-2">Usted está en</p>
      <div className="flex items-center space-x-2 pl-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        <span className=" text-[13px] font-semibold text-white">
          Región Pacífico
        </span>
        <span className=" text-[13px] font-semibold">&gt;</span>
        <span className=" text-[13px] font-semibold text-orange px-1 rounded">
          Paisajes de Memoria Bojayá
        </span>
      </div>
      <Link
        to="/"
        className=" text-[13px] font-semibold flex justify-start items-center gap-1"
        style={{
          position: "absolute",
          right: "10px",
          display: "flex",
          textDecoration: "underline",
        }}
      >
        <ArrowBigLeftDash size="16" color="white" />
        Volver al mapa
      </Link>
    </div>
  );
  // PAGINA 2
  const iconStyle = { size: "36", color: "#3A938C" };
  const basicData = [
    {
      icon: <CalendarDays {...iconStyle} />,
      image: "/lugares/calendar.png",
      title: "Año de creación",
      value: "2004",
    },
    {
      icon: <School {...iconStyle} />,
      image: "/lugares/house.png",
      title: "Tipo de Lugar de Memoria",
      value:
        "Mixto ( Espacio ecológico / Santuario / Circuito / Parque / Monumento) ",
    },
    {
      icon: <Globe {...iconStyle} />,
      image: "/lugares/global.png",
      title: "Red a la que pertenece",
      value:
        "Distintos equipos del CNMH, la Fundación Carlos Pizarro con la recuperación de la iglesia, la OIM y la Unidad para las Víctimas.",
    },
    {
      icon: <Library {...iconStyle} />,
      image: "/lugares/handshake.png",
      title: "Colectivo / Organización gestora",
      value: "Comité por los Derechos de las Víctimas de Bojayá. Guayacán",
    },
  ];
  const renderCircle = (
    <div
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: "#3A938C",
        borderRadius: "50%",
        margin: "0 auto",
      }}
    />
  );
  const renderBasicData = basicData.map((data, index) => (
    <div
      className="grid grid-cols-[100px_50px_1fr]"
      key={data.title}
      style={{ width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: index === 0 ? "transparent" : "#fff",
            height: "10%",
            width: "2px",
          }}
        />
        {renderCircle}
        <div
          style={{
            backgroundColor: "#fff",
            height: "80%",
            width: "2px",
          }}
        />
      </div>
      <div>
        <img
          src={data.image}
          alt={data.title}
          style={{
            width: "36px",
            height: "36px",
            objectFit: "contain",
            marginTop: 8,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "12px 24px 32px",
          gap: "8px",
        }}
      >
        <p
          className="text-[16px] font-bold"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          {data.title}
        </p>
        <p
          className="text-[14px] bg-gray-800"
          style={{ borderRadius: "0px 20px 20px 0px", padding: "8px 24px" }}
        >
          {data.value}
        </p>
      </div>
    </div>
  ));

  // PAGINA 3
  const ubicacionData = [
    {
      title: "Departamento",
      value: "Chocó",
    },
    {
      title: "Ciudad",
      value: "Bojayá",
    },
    {
      title: "Dirección",
      value:
        "Circuito mixto. Viejo bella vista, Nuevo bellavista, Barrio 2 de Mayo.",
    },
    {
      title: "Macroregión",
      value: "Pacífico",
    },
  ];
  const renderUbicacionData = ubicacionData.map((data) => (
    <div className="flex flex-col gap-2" key={data.title}>
      <p className="text-[16px] " style={{ color: "#38938b" }}>
        {data.title}
      </p>
      <p
        className="text-[14px]  p-2 rounded-2xl"
        style={{
          color: "#fff",
          backgroundColor: "#8eada9",
          padding: "8px 24px",
        }}
      >
        {data.value}
      </p>
    </div>
  ));

  //IFRAME
  const [isIframeOpen, setIsIframeOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#38938b" }}>
      <div
        style={{
          position: "initial",
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderBreadcrumb}
        {/* PAGINA 1 */}
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imagenPrincipal})`,
            backgroundSize: "cover",
            position: "relative",
            height: "100vh",
            margin: "0 40px",

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            gap: "32px",
          }}
        >
          <h1
            // className="text-center text-[32px] md:text-5xl font-bold text-white mt-[20%] mb-auto"
            style={{ fontSize: "48px", fontWeight: "bold" }}
          >
            Paisajes de Memoria Bojayá
          </h1>
          <div
            style={{
              width: "50%",
              border: "2px solid white",
              padding: "32px",
              marginTop: "32px",
              borderRadius: "12px",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <p style={{ fontSize: "14px" }}>
              Desde el inicio del proceso de reubicación en el 2004 en el Nuevo
              Bellavista, la comunidad comienza a preocuparse por la
              conservación de la memoria asociada al sitio de memoria. La
              propuesta se consolida el 2016 con el documento "Atrato.
              Territorio de historias que construyen su memoria" documento
              redactado por el Comité por los Derechos de las Víctimas de Bojayá
              con el apoyo de las Agustinas Misioneras y el equipo de Enfoque
              diferencial étnico del Centro Nacional de Memoria Histórica.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ChevronDown />
            <ChevronDown />
            <ChevronDown />
            <ChevronDown />
          </div>
        </div>

        {/* PAGINA 2 */}
        <div
          className="text-white flex justify-space-between items-center p-5"
          style={{
            height: "100vh",
            backgroundColor: "#000",
            padding: "96px 0",
          }}
        >
          <img
            src={fotoBasicData}
            style={{ width: "50%", height: "100%", objectFit: "cover" }}
          />
          <div>{renderBasicData}</div>
        </div>
        {/* PAGINA 3 */}
        <div
          style={{
            height: "100vh",
            margin: "0 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            gap: "32px",
          }}
        >
          <div
            style={{
              width: "50%",
              backgroundColor: "white",
              height: "100%",
              color: "#38938b",
              padding: "32px",
              gap: "18px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{ display: "flex", alignItems: "center", gap: 8 }}
              className=" text-[24px] font-bold mt-[20%] gap-2"
            >
              <MapPin size="32px" color="#38938b" />
              Ubicación
            </h3>

            <p style={{ fontSize: "14px", color: "black", paddingLeft: 42 }}>
              El lugar se encuentra en regular de estado de conservación. La
              accesibilidad es sencilla porque está en la parte plana de la
              comuna veinte, la zona montañosa, y es un espacio muy comercial
              donde paso donde es un paso obligado para mucha gente que vive en
              La Loma. Es posible acceder al lugar por el cable, camperas balas,
              alimentadores, puesto que el transporte es eficiente en el
              territorio.
            </p>
            {renderUbicacionData}
          </div>
          <img
            src={mapa}
            style={{
              width: "50%",
              objectFit: "cover",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
        </div>

        {/* PAGINA 4 */}
        <div
          style={{
            height: "100vh",
            margin: "0 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
            // alignItems: "center",
            color: "white",
            gap: "32px",
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${historia})`,
            backgroundSize: "cover",
            position: "relative",
            height: "100vh",
            padding: "48px 32px",
          }}
        >
          <h1 className="text-[64px] text-white font-bold">SU HISTORIA</h1>
          <div
            style={{
              width: "50%",
              border: "2px solid white",
              padding: "32px",

              borderRadius: "12px",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <p style={{ fontSize: "14px", color: "white" }}>
              Desde el 20 de abril y hasta el 7 de mayo del 2002, guerrilleros
              del Bloque José María Córdoba de las Farc y paramilitares del
              Bloque Élmer Cárdenas se enfrentaron entre Vigía del Fuerte y
              Bellavista, cabecera municipal de Bojayá, Chocó.
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "64px 48px",
            color: "black",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          <p>
            El 2 de mayo los paramilitares se escondieron detrás de la Iglesia y
            hacia las 11:00 am las Farc lanzaron contra ellos una pipeta de gas
            llena de metralla que cayó dentro de la parroquia, donde se
            refugiaban más de 300 personas. El cilindro bomba rompió el techo de
            la iglesia, impactó contra el altar y estalló produciendo una gran
            devastación: en el suelo y hasta en los muros quedó la evidencia de
            los cuerpos desmembrados o totalmente deshechos. Las cifras
            relacionadas con las víctimas mortales varían teniendo en cuenta la
            duración total del enfrentamiento, los hechos precedentes y
            posteriores al 2 de mayo y las afectaciones relacionadas con el
            desplazamiento de todas las comunidades del Medio Atrato, pero desde
            la página https://bojayacuentaexhumaciones.com/ se habla de 102
            víctimas mortales.
          </p>
          <img
            src={historia2}
            style={{
              width: "50%",
              objectFit: "cover",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
        </div>
        {/* IFRAME  */}

        <div
          style={{
            height: "100vh",
            backgroundColor: "#111",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              display: isIframeOpen ? "none" : "flex",
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 1000,
              top: 0,
            }}
          >
            <div
              style={{
                margin: "auto",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1 className="text-[48px] text-white font-bold">
                Plan vivo de memoria de Bojayá
              </h1>
              <h3 className="text-[px] text-white ">
                Procesos de memoria multimedia
              </h3>

              <button
                style={{
                  marginTop: 32,
                  backgroundColor: "rgba(56, 147, 139,0.7)",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "50px",
                }}
                onClick={() => setIsIframeOpen(true)}
              >
                Empezar
              </button>
            </div>
          </div>
          <iframe
            src="https://bojaya-explorer-e6128fe6f266.herokuapp.com/"
            style={{ width: "100%", height: "100%", padding: 24 }}
          />
        </div>
        {/* FOTOS */}
        <div
          style={{
            height: "100vh",
            margin: "0 40px",
            backgroundColor: "#111828",
            padding: "64px 128px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <h1 className="text-[32px] text-white">Galería de fotos</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <img src={foto01} style={{ ...styles.fotos }} />
              <img src={foto04} style={{ ...styles.fotos }} />
            </div>
            <div style={{ marginTop: 24 }}>
              <img src={foto03} style={{ ...styles.fotos }} />
              <img src={foto02} style={{ ...styles.fotos }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <img src={foto05} style={{ ...styles.fotos }} />
              <img src={foto06} style={{ ...styles.fotos }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
