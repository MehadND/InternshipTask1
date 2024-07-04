import { useDispatch, useSelector } from "react-redux";
import { LightModeToggle } from "./mode-toggle";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { logout } from "@/redux/features/auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOutIcon, UserIcon } from "lucide-react";
import { LanguageSelector } from "./language-selector";
import { useMediaQuery } from "@/lib/media-query";
import { SearchBar } from "./searchbar";

const Navbar = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { username, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  // For Desktop

  if (isDesktop) {
    return (
      <div className="flex p-2">
        <div className="flex w-full justify-between p-2 ">
          <h1 className="font-playwright scroll-m-20 text-2xl lg:text-4xl">
            <Link to={"/"}>Todo</Link>
          </h1>
        </div>

        <div className="flex gap-4 p-2">
          {isAuthenticated === true ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group flex h-10 w-fit shrink-0 overflow-hidden rounded-full transition-all duration-300"
                  >
                    <Avatar className="w-fit">
                      <AvatarImage />
                      <AvatarFallback className="p-2">
                        <UserIcon />
                        {username}
                      </AvatarFallback>
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
                      {<UserIcon /> || "Login"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            </>
          )}
          <SearchBar />
          <LanguageSelector />
          <LightModeToggle />
        </div>
      </div>
    );
  }

  // For Mobile

  return (
    <div className="flex flex-col p-2">
      <div className="flex w-full justify-between p-2">
        <h1 className="font-playwright scroll-m-20 text-2xl tracking-widest lg:text-3xl">
          <Link to={"/"}>Todo</Link>
        </h1>
        <div className="flex items-center gap-2">
          <LightModeToggle />
          <LanguageSelector />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex ">
          <SearchBar />
        </div>

        {isAuthenticated === true ? (
          <div className="flex ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="group flex h-10 w-fit shrink-0 overflow-hidden rounded-full transition-all duration-300"
                >
                  <Avatar className="w-fit">
                    <AvatarImage />
                    <AvatarFallback className="p-2">
                      <UserIcon />
                      {username}
                    </AvatarFallback>
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
          </div>
        ) : (
          <div className="flex justify-end items-end w-full">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
