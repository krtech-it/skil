import React, { useMemo, useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import {
  IconTask,
  IconHome1,
  IconSearchReceipt,
  IconEye1
} from "@quark-uilib/icons";
import {
  IBreadcrumbItem,
  SearchBox,
  Tabs,
  Status,
  Button,
  Tooltip,
  Label
} from "@quark-uilib/components";
import { IRowClickedEvent, Table, TColumn } from "@quark-uilib/table";
import { generatePath, useNavigate } from "react-router-dom";
import * as dateFns from "date-fns";
import * as timezone from "date-fns-tz";
import { ITasksListItem } from "../../types";
import { FilterWrapper, TaskListWrapper } from "./styles";
import { STATUSES_TASK_MAP, GRADE_MAP } from "src/modules/tasks/constants";

import HeaderPage from "src/components/HeaderPage";
import { useStores } from "src/dal";
import { clientRoutes } from "src/routes/constants";

const HomePage: React.FC = observer(() => {
  const { AuthStore, TaskStore } = useStores();
  const [currentTab, setCurrentTab] = useState<string | number>("all");
  const [search, setSearch] = useState("");
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
        viewType: "current"
      }
    ],
    []
  );

  useEffect(() => {
    TaskStore.getTasksList(search, currentTab === "done");
  }, [currentTab, search]);

  const TimerComponent = ({ value, data }) => {
    if (data.status === "progress") {
      const [timeLeft, setTimeLeft] = useState<string>("");
      const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

      const startTimer = useCallback(() => {
        const startTime = dateFns.parseISO(value);
        const zonedStartTine = timezone.fromZonedTime(startTime, "UTC");
        const endTime = dateFns.addMinutes(zonedStartTine, data?.time);
        const interval = setInterval(() => {
          const now = new Date();
          const timeRemaining = dateFns.differenceInMilliseconds(endTime, now);
          if (timeRemaining <= 0) {
            clearInterval(intervalId);
            return;
          }
          const minutes =
            dateFns.differenceInMinutes(endTime, new Date(now)) % 60;
          const seconds =
            dateFns.differenceInSeconds(endTime, new Date(now)) % 60;
          setTimeLeft(`${minutes}:${seconds > 10 ? seconds : `0${seconds}`}`);
        }, 1000);
        setIntervalId(interval);
      }, []);

      useEffect(() => {
        startTimer();
      }, []);

      return <span>{timeLeft || "-"}</span>;
    }
    return <span>-</span>;
  };
  const columns = useMemo<TColumn<ITasksListItem, any>[]>(() => {
    let _columns: TColumn<ITasksListItem, any>[] = [
      {
        field: "title",
        title: "Название",
        isSortable: true,
        sortMenuItems: [
          {
            options: [
              { title: "А-Я", nameSort: "alphabet-asc" },
              { title: "Я-А", nameSort: "alphabet-desc" }
            ]
          }
        ],
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "alphabet-asc") {
            return valueA < valueB ? -1 : 1;
          }
          if (nameSort === "alphabet-desc") {
            return valueA > valueB ? -1 : 1;
          }
          return 0;
        }
      },
      {
        field: "difficulty",
        title: "Сложность",
        isSortable: true,
        sortMenuItems: [
          {
            options: [
              { title: "Сначала сложные", nameSort: "difficulty-desc" },
              { title: "Сначала несложные", nameSort: "difficulty-asc" }
            ]
          }
        ],
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "difficulty-desc") {
            return valueA > valueB ? -1 : 1;
          }
          if (nameSort === "difficulty-asc") {
            return valueA < valueB ? -1 : 1;
          }
          return 0;
        }
      },
      {
        field: "time",
        title: "Время на выполнение",
        valueFormatter: ({ value }) => `${value} мин`,
        sortMenuItems: [
          {
            options: [
              { title: "По возрастанию", nameSort: "time-asc" },
              { title: "По убыванию", nameSort: "time-desc" }
            ]
          }
        ],
        isSortable: true,
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "time-desc") {
            return valueA > valueB ? -1 : 1;
          }
          if (nameSort === "time-asc") {
            return valueA < valueB ? -1 : 1;
          }
          return 0;
        }
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
        cellRenderer: TimerComponent
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
        isSortable: true,
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "grade-desc") {
            return valueA > valueB ? 1 : -1;
          }
          if (nameSort === "grade-asc") {
            return valueA < valueB ? 1 : -1;
          }
          return 0;
        },
        cellRenderer: ({ value, data }) =>
          value && data.status === "done" ? (
            <Status colorType={GRADE_MAP[value].colorType} isFilled>
              {GRADE_MAP[value].title}
            </Status>
          ) : (
            <span>-</span>
          )
      },
      {
        field: "actions1",
        title: " ",
        cellRenderer: () => (
          <Tooltip text="Открыть" direction="bottomRight">
            <Button viewType="icon" size="l">
              <IconEye1 />
            </Button>
          </Tooltip>
        )
      }
    ];
    if (AuthStore.isAdmin) {
      _columns.splice(1, 0, {
        title: "Студент",
        field: "user_full_name"
      });
      _columns = [
        ..._columns,
        {
          field: "actions",
          title: " ",
          cellRenderer: ({ data }) => {
            if (data.status === "review" || data.status === "auto_review") {
              return (
                <Tooltip text="Проверить задачу" direction="bottomRight">
                  <Button
                    viewType="icon"
                    size="l"
                    onClick={
                      data.history_id
                        ? (event) => {
                            event.stopPropagation();
                            navigate(
                              generatePath(clientRoutes.taskReview.path, {
                                historyId: data.history_id
                              })
                            );
                          }
                        : undefined
                    }>
                    <IconSearchReceipt />
                  </Button>
                </Tooltip>
              );
            }
            return null;
          }
        }
      ];
    }
    return _columns;
  }, [AuthStore.isAdmin]);

  const handleRowClicked = (event: IRowClickedEvent<ITasksListItem>): void => {
    navigate(generatePath(clientRoutes.task.path, { id: event.data.id }));
  };

  return (
    <>
      <HeaderPage title={"Задачи"} breadcrumbs={breadcrumbs} />
      {!TaskStore.taskList.length && !search && (
        <Label status="warning">
          {AuthStore.isAdmin
            ? "Студенты еще не брали задачи, вернитесь сюда позже для того чтобы проконтролировать выполенение задач"
            : "Вы не брали задачи в работу, возьмите задачи в работу в учебных материалах"}
        </Label>
      )}
      <TaskListWrapper>
        <FilterWrapper>
          <SearchBox
            size="m"
            value={search}
            onChange={(_, value) => setSearch(value)}
          />
          <Tabs
            className="tabs"
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}>
            <Tabs.Tab value="all">Все</Tabs.Tab>
            <Tabs.Tab value="done">Успешно выполненые</Tabs.Tab>
          </Tabs>
        </FilterWrapper>
        <Table
          columns={columns}
          rowData={TaskStore.taskList}
          rowClicked={handleRowClicked}
        />
      </TaskListWrapper>
    </>
  );
});

export default HomePage;
