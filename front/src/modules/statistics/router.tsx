import { lazy } from "react";
import { RouteObject } from "react-router";
import {statisticRoutes} from "./constants";

const TaskRatingPage = lazy(() => import("./pages/TaskRating"));


const StatisticMenu = lazy(() => import("./pages/StatisticsMenu"));

const TopRating = lazy(() => import("./pages/TopRating"));

const UserStatistics = lazy(() => import("./pages/UserStatistics"));

const MyStatistics = lazy(() => import("./pages/MyStatistics"));

const TasksRating = lazy(() => import("./pages/TasksRating"));

const lessonsRouter: RouteObject[] = [
  {
    path: statisticRoutes.taskRating.path,
    element: <TaskRatingPage />
  },
  {
    path: statisticRoutes.statisticMenu.path,
    element: <StatisticMenu/>
  },
  {
    path: statisticRoutes.userStatistics.path,
    element: <UserStatistics/>
  },
  {
    path: statisticRoutes.myStatistics.path,
    element: <MyStatistics />
  },
  {
    path: statisticRoutes.topRating.path,
    element: <TopRating />
  },
  {
    path: statisticRoutes.tasksRating.path,
    element: <TasksRating />
  }
];

export default lessonsRouter;
