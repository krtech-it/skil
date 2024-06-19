import { ITheme } from "@quark-uilib/components";
import { SELECTED_THEME_STORE_KEY, lightTheme, darkTheme } from "./constants";

export const getStorageTheme = (): ITheme => {
  if (localStorage.getItem(SELECTED_THEME_STORE_KEY)) {
    if (localStorage.getItem(SELECTED_THEME_STORE_KEY) === darkTheme.name) {
      return darkTheme;
    } else {
      return lightTheme;
    }
  }
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return darkTheme;
  }
  return lightTheme;
};
