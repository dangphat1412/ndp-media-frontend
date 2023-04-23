import { Outlet } from "react-router-dom";
import "@pages/social/Social.scss";
import Header from "@components/header/Header";
import SideBar from "@components/sidebar/SideBar";

const Social = () => {
  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <SideBar />
        </div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default Social;
