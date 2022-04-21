import React from "react";
import "../src/Styles/App.css";
import { GlobalContext } from "./Context/GlobalContext";
import { Main } from "./Pages/Main/Main";

export const App = () => {
  return (
    <div className="App">
      <GlobalContext>
        <Main />
      </GlobalContext>
    </div>
  );
};

export default App;
