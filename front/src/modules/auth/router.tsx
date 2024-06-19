import { lazy } from "react";
import { RouteObject, Navigate } from "react-router";
import { authRoutes } from "./constants";

const Login = lazy(() => import("./pages/Login"));

const authRouter: RouteObject[] = [
  {
    path: authRoutes.main.path,
    element: <Navigate to={authRoutes.auth.path} />
  },
  {
    path: authRoutes.auth.path,
    element: <Login />
  }
];

export default authRouter;
