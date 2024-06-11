import { useState } from "react";
import { LightModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Login from "./login";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full p-4">
      <div>
        <h1 className="capitalize scroll-m-20 text-4xl tracking-tight lg:text-5xl">
          Things To Do
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <HoverCard>
          <HoverCardTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                <span className="text-xs">Username</span>
              </AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="m-4">
            <Login />
          </HoverCardContent>
        </HoverCard>

        <LightModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
