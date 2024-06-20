import { useDispatch, useSelector } from "react-redux";
import { LightModeToggle } from "./mode-toggle";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { logout } from "@/redux/features/auth/authSlice";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { username, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between w-full p-4">
      <div>
        <h1 className="font-playwright scroll-m-20 text-2xl tracking-widest lg:text-3xl">
          {/* {new Date().toLocaleString("en-US", { dateStyle: "full" })} */}
          <Link to={"/"}>Todo</Link>
        </h1>
      </div>
      {username ? (
        <h1 className="font-notosans scroll-m-20 text-2xl tracking-widest bg-gradient-to-b from-neutral-600 to-neutral-900 lg:text-3xl">
          Hi {username}
        </h1>
      ) : (
        <h1 className="font-notosans scroll-m-20 text-2xl lg:text-3xl">
          Hi Guest
        </h1>
      )}
      <div className="flex items-center gap-4">
        {isAuthenticated === true ? (
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Link to={"/login"}>
            <Button variant="secondary">Login</Button>
          </Link>
        )}
        <LightModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
