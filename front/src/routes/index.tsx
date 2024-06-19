import { ReactElement } from "react";
import { useRoutes } from "react-router-dom";
import { observer } from "mobx-react";
import errorsRouter from "src/modules/errors/router";
import authRouter from "src/modules/auth/router";
import homeRouter from "src/modules/home/router";
import lessonsRouter from "src/modules/lessons/router";
import taskRouter from "src/modules/tasks/router";
import statisticRouter from "src/modules/statistics/router";

export const routes = [
  ...errorsRouter,
  ...authRouter,
  ...homeRouter,
  ...lessonsRouter,
  ...statisticRouter,
  ...taskRouter
];

const Routes = observer((): ReactElement | null => useRoutes(routes));

export default Routes;
