import React, { useMemo, useState, useEffect, useCallback } from "react";
import { IconTask, IconHome1, IconEye1 } from "@quark-uilib/icons";
import {
  IBreadcrumbItem,
  Status,
  P1,
  P2,
  Button,
  Divider,
  H
} from "@quark-uilib/components";
import * as dateFns from "date-fns";
import * as timezone from "date-fns-tz";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { ITask } from "../../types";
import { SubHeaderWrapper, MarkdownContent } from "./styles";
import { STATUSES_TASK_MAP, GRADE_MAP } from "src/modules/tasks/constants";
import HeaderPage from "src/components/HeaderPage";
import { useStores } from "src/dal";
import { clientRoutes } from "src/routes/constants";

const TaskInfo: React.FC = () => {
  const { TaskStore, AuthStore } = useStores();
  const navigate = useNavigate();
  const [task, setTask] = useState<ITask | null>(null);
  const [_, setIsLoading] = useState(false);
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

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
        text: task?.title,
        viewType: "current"
      }
    ],
    [task]
  );

  const calculateTimeLeft = useCallback(
    (startDate: string, time: number): void => {
      const startTime = dateFns.parseISO(startDate);
      const zonedStartTine = timezone.fromZonedTime(startTime, "UTC");
      const endTime = dateFns.addMinutes(zonedStartTine, time);
      const interval = setInterval(() => {
        const now = new Date();
        const timeRemaining = dateFns.differenceInMilliseconds(endTime, now);
        if (timeRemaining <= 0) {
          clearInterval(intervalId);
          setTimeLeft("");
          // getTask();
          return;
        }
        const minutes =
          dateFns.differenceInMinutes(endTime, new Date(now)) % 60;
        const seconds =
          dateFns.differenceInSeconds(endTime, new Date(now)) % 60;
        setTimeLeft(`${minutes}:${seconds > 10 ? seconds : `0${seconds}`}`);
      }, 1000);
      setIntervalId(interval);
    },
    [id]
  );

  useEffect(() => {
    if (!AuthStore.isAdmin && task?.start_date && task.status === "progress") {
      calculateTimeLeft(task.start_date, task.time);
    }
  }, [task]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      TaskStore.getTask(id)
        .then((res) => {
          setTask(res);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const handleClickTaskActivate = async (): Promise<void> => {
    if (id) {
      await TaskStore.postTaskActivate(id);
      const res = await TaskStore.getTask(id);
      setTask(res);
    }
  };

  return (
    <>
      <HeaderPage
        title={task?.title || ""}
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      {task ? (
        <>
          <SubHeaderWrapper>
            <div className="field-wrapper">
              <P1 type="phoenix">Сложность</P1>
              <P2 type="corvus">{task.difficulty}</P2>
            </div>
            <div className="field-wrapper">
              <P1 type="phoenix">Время выполнения</P1>
              <P2 type="corvus">{task.time} мин.</P2>
            </div>
            {task?.start_date && (
              <div className="field-wrapper">
                <P1 type="phoenix">Оставшееся время</P1>
                <P2 type="corvus">{timeLeft}</P2>
              </div>
            )}
            {task?.status && (
              <div className="field-wrapper">
                <P1 type="phoenix">Статус</P1>
                <Status colorType={STATUSES_TASK_MAP[task.status].color}>
                  {STATUSES_TASK_MAP[task.status].title}
                </Status>
              </div>
            )}
            {task?.grade && task.status === "done" ? (
              <div className="field-wrapper">
                <P1 type="phoenix">Оценка</P1>
                <Status colorType={GRADE_MAP[task.grade].colorType} isFilled>
                  {GRADE_MAP[task.grade].title}
                </Status>
              </div>
            ) : null}
          </SubHeaderWrapper>
          <Divider />
          <MarkdownContent>
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              urlTransform={(value: string) => value}
              skipHtml={false}>
              {task.content.replaceAll("<br>", "&nbsp; \n")}
            </ReactMarkdown>
            <Divider />
            <H type="libra">Материалы для подготовки</H>
            <div>
              {task.lessons.map((lesson) => (
                <Button
                  key={lesson.lesson_id}
                  viewType="link"
                  size="m"
                  onClick={() =>
                    navigate(
                      generatePath(clientRoutes.lessonInfo.path, {
                        lessonID: lesson.lesson_id,
                        topicID: lesson.topic_id
                      })
                    )
                  }>
                  {lesson.lesson_title}
                </Button>
              ))}
            </div>
          </MarkdownContent>
        </>
      ) : null}
      <div>
        {AuthStore.user?.admin === false &&
          (!task?.status || (task.status === "done" && task.grade === 2)) && (
            <Button size="l" width="100%" onClick={handleClickTaskActivate}>
              {task?.grade === 2 ? "Исправить оценку" : "Взять в работу"}
            </Button>
          )}
        {AuthStore.user?.admin === false && task?.status === "progress" && (
          <Button
            size="l"
            width="100%"
            onClick={() =>
              navigate(
                generatePath(clientRoutes.taskSendResult.path, { taskId: id })
              )
            }>
            Отправить на проверку
          </Button>
        )}
        {AuthStore.isAdmin ? (
          <Button
            icon={<IconEye1 />}
            width="100%"
            onClick={() =>
              navigate(generatePath(clientRoutes.taskStats.path, { id }))
            }>
            Посмотреть статистику по задаче
          </Button>
        ) : null}

        {!AuthStore.isAdmin && task?.status === "done" ? (
          <Button
            icon={<IconEye1 />}
            width="100%"
            onClick={() =>
              navigate(
                generatePath(clientRoutes.taskReview.path, {
                  historyId: task?.history_id
                })
              )
            }>
            Посмотреть результаты проверки
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default TaskInfo;
