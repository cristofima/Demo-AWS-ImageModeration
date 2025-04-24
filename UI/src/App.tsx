import React from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useHref,
  NavigateOptions,
} from "react-router-dom";
import { GalleryPage, UploadPage } from "./pages";
import { NavBar } from "./components";
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
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="*" element={<Navigate to="/gallery" />} />
      </Routes>
    </HeroUIProvider>
  );
};

export default withAuthenticator(App);
