import { NavBar } from "../../components";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <>
      <ToastContainer />
      <NavBar />

      <main className="layout-container">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
