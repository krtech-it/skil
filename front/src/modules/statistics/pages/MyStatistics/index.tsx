import React, { useEffect, useMemo, useState } from "react";
import { LessonListWrapper } from "./styles";
import HeaderPage from "src/components/HeaderPage";
import {
  IBreadcrumbItem,
  openSnackBar} from "@quark-uilib/components";
import { useNavigate } from "react-router";
import { clientRoutes } from "src/routes/constants";
import { IconBook1, IconHome1 } from "@quark-uilib/icons";
import StatisticsApi from "../../api";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Rectangle } from "recharts";

const API = new StatisticsApi();
const TaskRatingPage: React.FC = () => {
  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconBook1 />,
        text: "Моя статистика",
        viewType: "current"
      }
    ],
    []
  );
  const [tasksCompleted, setTasksCompleted] = useState<string[] | []>([]);

  useEffect(() => {
    API.getMyStatistics().then((res) => {
      if(!res.data){
        return;
      }
      setTasksCompleted(res.data);

      console.log(res.data);
      if(res.data?.length == 0){
        openSnackBar({message: "По вам у нас еще нет данных, вам нужно получить оценку :(", status: 'error'});
      }
    }).catch(() => openSnackBar({message: "Произошла ошибка при получении данных", status: 'error'}));
  }, []);

  const navigate = useNavigate();
  console.log(tasksCompleted.map((mark, index) => ({id: index + 2, mark })));

  return (
    <>
      <HeaderPage
        title="Моя статистика"
        description="Количество оценок за все попытки выполнения заданий"
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      <LessonListWrapper>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={tasksCompleted.map((mark, index) => ({id: index + 2, "Количество оценок": mark }))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
        
          <YAxis dataKey="Количество оценок" />
          <Legend />
          <Bar dataKey="Количество оценок" fill="#ed39a5" activeBar={<Rectangle fill="pink" stroke="blue" />} />
        </BarChart>
      </ResponsiveContainer>
      </LessonListWrapper>
    </>
  );
};

export default TaskRatingPage;
