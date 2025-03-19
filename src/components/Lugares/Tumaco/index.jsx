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
import fotoBasicData from "./assets/fotoBasicData.jpeg";
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
      width: "100%",
      maxHeight: "300px",
      objectFit: "cover",
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
          Casa de la Memoria del Pacífico Nariñense
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
      value: "2012",
    },
    {
      icon: <School {...iconStyle} />,
      image: "/lugares/house.png",
      title: "Tipo de Lugar de Memoria",
      value: "Casa",
    },
    {
      icon: <Globe {...iconStyle} />,
      image: "/lugares/global.png",
      title: "Red a la que pertenece",
      value: "Coalición por la Memoria, la Cultura y la Paz",
    },
    {
      icon: <Library {...iconStyle} />,
      image: "/lugares/handshake.png",
      title: "Colectivo / Organización gestora",
      value: "Pastoral Social de Diócesis de Tumaco",
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
      <div
      // style={{
      //   display: "flex",
      //   justifyContent: "center",alignItems
      // }}
      >
        {/* {data.icon} */}
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
      value: "Nariño",
    },
    {
      title: "Ciudad",
      value: "San Andrés de Tumaco",
    },
    {
      title: "Dirección",
      value: "Calle del Comercio, Sector El Bucanero",
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
            Casa de la Memoria del Pacífico Nariñense
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
              La Casa de la Memoria del Pacífico Nariñense se encuentra ubicada
              en la Calle del Comercio, sector El Bucanero en el distrito de
              Tumaco, departamento de Nariño. Este municipio portuario se conoce
              como la Perla del Pacífico, es territorio de frontera con el
              Ecuador y posee ecosistemas marítimos, de manglar y de bosque
              tropical. Alberga comunidades étnicas, afrocolombianas e indígenas
              en su mayoría, que han sufrido históricamente los efectos del
              conflicto armado interno
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
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imagenPrincipal})`,
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
              La Casa de la Memoria del Pacífico Nariñense se encuentra ubicada
              en la Calle del Comercio, sector El Bucanero en el distrito de
              Tumaco, departamento de Nariño. Este municipio portuario se conoce
              como la Perla del Pacífico, es territorio de frontera con el
              Ecuador y posee ecosistemas marítimos, de manglar y de bosque
              tropical. Alberga comunidades étnicas, afrocolombianas e indígenas
              en su mayoría, que han sufrido históricamente los efectos del
              conflicto armado interno
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
            El lugar de memoria se fundó en el año 2017, es administrado por la
            Diócesis de Tumaco y surge como un lugar de memoria para visibilizar
            el legado de la Hermana Yolanda Cerón, asesinada en 2001, quien
            trabajó por la memoria histórica y la construcción de paz en el
            territorio El espacio tiene salas de exposiciones temporales y
            permanentes para el desarrollo de iniciativas de memoria y
            actividades artísticas y culturales, que no sólo conectan con
            relatos y acciones para la construcción de paz en esta región de
            Nariño, sino que también se relacionan con el fortalecimiento de
            actividades y proyectos de memoria histórica. Con el tiempo, la Casa
            se ha convertido en un referente importante para los lugares de
            memoria de Colombia. Dentro de estas actividades y proyectos, se
            encuentran, entre otros, la Galería de la Memoria, la exposición
            Casa Volteada, distintas metodologías de construcción de paz,
            talleres y trabajo voluntario con niños y jóvenes. Adicionalmente,
            existen iniciativas de memoria con enfoque de género y algunas
            lideresas que apoyan estos procesos han viajado fuera de Tumaco para
            compartir estas experiencias.
          </p>
          <img
            src={foto02}
            style={{
              width: "50%",
              objectFit: "cover",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
        </div>
        {/* <div
          className="text-white flex flex-col justify-space-between gap-5"
          style={{
            height: "100vh",
            backgroundColor: "#111828",
            padding: "0 128px",
            backgroundImage: `url(${fondoHistoria})`,
            backgroundSize: "cover",
            backgroundBlendMode: "soft-light",
          }}
        >
          <h3 className=" text-[32px] md:text-5xl font-bold text-white mt-[20%] mb-auto gap-2">
            Su historia
          </h3>
          <div className="columns-2 h-96 gap-24 overflow-auto">
            <p className="break-words">
              La Casa de la Memoria del Pacífico Nariñense se encuentra ubicada
              en la Calle del Comercio, sector El Bucanero en el distrito de
              Tumaco, departamento de Nariño. Este municipio portuario se conoce
              como la Perla del Pacífico, es territorio de frontera con el
              Ecuador y posee ecosistemas marítimos, de manglar y de bosque
              tropical. Alberga comunidades étnicas, afrocolombianas e indígenas
              en su mayoría, que han sufrido históricamente los efectos del
              conflicto armado interno.
            </p>
          </div>
        </div> */}
        {/* IFRAME PESCADOS */}

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
                Mural de la historia de Tumaco
              </h1>
              <h3 className="text-[px] text-white ">Imagen interactiva</h3>

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
            src="https://cnmh-prototipo.vercel.app/tumaco/mural_pargos"
            style={{ width: "100%", height: "100%", padding: 24 }}
          />
        </div>
        {/* FOTOS */}
        <div
          style={{
            height: "100vh",
            margin: "0 40px",
            backgroundColor: "#000",
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
