import { authRoutes } from "src/modules/auth/constants";
import { errorsRoutes } from "src/modules/errors/constants";
import { homeRoutes } from "src/modules/home/constants";
import { lessonsRoutes } from "src/modules/lessons/constants";
import { statisticRoutes } from "src/modules/statistics/constants";
import { tasksRoutes } from "src/modules/tasks/constants";

export const clientRoutes = {
  ...authRoutes,
  ...errorsRoutes,
  ...homeRoutes,
  ...lessonsRoutes,
  ...statisticRoutes,
  ...tasksRoutes
};
