import { useDispatch, useSelector } from "react-redux";
import { LightModeToggle } from "./mode-toggle";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { logout } from "@/redux/features/auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOutIcon } from "lucide-react";

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
          <Link to={"/"}>Todo</Link>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated === true ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="group relative flex h-10 w-fit shrink-0 overflow-hidden rounded-full transition-all duration-300"
                >
                  <Avatar className="w-fit">
                    <AvatarImage />
                    <AvatarFallback className="p-2">{username}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-2">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <div
                    className="text-destructive flex items-center hover:cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="group relative flex h-10 w-fit shrink-0 overflow-hidden rounded-full transition-all duration-300"
            >
              <Link to={"/login"}>
                <Avatar className="w-fit">
                  <AvatarImage />
                  <AvatarFallback className="p-2">
                    {username || "Login"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </>
        )}
        <LightModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
