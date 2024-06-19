import { ITheme } from "@quark-uilib/components";

export interface IThemeContext {
  theme: ITheme;
  changeTheme: () => void;
}
