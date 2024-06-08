import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

import { Button } from "@/components/ui/button";

export function LightModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={"default"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className=" h-[1.2rem] w-[1.2rem] -rotate-90 scale-0 transition-all duration-150 dark:rotate-90 dark:scale-100 " />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-150 dark:rotate-90 dark:scale-0 " />
    </Button>
  );
}
