import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import Input from "@components/input/Input";
import Button from "@components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@services/api/auth/auth.service";
import "@pages/auth/login/Login.scss";
import useLocalStorage from "@hooks/useLocalStorage";
import { Utils } from "@services/utils/utils.service";
import useSessionStorage from "@hooks/useSessionStorage";
import { useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [setStoredUsername] = useLocalStorage("username", "set");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
  const [pageReload] = useSessionStorage("pageReload", "set");
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading && !user) return;
    if (user) {
      navigate("/app/social/streams");
    }
  }, [loading, user, navigate]);

  const loginUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const result = await authService.signIn({
        email,
        password,
      });

      setLoggedIn(keepLoggedIn);
      setStoredUsername(result.data.user.username);
      setHasError(false);
      setAlertType("alert-success");
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType("alert-error");
      setErrorMessage(error?.response?.data.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) navigate("/app/social/streams");
  }, [loading, user, navigate]);

  return (
    <div className="auth-inner">
      {hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      )}
      <form className="auth-form" onSubmit={loginUser}>
        <div className="form-input-container">
          <Input
            id="email"
            name="email"
            type="text"
            value={email}
            placeholder="Email address"
            className="big-size"
            style={{ border: `${hasError ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            placeholder="Password"
            className="big-size"
            style={{ border: `${hasError ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(event) => setPassword(event.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input
              id="checkbox"
              name="checkbox"
              type="checkbox"
              value={keepLoggedIn}
              rootStyle={{ padding: 0 }}
              handleChange={() => setKeepLoggedIn(!keepLoggedIn)}
            />
            Keep me signed in
          </label>
        </div>
        <Button
          label={`${loading ? "Sign In in progress..." : "SIGN IN"}`}
          className="auth-button button"
          disabled={!email || !password}
        />

        <Link to={"/forgot-password"}>
          <span className="forgot-password">
            Forgot password? <FaArrowRight className="arrow-right" />
          </span>
        </Link>
      </form>
    </div>
  );
};

export default Login;
