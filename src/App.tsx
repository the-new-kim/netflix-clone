import { createGlobalStyle, ThemeProvider } from "styled-components";
import reset from "styled-reset";
import Router from "./Router";
import { Helmet } from "react-helmet";
import { defaultTheme } from "./theme";

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
  box-sizing: border-box;
}

body {
  font-family: 'Kanit', sans-serif;
  font-weight: 100;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color}
}
a{
    color: inherit;
    text-decoration:none;
  }

`;

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Helmet>
        <title>Netflix Clone</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;400&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
