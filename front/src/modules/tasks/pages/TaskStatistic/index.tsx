import React, { useMemo, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { IconTask, IconHome1, IconTick } from "@quark-uilib/icons";
import {
  IBreadcrumbItem,
  SearchBox,
  Tabs,
  Status,
  Skeleton,
  Button
} from "@quark-uilib/components";
import { Table, TColumn } from "@quark-uilib/table";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { ITask, ITasksListItem, ITaskStatisticItem } from "../../types";
import { FilterWrapper, TaskListWrapper } from "./styles";
import { STATUSES_TASK_MAP, GRADE_MAP } from "src/modules/tasks/constants";

import HeaderPage from "src/components/HeaderPage";
import { useStores } from "src/dal";
import { clientRoutes } from "src/routes/constants";

const TaskStatistic: React.FC = observer(() => {
  const {  TaskStore } = useStores();
  const [search, setSearch] = useState("");
  const [statistics, setStatistics] = useState<ITaskStatisticItem[]>([]);
  const [task, setTask] = useState<ITask | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconTask />,
        text: "Задачи",
        onClick: () => navigate(clientRoutes.tasksList.path)
      },
      {
        icon: <IconTask />,
        text: "Статистика по задаче",
        viewType: "current",
      }
    ],
    []
  );

  useEffect(() => {
    if (id) {
      TaskStore.getTaskStatistic(id).then((res) => {
        setStatistics(res);
      });
      TaskStore.getTask(id).then((res) => setTask(res));
    }
  }, [id]);

  const columns = useMemo<TColumn<ITaskStatisticItem, any>[]>(
    () => [
      {
        field: "user_full_name",
        title: "Cтудент"
      },
      {
        field: "status",
        title: "Статус",
        filterMenuItems: [
          {
            options: [
              { title: "Взято в работу", name: "progress" },
              { title: "Отправлено на проверку", name: "review" },
              { title: "Проверено", name: "done" }
            ]
          }
        ],
        isFilter: true,
        filterFunc: (params) => {
          if (params.filterParams.includes("review")) {
            return [...params.filterParams, "auto_review"].includes(
              params.value
            );
          }
          return params.filterParams.includes(params.value);
        },
        valueFormatter: ({ value }) =>
          value ? STATUSES_TASK_MAP[value].title : "-"
      },
      {
        field: "start_date",
        title: "Оставшееся время",
        sortMenuItems: [
          {
            options: [
              { title: "По возрастанию", nameSort: "start_date-desc" },
              { title: "По убыванию", nameSort: "start_date-asc" }
            ]
          }
        ],
        isSortable: true,
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "start_date-desc") {
            return valueA > valueB ? -1 : 1;
          }
          if (nameSort === "start_date-asc") {
            return valueA < valueB ? -1 : 1;
          }
          return 0;
        },
        valueFormatter: ({ value, data }) =>
          // if (value) {
          //   let time = "";
          //   const closedDate = addMinutes(new Date(value), data.time);
          //   time = format(endOfSecond(closedDate), "mm:ss");
          //   setInterval(() => {
          //     time = format(endOfSecond(closedDate), "mm:ss");
          //   }, 1000);
          //   return time;
          // }
          "-"
      },
      {
        field: "grade",
        title: "Оценка",
        sortMenuItems: [
          {
            options: [
              { title: "По возрастанию", nameSort: "grade-desc" },
              { title: "По убыванию", nameSort: "grade-asc" }
            ]
          }
        ],
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "grade-desc") {
            return valueA > valueB ? -1 : 1;
          }
          if (nameSort === "grade-asc") {
            return valueA < valueB ? -1 : 1;
          }
          return 0;
        },
        cellRenderer: ({ value }) =>
          value ? (
            <Status colorType={GRADE_MAP[value].colorType} isFilled>
              {GRADE_MAP[value].title}
            </Status>
          ) : (
            <span>-</span>
          )
      },
      {
        field: "actions",
        title: " ",
        cellRenderer: ({ data }) =>
          data.status !== "done" && data.status !== "progess" ? (
            <Button viewType="icon" size="s">
              <IconTick />
            </Button>
          ) : null
      }
    ],
    []
  );

  return (
    <>
      <HeaderPage
        title={`Статистика по задаче`}
        description={task?.title}
        maxNoCollapsedItems={2}
        breadcrumbs={breadcrumbs}
      />
      <TaskListWrapper>
        <FilterWrapper>
          <SearchBox
            placeholder="Поиск по студенту"
            size="m"
            value={search}
            onChange={(_, value) => setSearch(value)}
          />
        </FilterWrapper>
        <Table columns={columns} rowData={statistics} />
      </TaskListWrapper>
    </>
  );
});

export default TaskStatistic;
