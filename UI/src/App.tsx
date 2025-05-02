import React from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useHref,
} from "react-router-dom";
import { GalleryPage, UploadPage, ProfilePage } from "./pages";
import { MainLayout } from "./layouts";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { HeroUIProvider } from "@heroui/react";
import { ProtectedRoute } from "./components";

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            path="gallery"
            element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/gallery" />} />
          <Route path="*" element={<Navigate to="/gallery" />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  );
};

export default withAuthenticator(App);
