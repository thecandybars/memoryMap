import {
  MapPin,
  Calendar,
  School,
  Workflow,
  Library,
  ArrowBigLeftDash,
} from "lucide-react";
import React, { useState } from "react";
import imagenPrincipal from "./assets/portada.png";
import flechaContinuar from "./assets/flecha-continuar.png";
import figuraMadera from "./assets/figuraMadera.png";
import mapaUbicacion from "./assets/mapaUbicacion.png";
import fondoHistoria from "./assets/fondoHistoria.png";
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
    <div className="fixed w-screen bg-gray-800/50 backdrop-blur-md text-white flex justify-start items-center h-8 md:pl-5 pl-2 z-[100]">
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
  const iconStyle = { size: "36", color: "#FF8804" };
  const basicData = [
    {
      icon: <Calendar {...iconStyle} />,
      title: "Año de creación",
      value: "2012",
    },
    {
      icon: <School {...iconStyle} />,
      title: "Tipo de Lugar de Memoria",
      value: "Casa",
    },
    {
      icon: <Workflow {...iconStyle} />,
      title: "Red a la que pertenece",
      value: "Coalición por la Memoria, la Cultura y la Paz",
    },
    {
      icon: <Library {...iconStyle} />,
      title: "Colectivo / Organización gestora",
      value: "Pastoral Social de Diócesis de Tumaco",
    },
  ];
  const renderCircle = (
    <div
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: "#FF8804",
        borderRadius: "50%",
        margin: "0 auto",
      }}
    />
  );
  const renderBasicData = basicData.map((data, index) => (
    <div className="grid grid-cols-[128px_1fr]" key={data.title}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: index === 0 ? "transparent" : "#697282",
            height: "50%",
            width: "4px",
          }}
        />
        {renderCircle}
        <div
          style={{
            backgroundColor:
              index === basicData.length - 1 ? "transparent" : "#697282",
            height: "50%",
            width: "4px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "32px",
          gap: "8px",
        }}
      >
        {data.icon}
        <p className="text-[14px]">{data.title}</p>
        <p className="text-[24px] font-bold">{data.value}</p>
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
    <div className="flex flex-col">
      <p className="text-[14px]">{data.title}</p>
      <p className="text-[24px] font-bold">{data.value}</p>
    </div>
  ));

  return (
    <div
      style={{ position: "initial", overflow: "visible" }}
      className={`flex flex-col flex-grow ${
        contrast === "high" ? "filter invert" : ""
      }`}
    >
      {renderBreadcrumb}
      {/* PAGINA 1 */}
      <div
        style={{
          height: "100vh",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imagenPrincipal})`,
          backgroundSize: "cover",
          position: "relative",
        }}
      >
        <h1 className="text-center text-[32px] md:text-5xl font-bold text-white mt-[20%] mb-auto">
          Casa de la Memoria del Pacífico Nariñense
        </h1>
        <img
          src={flechaContinuar}
          style={{ position: "absolute", bottom: "20px", right: "50%" }}
        />
      </div>
      {/* PAGINA 2 */}
      <div
        className="text-white flex justify-space-between items-center p-5"
        style={{
          // height: "100vh",
          backgroundColor: "#111828",
          padding: "96px 0",
        }}
      >
        <img
          src={figuraMadera}
          style={{ width: "50%", height: "100%", objectFit: "cover" }}
        />
        <div>{renderBasicData}</div>
      </div>
      {/* PAGINA 3 */}
      <div
        className="text-white flex justify-space-between items-center p-5"
        style={{
          backgroundColor: "#19223a",
          padding: "196px",
        }}
      >
        <img
          src={mapaUbicacion}
          style={{
            width: "50%",
            objectFit: "cover",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />
        <div className="flex flex-col gap-5" style={{ marginLeft: 128 }}>
          <h3
            style={{ display: "flex" }}
            className="text-center text-[32px] md:text-5xl font-bold text-white mt-[20%] mb-auto gap-2"
          >
            <MapPin size="48" color="#FF8804" />
            Ubicación
          </h3>
          {renderUbicacionData}
        </div>
      </div>
      {/* PAGINA 4 */}
      <div
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
            La Casa de la Memoria del Pacífico Nariñense se encuentra ubicada en
            la Calle del Comercio, sector El Bucanero en el distrito de Tumaco,
            departamento de Nariño. Este municipio portuario se conoce como la
            Perla del Pacífico, es territorio de frontera con el Ecuador y posee
            ecosistemas marítimos, de manglar y de bosque tropical. Alberga
            comunidades étnicas, afrocolombianas e indígenas en su mayoría, que
            han sufrido históricamente los efectos del conflicto armado interno.
          </p>
        </div>
      </div>
      {/* IFRAME PESCADOS */}
      <div style={{ height: "100vh", backgroundColor: "#111" }}>
        <iframe
          src="https://cnmh-prototipo.vercel.app/tumaco/mural_pargos"
          style={{ width: "100%", height: "100%", padding: 24 }}
        />
      </div>
      {/* FOTOS */}
      <div
        style={{
          height: "100vh",
          backgroundColor: "#111828",
          padding: "16px 128px",
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
  );
}
