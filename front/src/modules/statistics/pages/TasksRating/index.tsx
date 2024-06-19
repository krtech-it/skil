import React, { useEffect, useMemo, useState } from "react";
import { LessonListWrapper } from "./styles";
import HeaderPage from "src/components/HeaderPage";
import { TColumn, Table } from "@quark-uilib/table";
import { IUserRating } from "../../types";
import {
  IBreadcrumbItem,
  openSnackBar,
} from "@quark-uilib/components";
import { useNavigate } from "react-router";
import { clientRoutes } from "src/routes/constants";
import { IconBook1, IconDiagram, IconHome1 } from "@quark-uilib/icons";
import StatisticsApi from "../../api";

const API = new StatisticsApi();
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
        text: "Рейтинг задачи",
        viewType: "current"
      }
    ],
    []
  );
  const [rating, setRating] = useState<IUserRating[] | []>([]);


  useEffect(() => {
    API.getTasksRating().then((result) => {
      if (!result.data) {
        return;
      }
     setRating(result.data);
    }).catch(() => openSnackBar({message: "Произошла ошибка при получении данных", status: 'error'}));

  }, []);

  const navigate = useNavigate();
  const columns = useMemo<TColumn[]>(
    () => [
      { field: "place", title: "Место",columnTypes: 'basic' },
      { field: "title", title: "Задача", columnTypes: 'basic' },
      { field: "rating", title: "Рейтинг", columnTypes: 'basic' }
    ],
    [rating]
  );

  return (
    <>
      <HeaderPage
        title="Рейтинг по задачам"
        description="Рейтинг высчитывается исходя из решений пользователей"
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      <LessonListWrapper>
        <Table
          columns={columns}
          rowData={rating}
        />
      </LessonListWrapper>
    </>
  );
};

export default TaskRatingPage;
