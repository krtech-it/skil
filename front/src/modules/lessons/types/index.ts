import { ITasksListItem } from "src/modules/tasks/types"

export interface ITopic{
    id: string,
    title: string,
    lessons: ILesson[],
    traits: string[],
    description?: string,
    status?: string 
}

export interface ILesson {
    id: string,
    title: string,
    content: string,
    traits: ITrait[],
    supplement: [
      {
        title: string,
        file: string
      }
    ],
    tasks: ITasksListItem[],
    author: string
}

export interface ITrait {
    id: string,
    name: string;
    description: string;
}


