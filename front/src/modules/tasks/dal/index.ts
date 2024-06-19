import { action, makeObservable, observable } from "mobx";
import { openSnackBar } from "@quark-uilib/components";
import {
  ITask,
  ITasksListItem,
  ITaskStatisticItem,
  ITaskReviewInfo
} from "../types";
import TaskApi from "../api";

export class TaskStore {
  protected readonly api: TaskApi;
  taskList: ITasksListItem[] = [];

  constructor() {
    this.api = new TaskApi();
    makeObservable(this, {
      taskList: observable,
      getTasksList: action
    });
  }

  public getTasksList = async (
    search: string,
    isSuccess: boolean
  ): Promise<void> => {
    try {
      const res = await this.api.getTasksList();
      this.taskList = res.data.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase() || "")
      );
      if (isSuccess) {
        this.taskList = this.taskList.filter(
          (task) => task.status === "done" && task.grade && task.grade > 2
        );
      }
    } catch {
      openSnackBar({
        message:
          "Не удалось загрузить список задач, попробуйте обновить страницу",
        status: "error"
      });
    }
  };

  public getTask = async (id: string): Promise<ITask | null> => {
    try {
      const res = await this.api.getTask(id);
      return res.data;
    } catch {
      openSnackBar({
        message:
          "Не удалось загрузить информацию по задаче, попробуйте обновить страницу",
        status: "error"
      });
      return null;
    }
  };

  public getTaskStatistic = async (
    id: string
  ): Promise<ITaskStatisticItem[] | []> => {
    try {
      const res = await this.api.getTaskStatistic(id);
      return res.data;
    } catch {
      openSnackBar({
        message:
          "Не удалось загрузить статистику по задаче, попробуйте обновить страницу",
        status: "error"
      });
      return [];
    }
  };

  public postTaskActivate = async (taskId: string): Promise<null> => {
    try {
      const res = await this.api.postActivateTask(taskId);
      openSnackBar({
        message: "Вы взяли в работу эту задачу",
        status: "success"
      });
      return res.data;
    } catch {
      openSnackBar({
        message: "Не удалось взять в работу задачу, попробуйте позднее",
        status: "error"
      });
      return null;
    }
  };

  public postSendResult = async (
    taskId: string,
    data: FormData
  ): Promise<null> => {
    try {
      const res = await this.api.postSendResultTask(taskId, data);
      openSnackBar({
        message: "Задание отправлено на проверку",
        status: "success"
      });
      return res.data;
    } catch {
      openSnackBar({
        message: "Не удалось отправить задание на проверку, попробуйте позднее",
        status: "error"
      });
      return null;
    }
  };

  public getResultReview = async (
    historyId: string
  ): Promise<ITaskReviewInfo | null> => {
    try {
      const res = await this.api.getResultReview(historyId);
      return res.data;
    } catch {
      openSnackBar({
        message: "Не удалось получить инфомацию",
        status: "error"
      });
      return null;
    }
  };

  public saveReview = async (historyId: string, data): Promise<null> => {
    try {
      await this.api.patchReview(historyId, data);
      openSnackBar({
        message: "Результаты проверки задания успешно сохоранены",
        status: "success"
      });
      return null;
    } catch {
      openSnackBar({
        message: "Не удалось сохранить результаты проверки задания",
        status: "error"
      });
      return null;
    }
  };

  public getDefects = async (): Promise<object> => {
    try {
      const res = await this.api.getDefects();
      return res.data;
    } catch {
      openSnackBar({
        message: "Не удалось загрузить список дефектов",
        status: "error"
      });
      return {/* */}
    }
  };
}
