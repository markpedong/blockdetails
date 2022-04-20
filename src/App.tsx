import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import "../src/Styles/App.css";
import { GlobalContext } from "./Context/GlobalContext";
import { Main } from "./Pages/Main/Main";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Montserrat"',
      '"Poppins"',
      "Open Sans",
      '"Nunito Sans"',
    ].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          
        }
      `,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <GlobalContext>
          <Main />
        </GlobalContext>
      </div>
    </ThemeProvider>
  );
}

export default App;
