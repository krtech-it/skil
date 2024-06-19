import { TResponse } from "src/services/api/types";
import { ILesson, ITopic, ITrait } from "../types";
import { api } from "src/services/api";
import { ITask } from "src/modules/tasks/types";

class LessonApi {
    private readonly api = api;

   getDiplomaData(id: string): TResponse<ITask[]>{
      return this.api.get(`/api/topic/get_data_diplom/${id}`)
   }
   getLessonsList(): TResponse<ITopic[]> {
    return this.api.get("/api/topic/topic_list", {}, {cache: false});
   }

   getTraits(): TResponse<ITrait[]>{
      return this.api.get("/api/trait/trait_list", {}, {cache: false})
   }

   getTopicLessons(id: string): TResponse<ITopic> {
      return this.api.get(`/api/topic/topic/${id}`, {}, {cache: false});
   }

   getLesson(id: string):TResponse<ILesson> {
    return this.api.get(`/api/lesson/${id}`, {}, {cache: false});
   }

// async getLesson(id: string): Promise<ILesson> {
//   return this.lesson;
// }



}
export default LessonApi;
