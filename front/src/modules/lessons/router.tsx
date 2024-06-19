import { lazy } from "react";
import { RouteObject } from "react-router";
import { lessonsRoutes } from "./constants";

const LessonListPage = lazy(() => import("./pages/LessonsList"));


const LessonInfoPage = lazy(() => import("./pages/LessonInfo"));

const TopicList = lazy(() => import("./pages/TopicList"));

const lessonsRouter: RouteObject[] = [
  {
    path: lessonsRoutes.lessonsList.path,
    element: <LessonListPage />
  },
  {
    path: lessonsRoutes.lessonInfo.path,
    element: <LessonInfoPage/>
  },
  {
    path: lessonsRoutes.topicList.path,
    element: <TopicList />
  }
];

export default lessonsRouter;
