import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;