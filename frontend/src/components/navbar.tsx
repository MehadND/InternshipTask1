import { LightModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full p-4">
      <div>
        <h1 className="capitalize scroll-m-20 text-4xl tracking-tight lg:text-5xl">
          Things To Do
        </h1>
      </div>

      <LightModeToggle />
    </div>
  );
};

export default Navbar;
