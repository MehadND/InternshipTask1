// Login.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/auth/authSlice";
import { RootState } from "@/redux/store";
import { loginUser, logout } from "@/redux/features/auth/authSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { fetchTodos } from "@/redux/features/todo/todoSlice";

const Login = () => {
  const [usernameField, setUsernameField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const dispatch = useDispatch();
  const { username, isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async () => {
    await dispatch(
      loginUser({ username: usernameField, password: passwordField })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  useEffect(() => {
    dispatch(fetchTodos({ itemsPerPage: 5, page: 1 }));
  }, [dispatch]);

  return (
    <div>
      {error && <p>{error}</p>}
      {isAuthenticated ? (
        <div className="w-full">
          {username && <p>{username}</p>}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div tabIndex={0} className="w-full flex flex-col gap-4">
          <Input
            type="text"
            placeholder="username"
            value={usernameField}
            className="w-full"
            onChange={(e) => setUsernameField(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={passwordField}
            className="w-full"
            onChange={(e) => setPasswordField(e.target.value)}
          />
          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={isAuthenticated}
          >
            Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default Login;
