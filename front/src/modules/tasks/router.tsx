import { lazy } from "react";
import { RouteObject } from "react-router";
import { tasksRoutes } from "./constants";

const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const TaskInfo = lazy(() => import("./pages/TaskInfo"));
const TaskStatistic = lazy(() => import("./pages/TaskStatistic"));
const TaskSendResult = lazy(() => import("./pages/TaskSendResult"));
const TaskReviewResult = lazy(() => import("./pages/TaskReviewResult"));

const tasksRouter: RouteObject[] = [
  {
    path: tasksRoutes.tasksList.path,
    element: <TaskListPage />
  },
  {
    path: tasksRoutes.task.path,
    element: <TaskInfo />
  },
  {
    path: tasksRoutes.taskStats.path,
    element: <TaskStatistic />
  },
  {
    path: tasksRoutes.taskSendResult.path,
    element: <TaskSendResult />
  },
  {
    path: tasksRoutes.taskReview.path,
    element: <TaskReviewResult />
  }
];

export default tasksRouter;
