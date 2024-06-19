export const tasksRoutes = {
  tasksList: {
    path: "/tasks"
  },
  task: {
    path: "/task/:id"
  },
  taskStats: {
    path: "/task/:id/statistic"
  },
  taskReview: {
    path: "/task/review/:historyId"
  },
  taskSendResult: {
    path: "/task/:taskId/send-result"
  }
};

export const STATUSES_TASK_MAP: Record<string, any> = {
  progress: {
    title: "Взято в работу",
    color: "jotunheim"
  },
  review: {
    title: "Отправлено на проверку",
    color: "freyja"
  },
  auto_review: {
    title: "Отправлено на проверку",
    color: "freyja"
  },
  done: {
    title: "Проверено",
    color: "vanaheim"
  }
};

export const GRADE_MAP: Record<number, any> = {
  5: {
    colorType: "alvheim",
    title: "Отлично"
  },
  4: {
    colorType: "jotunheim",
    title: "Хорошо"
  },
  3: {
    colorType: "heimdallr",
    title: "Удов"
  },
  2: {
    colorType: "muspelheim",
    title: "Неуд"
  }
};
