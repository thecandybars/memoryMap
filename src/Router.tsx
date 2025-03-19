// src/Router.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import TumacoPage from "./components/Lugares/Tumaco/index.jsx";
import SiloePage from "./components/Lugares/Siloe/index.jsx";
import BojayaPage from "./components/Lugares/Bojaya/index.jsx";
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tumaco" element={<TumacoPage />} />
        <Route path="/siloe" element={<SiloePage />} />
        <Route path="/bojaya" element={<BojayaPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
