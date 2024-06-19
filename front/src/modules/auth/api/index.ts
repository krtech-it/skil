import { api } from "src/services/api";
import { ILogin, IUser, ITokens } from "src/modules/auth/types";
import { TResponse } from "src/services/api/types";

class AuthApi {
  private readonly api = api;

  public async login(data: ILogin): TResponse<ITokens> {
    return this.api.post("/api/auth/login", data, {cache: false });
  }

  public async me(): TResponse<IUser> {
    return this.api.get("/api/auth/user/me/", {}, {cache: false });
  }

  public async uploadInitialData(file: File): TResponse<null> {
    const formData = new FormData();
    formData.append("file", file);
    return this.api.post("/api/add_file/add_data", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
}

export default AuthApi;
