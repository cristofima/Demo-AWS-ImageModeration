import { NavBar } from "../components";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <ToastContainer />
      <header>
        <NavBar />
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
