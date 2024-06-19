import React, { useState } from "react";
import { ThemeProvider, ITheme } from "@quark-uilib/components";
import { ThemeContext } from "./ThemeContext";
import { SELECTED_THEME_STORE_KEY, lightTheme, darkTheme } from "./constants";
import { getStorageTheme } from "./helpers";

export const AppTheme: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<ITheme>(getStorageTheme());

  const changeTheme = (): void => {
    if (theme.name === lightTheme.name) {
      setTheme(darkTheme);
      localStorage.setItem(SELECTED_THEME_STORE_KEY, darkTheme.name);
    } else {
      setTheme(lightTheme);
      localStorage.setItem(SELECTED_THEME_STORE_KEY, lightTheme.name);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
