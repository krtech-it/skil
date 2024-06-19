import React, { useContext } from "react";
import { IThemeSwitchProps, ThemeSwitch } from "@quark-uilib/components";
import { ThemeContext } from "./ThemeContext";

export const ThemeSwitcher: React.FC<Pick<IThemeSwitchProps, "size">> = ({
  size = "l"
}) => {
  const ctx = useContext(ThemeContext);

  return (
    <ThemeSwitch
      themeSelected={ctx.theme.name}
      onChange={ctx.changeTheme}
      size={size}
    />
  );
};
