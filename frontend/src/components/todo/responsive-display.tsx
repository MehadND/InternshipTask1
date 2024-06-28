import { useMediaQuery } from "@/lib/media-query";
import DesktopDisplay from "./desktop-display";
import MobileDisplay from "./mobile-display";

export default function ResponsiveDisplay() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DesktopDisplay />;
  }

  return <MobileDisplay />;
}
