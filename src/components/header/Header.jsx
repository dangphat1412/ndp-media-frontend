import React, { useRef, useState } from "react";
import logo from "@assets/images/ndp-media-logo.png";
import {
  FaCaretDown,
  FaRegBell,
  FaFacebookMessenger,
  FaCaretUp,
} from "react-icons/fa";
import "@components/header/Header.scss";
import Avatar from "@components/avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import MessageSidebar from "@components/message-sidebar/MessageSidebar";
import Dropdown from "@components/dropdown/Dropdown";
import useEffectOnce from "@hooks/useEffectOnce";
import { Utils } from "@services/utils/utils.service";
import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import { useNavigate } from "react-router-dom";
import { userService } from "@services/api/user/user.service";
import HeaderSkeleton from "./HeaderSkeleton";

const Header = () => {
  const { profile } = useSelector((state) => state.user);

  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [settings, setSettings] = useState([]);
  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(
    messageRef,
    false
  );
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(
    notificationRef,
    false
  );
  const [isSettingActive, setIsSettingActive] = useDetectOutsideClick(
    settingRef,
    false
  );
  const [deleteStorageUsername] = useLocalStorage("username", "delete");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
  const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");

  const openChatPage = () => {};
  const onMarkAsRead = () => {};
  const onDeleteNotification = () => {};
  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({
        dispatch,
        deleteStorageUsername,
        deleteSessionPageReload,
        setLoggedIn,
      });
      await userService.logoutUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
  });

  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMessageActive && (
            <div ref={messageRef}>
              <MessageSidebar
                profile={profile}
                messageCount={0}
                messageNotifications={[]}
                openChatPage={openChatPage}
              />
            </div>
          )}
          <div className="header-navbar">
            <div className="header-image" data-testid="header-image">
              <img src={logo} className="img-fluid" alt="logo" />
              <div className="app-name">NDP Media</div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              <li
                className="header-nav-item active-item"
                onClick={() => {
                  setIsNotificationActive(true);
                  setIsMessageActive(false);
                  setIsSettingActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegBell size={"1.5em"} className="header-list-icon" />
                  <span
                    className="bg-danger-dots dots"
                    data-testid="notification-dots"
                  >
                    5
                  </span>
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "250px", top: "20px" }}
                        data={[]}
                        notificationCount={0}
                        title="Notifications"
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(true);
                  setIsNotificationActive(false);
                  setIsSettingActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaFacebookMessenger
                    size={"1.5em"}
                    className="header-list-icon"
                  />
                  <span
                    className="bg-danger-dots dots"
                    data-testid="messages-dots"
                  ></span>
                </span>
                &nbsp;
              </li>
              <li
                className="header-nav-item"
                onClick={() => {
                  setIsSettingActive(true);
                  setIsMessageActive(false);
                  setIsNotificationActive(false);
                }}
              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {!isSettingActive ? (
                    <FaCaretDown className="header-list-icon caret" />
                  ) : (
                    <FaCaretUp className="header-list-icon caret" />
                  )}
                </span>
                {isSettingActive && (
                  <ul className="dropdown-ul" ref={settingRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "140px", top: "40px" }}
                        data={settings}
                        notificationCount={0}
                        title="Settings"
                        onLogout={onLogout}
                        onNavigate={() => {}}
                      />
                    </li>
                  </ul>
                )}
                <ul className="dropdown-ul">
                  <li className="dropdown-li"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
