import React from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useHref,
  NavigateOptions,
} from "react-router-dom";
import Upload from "./components/Upload/Upload";
import Gallery from "./components/Gallery/Gallery";
import NavBar from "./components/Navbar/Navbar";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { ToastContainer } from "react-toastify";
import "./App.css";

import { HeroUIProvider } from "@heroui/react";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<Navigate to="/gallery" />} />
      </Routes>
    </HeroUIProvider>
  );
};

export default withAuthenticator(App);
