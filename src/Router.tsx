// src/Router.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import TumacoPage from "./components/Lugares/Tumaco/index.jsx";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tumaco" element={<TumacoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
