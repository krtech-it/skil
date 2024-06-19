export interface ILogin {
  username: string;
  password: string;
}

export interface IUser {
  full_name: string;
  admin: boolean;
  username: string;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IUserShort {
  full_name: string;
  id: string;
}
