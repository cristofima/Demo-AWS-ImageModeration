import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  NavLink,
} from "react-router-dom";
import Upload from "./components/Upload/Upload";
import Gallery from "./components/Gallery/Gallery";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { signOut, fetchUserAttributes } from "@aws-amplify/auth";
import { ToastContainer } from "react-toastify";
import { UserModel } from "./models/user.model";
import "./App.css";

const App: React.FC = () => {
  const [userInitials, setUserInitials] = useState<string>("");
  const [user, setUser] = useState<UserModel>();
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const fetchUserDetails = async () => {
    const { email, name, family_name } = await fetchUserAttributes();
    if (name && family_name) {
      const initials = `${name[0]}${family_name[0]}`.toUpperCase();
      setUserInitials(initials);
      setUser({ email, name, familyName: family_name });
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <Router>
      <ToastContainer />
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
          <div className="profile-container">
            <div
              className="profile-avatar"
              onClick={toggleDropdown}
              title={`${user?.name} ${user?.familyName}\n${user?.email}`}
            >
              {userInitials}
            </div>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<Navigate to="/gallery" />} />
      </Routes>
    </Router>
  );
};

export default withAuthenticator(App);
