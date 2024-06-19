import { action, makeObservable, observable } from "mobx";
import { openSnackBar } from "@quark-uilib/components";
import { ILogin, IUser } from "../types";
import AuthApi from "../api";

export class AuthStore {
  protected readonly authApi: AuthApi;
  isAuth: boolean = false;
  permissions: string[] = [];
  user: IUser | null = null;
  isAdmin: boolean = false;

  constructor() {
    this.authApi = new AuthApi();
    makeObservable(this, {
      isAuth: observable,
      permissions: observable,
      user: observable,
      login: action,
      logout: action,
      checkAuth: action,
      me: action
    });
  }

  public login = async (data: ILogin): Promise<void> => {
    try {
      const response = await this.authApi.login(data);
      localStorage.setItem("accessToken", response.data.access_token);
      await this.me();
    } catch (err) {
      throw new Error(err as string);
    }
  };

  public logout = (): void => {
    this.isAuth = false;
    localStorage.removeItem("accessToken");
  };

  public checkAuth = (): void => {
    this.isAuth = true;
  };

  public me = async (): Promise<void> => {
    try {
      const res = await this.authApi.me();
      this.user = res.data;
      this.isAuth = true;
      this.isAdmin = this.user.admin;
    } catch {
      this.isAuth = false;
      openSnackBar({
        message: "Не удалось получить информацию о пользователе",
        status: "error"
      });
    }
  };

  public uploadInitialData = async (file: File): Promise<void> => {
    try {
      await this.authApi.uploadInitialData(file);
      openSnackBar({
        message: "Загрузка учебных материалов произошла успешно"
      });
    } catch {
      openSnackBar({
        message: "Не удалось загрузить учебные материалы, попробуйте позднее ",
        status: "error"
      });
      throw new Error("upload err");
    }
  };
}
