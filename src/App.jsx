import AppRoutes from "./routes.jsx";
import { GlobalStyle } from "./styles/GlobalStyle";
import { CurtidosProvider } from "./contexts/CurtidosProvider";

function App() {
  return (
    <CurtidosProvider>
      <GlobalStyle />
      <AppRoutes />
    </CurtidosProvider>
  );
}

export default App;
