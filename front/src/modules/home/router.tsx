import { lazy } from "react";
import { RouteObject } from "react-router";
import { homeRoutes } from "./constants";

const HomePage = lazy(() => import("./pages/HomePage"));

const homeRouter: RouteObject[] = [
  {
    path: homeRoutes.home.path,
    element: <HomePage />
  }
];

export default homeRouter;
