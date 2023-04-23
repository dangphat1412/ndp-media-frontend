import React, { useState, useEffect } from "react";
import Input from "@components/input/Input";
import Button from "@components/button/Button";
import "@pages/auth/register/Register.scss";
import { Utils } from "@services/utils/utils.service";
import { useNavigate } from "react-router-dom";
import { authService } from "@services/api/auth/auth.service";
import useLocalStorage from "@hooks/useLocalStorage";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();
  const [setStoredUsername] = useLocalStorage("username", "set");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
  const navigate = useNavigate();

  const registerUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (password !== confirmPassword) {
      setLoading(false);
      setHasError(true);
      setAlertType("alert-error");
      setErrorMessage("Password does not match");
      return;
    }

    try {
      const avatarColor = Utils.avatarColor();
      const avatarImage = Utils.generateAvatar(
        username.charAt(0).toUpperCase(),
        avatarColor
      );

      const result = await authService.signUp({
        username,
        email,
        password,
        avatarColor,
        avatarImage,
      });

      setLoggedIn(true);
      setStoredUsername(username);
      setUser(result.data.user);
      setHasError(false);
      setAlertType("alert-success");
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType("alert-error");
      setErrorMessage(error?.response?.data.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) {
      navigate("/app/social/streams");
    }
  }, [loading, user, navigate]);

  return (
    <div className="auth-inner">
      {hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      )}
      <form className="auth-form" onSubmit={registerUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            placeholder="Username"
            className="big-size"
            style={{ border: `${hasError ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(event) => setUsername(event.target.value)}
          />
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
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            placeholder="Confirm password"
            className="big-size"
            style={{ border: `${hasError ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <Button
          label={`${loading ? "Sign Up in process..." : "SIGN UP"}`}
          className="auth-button button"
          disabled={!username || !email || !password}
        />
      </form>
    </div>
  );
};

export default Register;
