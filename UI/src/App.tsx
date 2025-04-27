import React from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useHref,
} from "react-router-dom";
import { GalleryPage, UploadPage } from "./pages";
import MainLayout from "./layouts/MainLayout";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { HeroUIProvider } from "@heroui/react";

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="*" element={<Navigate to="/gallery" />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  );
};

export default withAuthenticator(App);
