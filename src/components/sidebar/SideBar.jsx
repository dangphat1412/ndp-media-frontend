import { fontAwesomeIcons, sideBarItems } from "@services/utils/static.data";
import React, { useEffect, useState } from "react";
import { useLocation, createSearchParams, useNavigate } from "react-router-dom";
import "@components/sidebar/SideBar.scss";
import { useSelector } from "react-redux";

const SideBar = () => {
  const { profile } = useSelector((state) => state.user);
  const [sidebar, setSidebar] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const checkUrl = (name) => {
    return location.pathname.includes(name.toLowerCase());
  };

  const navigateToPage = (name, url) => {
    console.log(url);
    if (name === "Profile") {
      url = `${url}/${profile?.username}?${createSearchParams({
        id: profile?._id,
        uId: profile?.uId,
      })}`;
    }
    navigate(url);
  };

  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);

  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((data) => (
            <li
              key={data.index}
              onClick={() => navigateToPage(data.name, data.url)}
            >
              <div
                data-testid="sidebar-list"
                className={`sidebar-link ${
                  checkUrl(data.name) ? "active" : ""
                }`}
              >
                <div className="menu-icon">
                  {fontAwesomeIcons[data.iconName]}
                </div>
                <div className="menu-link">
                  <span>{`${data.name}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
