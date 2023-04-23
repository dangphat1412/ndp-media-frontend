import React, { useEffect, useState } from "react";
import Login from "@pages/auth/login/Login";
import logo from "@assets/images/ndp-media-with-slogan.png";
import "@pages/auth/auth-tabs/AuthTabs.scss";
import Register from "@pages/auth/register/Register";
import useLocalStorage from "@hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const AuthTabs = () => {
  const [type, setType] = useState("SignIn");
  const keepLoggedIn = useLocalStorage("keepLoggedIn", "get");
  const navigate = useNavigate();

  useEffect(() => {
    if (keepLoggedIn) {
      navigate("/app/social/streams");
    }
  }, [keepLoggedIn, navigate]);

  return (
    <div className="container-wrapper">
      <div className="main-logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="container-wrapper-auth">
        <div className="tabs">
          <div className="tabs-auth">
            <ul className="tab-group">
              <li
                className={`tab ${type === "SignIn" ? "active" : ""}`}
                onClick={() => setType("SignIn")}
              >
                <button className="login">Sign In</button>
              </li>
              <li
                className={`tab ${type === "SignUp" ? "active" : ""}`}
                onClick={() => setType("SignUp")}
              >
                <button className="signup">Sign Up</button>
              </li>
            </ul>
            {type === "SignIn" && (
              <div className="tab-item">
                <Login />
              </div>
            )}
            {type === "SignUp" && (
              <div className="tab-item">
                <Register />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
