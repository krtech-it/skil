import { createContext } from "react";
import { LIGHT_THEME } from "@quark-uilib/components";
import { IThemeContext } from "./types";

export const ThemeContext = createContext<IThemeContext>({
  theme: LIGHT_THEME,
  changeTheme: () => null
});
