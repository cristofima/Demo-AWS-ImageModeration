import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  NavLink,
} from "react-router-dom";
import Upload from "./components/Upload/Upload";
import Gallery from "./components/Gallery/Gallery";

import { ToastContainer } from "react-toastify";
import "./App.css";

const App: React.FC = () => (
  <Router>
    <div className="app-container">
      <div className="tabs-container">
        <NavLink
          to="/gallery"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        >
          Gallery
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        >
          Upload
        </NavLink>
      </div>
    </div>
    <ToastContainer />
    <Routes>
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="*" element={<Navigate to="/gallery" />} />
    </Routes>
  </Router>
);

export default React.memo(App);
