import { MotionConfig } from "motion/react";
import AppRoutes from "./routes.jsx";
import { GlobalStyle } from "./styles/GlobalStyle";
import { CurtidosProvider } from "./contexts/CurtidosProvider";

function App() {
  return (
    // reducedMotion="user": quem pediu menos movimento no sistema não vê deslocamentos.
    <MotionConfig reducedMotion="user">
      <CurtidosProvider>
        <GlobalStyle />
        <AppRoutes />
      </CurtidosProvider>
    </MotionConfig>
  );
}

export default App;
