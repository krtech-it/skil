import React, { useEffect, useMemo, useState } from "react";
import { TColumn, Table } from "@quark-uilib/table";
import { IBreadcrumbItem, Select, openSnackBar } from "@quark-uilib/components";
import { useNavigate } from "react-router";
import { IconBook1, IconDiagram, IconHome1 } from "@quark-uilib/icons";
import { IRating } from "../../types";
import LessonApi from "../../api";
import { LessonListWrapper } from "./styles";
import { clientRoutes } from "src/routes/constants";
import HeaderPage from "src/components/HeaderPage";
import { ITask } from "src/modules/tasks/types";

const API = new LessonApi();
const TaskRatingPage: React.FC = () => {
  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconDiagram />,
        text: "Статистика",
        onClick: () => navigate(clientRoutes.statisticMenu.path)
      },
      {
        icon: <IconBook1 />,
        text: "Рейтинг по заданиям",
        viewType: "current"
      }
    ],
    []
  );
  const [taskList, setTaskList] = useState<ITask[] | []>([]);
  const [rating, setRating] = useState<IRating[] | []>([]);

  const [selectedTask, setSelectedTask] = useState<string>();

  const handleChangeSelect = (value?: string): void => {
    if (!value) {
      return;
    }
    setSelectedTask(value);
    API.getTaskRating(value)
      .then((result) => {
        if (!result) {
          return;
        }
        setRating(result.data);
      })
      .catch(() =>
        openSnackBar({
          message: "Ошибка при загрузке данных",
          status: "error"
        })
      );
  };

  useEffect(() => {
    API.getTasks()
      .then((result) => {
        if (!result.data) {
          return;
        }
        setTaskList(
          result.data.reduce((acc, item) => {
            if (!acc.some((existingItem) => existingItem.id === item.id)) {
              acc.push(item);
            }
            return acc;
          }, [])
        );
      })
      .catch(() =>
        openSnackBar({
          message: "Ошибка при загрузке данных",
          status: "error"
        })
      );
  }, []);

  const navigate = useNavigate();
  const columns = useMemo<TColumn[]>(
    () => [
      { field: "place", title: "Место",columnTypes: 'basic' },
      { field: "fullname", title: "ФИО Студента",columnTypes: 'basic' },
      { field: "time", title: "Время выполнения",columnTypes: 'basic' },
      { field: "grade", title: "Оценка",columnTypes: 'basic' }
    ],
    [rating]
  );


  return (
    <>
      <HeaderPage
        title="Рейтинг по заданиям"
        description="Топ студентов"
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      <LessonListWrapper>
        <Select
          fieldNames={{ label: "title", value: "id" }}
          placeholder={"Выберите задание"}
          isClearable={false}
          options={taskList}
          onChange={(value) => handleChangeSelect(value?.id)}
          value={selectedTask}
        />
        <Table
          columns={columns}
          rowData={rating}
        />
      </LessonListWrapper>
    </>
  );
};

export default TaskRatingPage;
