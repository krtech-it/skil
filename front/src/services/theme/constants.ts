import { LIGHT_THEME, DARK_THEME } from "@quark-uilib/components";

export const SELECTED_THEME_STORE_KEY = "oko_theme";

export const lightTheme = {
  ...LIGHT_THEME,
  colors: {
    ...LIGHT_THEME.colors,
    sidebarBg: LIGHT_THEME.colors.jotunheim9,
    sidebarIcon: LIGHT_THEME.colors.grayscale0,
    sidebarIconHover: LIGHT_THEME.colors.grayscale1
  }
};

export const darkTheme = {
  ...DARK_THEME,
  colors: {
    ...DARK_THEME.colors,
    sidebarBg: DARK_THEME.colors.jotunheim1,
    sidebarIcon: DARK_THEME.colors.grayscale13,
    sidebarIconHover: DARK_THEME.colors.grayscale12
  }
};
