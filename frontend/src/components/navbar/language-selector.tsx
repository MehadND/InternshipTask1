import { GlobeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", lang: "English" },
    { code: "fr", lang: "French" },
    { code: "ur", lang: "Urdu" },
  ];
  const handleChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
  };

  //   useEffect(() => {
  //     document.body.dir = i18n.dir();
  //   }, [i18n, i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <GlobeIcon />
          <span className="uppercase ml-2 ">{i18n.language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language, index) => {
          return (
            <DropdownMenuItem
              key={index}
              onClick={() => handleChange(language.code)}
            >
              {language.lang}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
