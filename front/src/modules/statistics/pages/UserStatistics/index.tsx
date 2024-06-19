import React, { useEffect, useMemo, useState } from "react";
import { LessonListWrapper } from "./styles";
import HeaderPage from "src/components/HeaderPage";
import {
  IBreadcrumbItem,
  Select,
  openSnackBar} from "@quark-uilib/components";
import { useNavigate } from "react-router";
import { clientRoutes } from "src/routes/constants";
import { IconBook1, IconDiagram, IconHome1 } from "@quark-uilib/icons";
import StatisticsApi from "../../api";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Rectangle } from "recharts";
import { IStatisticUser } from "../../types";

const API = new StatisticsApi();
const TaskRatingPage: React.FC = () => {
 
  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconDiagram/>,
        text: "Статистика студентов",
        onClick: () => navigate(clientRoutes.statisticMenu.path)
      },
      {
        icon: <IconBook1 />,
        text: "Статистика по конкретному студенту",
        viewType: "current"
      }
    ],
    []
  );
  const [users, setUserList] = useState<IStatisticUser[]>([]);
  const [tasksCompleted, setTasksCompleted] = useState<string[] | []>([]);

  const [selectedUser, setSelectedUser] = useState<IStatisticUser>();

  const handleChangeSelect = (value: IStatisticUser) => {
    setSelectedUser(value);
    API.getUserCompletedTasks(value.id).then((res) => {
      if(res.data.length === 0){
        openSnackBar({
          message: "По этому пользователю нет статистики",
          status: "error"
        })
      }
      setTasksCompleted(res.data);
    }).catch(() =>
      openSnackBar({
        message: "Ошибка при загрузке данных",
        status: "error"
      })
    );
  };

  useEffect(() => {
    API.getUsers().then((res) => {
      if(!res.data){
        return;
      }
      setUserList(res.data);
    }).catch(() => openSnackBar({
      message: "Ошибка при загрузке данных",
      status: "error"
    }));}, []);

  const navigate = useNavigate();

  return (
    <>
      <HeaderPage
        title="Статистика студента"
        description="Статистика по конкретному студенту"
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      <LessonListWrapper>
        <Select
        fieldNames={{label: "fullname", value: "id"}}
          placeholder={"Выберите студента"}
          options={users}
          onChange={(value) => handleChangeSelect(value)}
          value={selectedUser}
        />
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={tasksCompleted.map((mark, index) => ({id: index+2, "Количество оценок": mark}))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Legend />
          <Bar dataKey="Количество оценок"  fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
        </BarChart>
      </ResponsiveContainer>
      </LessonListWrapper>
    </>
  );
};

export default TaskRatingPage;
