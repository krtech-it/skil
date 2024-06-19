import {TResponse} from "src/services/api/types";
import {IRating, IStatisticUser} from "../types";
import {api} from "src/services/api";
import {ITask} from "src/modules/tasks/types";

class StatisticsApi {
  private readonly api = api;


  getTaskRating(id: string):TResponse<IRating[]> {
   return this.api.get(`/api/task/rating/${id}`);
  }

  getTasksRating():TResponse<IRating[]> {
    return this.api.get(`/api/task/global_rating_tasks`);
   }

  getUsers(): TResponse<IStatisticUser[]> {
    return this.api.get("/api/task/all_users");
  }

  getUsersRating(): TResponse<IRating[]> {
   return this.api.get("/api/task/global_rating");
  }

  getMyStatistics(): TResponse<string[]> {
   return this.api.get("/api/task/my_statistic");
  }

  getUserCompletedTasks(id: string): TResponse<string[]> {
    return this.api.get(`/api/task/user/statistic/${id}`);
  }

  getTasks(): TResponse<ITask[]> {
    return this.api.get('/api/task/my_task_list', {}, { cache: false })
  }
}

export default StatisticsApi;
