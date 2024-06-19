import {
  ITask,
  ITasksListItem,
  ITaskStatisticItem,
  ITaskReviewInfo
} from "../types";
import { api } from "src/services/api";
import { TResponse } from "src/services/api/types";

class TaskApi {
  private readonly api = api;

  public async getTasksList(): TResponse<ITasksListItem[]> {
    return this.api.get("/api/task/my_task_list", {}, { cache: false });
  }

  public async getTask(id: string): TResponse<ITask> {
    return this.api.get(`/api/task/${id}`, {}, { cache: false });
  }

  public async postActivateTask(id: string): TResponse<null> {
    return this.api.post(`/api/task/${id}/activate`, {}, { cache: false });
  }

  public async getTaskStatistic(id: string): TResponse<ITaskStatisticItem[]> {
    return this.api.get(`/api/task/${id}/statistic`, {}, { cache: false });
  }

  public async postSendResultTask(
    taskId: string,
    data: FormData
  ): TResponse<null> {
    return this.api.post(`/api/task/${taskId}/send_result`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  public async getResultReview(historyId: string): TResponse<ITaskReviewInfo> {
    return this.api.get(`/api/task/${historyId}/review`);
  }

  public async patchReview(historyId: string, data): TResponse<null> {
    return this.api.patch(`/api/task/${historyId}/review`, data);
  }

  public async getDefects(): TResponse<object> {
    return this.api.get("/api/task/defects");
  }
}

export default TaskApi;
