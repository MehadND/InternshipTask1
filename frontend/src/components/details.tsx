import { useMediaQuery } from "@/lib/media-query";
import DesktopDetails from "./desktop-details";
import MobileDetails from "./mobile-details";

export function TaskDetails() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DesktopDetails />;
  }

  return <MobileDetails />;
}
