export type TStatusTask = "progress" | "review" | "auto_review" | "done";

export interface ITasksListItem {
  id: string;
  code: string;
  title: string;
  difficulty: number;
  time: number;
  start_date?: string;
  status?: TStatusTask;
  grade?: number;
  user_id?: string;
  user_full_name: string;
  actions?: null;
  history_id?: string;
  content: string;
}

export interface ITask extends ITasksListItem {
  content: string;
  supplement: Array<{
    title: string;
    file: string;
  }>;
  lessons: Array<{ lesson_id: string; lesson_title: string; topic_id: string }>;
}

export interface ITaskStatisticItem {
  user_full_name: string;
  user_id: string;
  status: TStatusTask;
  start_date: string;
  time: number;
  grade: number;
}

export interface ITaskReviewInfo {
  area: Array<any>;
  comment: string[];
  grade: number;
  history_id: string;
  images: Array<{ id: string; link: string }>;
  main_comment: string | null;
  task_id: string;
  task_name: string;
}
