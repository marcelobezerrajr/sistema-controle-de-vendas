import React from "react";
import { MainProvider } from "./context/MainContext";
import Routes from "./routes";
import "./styles/global.css";
import "./styles/vars.css";
import "./styles/animations.css";

const App = () => {
  return (
    <MainProvider>
      <Routes />
    </MainProvider>
  );
};

export default App;
