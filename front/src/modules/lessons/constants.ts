export const homeRoutes = {
  home: {
    path: "/home"
  },
};

export const lessonsRoutes = {
  topicList: {
    path: "/topics"
  },
  lessonsList: {
    path: "/lessons/:topicID"
  },
  lessonInfo: {
    path: "/lesson/:topicID/:lessonID"
  }
}
