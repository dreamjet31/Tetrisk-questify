import {
  BrowserRouter as Router,
  Route,
  RouteProps,
  Routes,
} from "react-router-dom";
import routes from "./routes/routes";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer"
import Home from "./pages/Home";
import StartGame from "./pages/StartGame";
import Tetris from "./pages/Tetris";
import { useEffect } from "react";
import socket from "./utils/socket-client";

function App() {
  useEffect(() => {
    (window as any).socket = socket();
  }, []);
  return (
    <div>

      <Router>
        <Header />
        <Routes>
          {/* {routes.map((route: RouteProps) => (
            <Route key={`routes-${route.path}`} {...route} />
          ))} */}
          <Route path="/" element={<Home />} />
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/start" element={<StartGame />} />
        </Routes>
        <Footer />
      </Router>

    </div>
  );
}

export default App;
