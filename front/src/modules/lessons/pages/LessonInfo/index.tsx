import React, { useEffect, useMemo, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router";
import {
  Button,
  IBreadcrumbItem,
  List,
  P1,
  P2,
  Skeleton,
  Tag,
  Tooltip,
  openSnackBar,
  SearchBox
} from "@quark-uilib/components";
import { IconHome1, IconBook1 } from "@quark-uilib/icons";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ILesson } from "../../types";
import LessonApi from "../../api";
import { LessonInfoWrapper, ListWrapper, StyledSubHeader } from "./styles";
import Drawer from "src/components/Drawer";
import { clientRoutes } from "src/routes/constants";
import HeaderPage from "src/components/HeaderPage";
import { ITasksListItem } from "src/modules/tasks/types";

const LessonInfoPage: React.FC = () => {
  const API = new LessonApi();
  const params = useParams();
  const navigate = useNavigate();
  const [searchTask, setSearchTask] = useState("");
  const [tasks, setTasks] = useState<ITasksListItem[]>([]);

  const [lesson, setLesson] = useState<ILesson>();

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const handleTaskListToggle = (value: boolean): void => {
    setDrawerVisible(value);
  };

  useEffect(() => {
    lesson && setTasks(lesson.tasks);
  }, [lesson]);

  useEffect(() => {
    if (searchTask) {
      const filtered = tasks.filter((task) => {
        const searchSubject = [task.title].join(" ");
        return searchSubject.toLowerCase().includes(searchTask);
      });
      if (filtered) {
        setTasks(filtered);
      }
    } else {
      lesson && setTasks(lesson.tasks);
    }
  }, [searchTask]);

  useEffect(() => {
    if (params.lessonID) {
      API.getLesson(params.lessonID)
        .then((result) => {
          if (result) {
            setLesson(result.data);
          }
        })
        .catch(() =>
          openSnackBar({
            message: "Ошибка при загрузке данных",
            status: "error"
          })
        );
    }
  }, []);

  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconBook1 />,
        text: "Темы",
        onClick: () => navigate(clientRoutes.topicList.path)
      },
      {
        icon: <IconBook1 />,
        text: "Уроки",
        onClick: () =>
          navigate(
            generatePath(clientRoutes.lessonsList.path, {
              topicID: params.topicID
            })
          )
      },
      {
        icon: <IconBook1 />,
        text: lesson?.title,
        viewType: "current"
      }
    ],
    [lesson]
  );

  if (!lesson) {
    return <Skeleton type="rectangle" width="100%" height="100%" />;
  }

  return (
    <>
      <Drawer
        title="Задания по этому материалу"
        isOpen={drawerVisible}
        onClose={() => handleTaskListToggle(false)}>
        <SearchBox
          size="m"
          style={{ marginBottom: "12px" }}
          value={searchTask}
          onChange={(_, value) => setSearchTask(value)}
        />
        <ListWrapper>
          {tasks.map((task) => (
            <List.ListItem
              key={task.id}
              onClick={() =>
                navigate(generatePath(clientRoutes.task.path, { id: task.id }))
              }>
              {task.title}
            </List.ListItem>
          ))}
        </ListWrapper>
      </Drawer>
      <HeaderPage
        title={lesson.title}
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />

      <StyledSubHeader>
        <div className="subheader-container">
          <P1 type="phoenix">Автор</P1>
          <P2 type="corvus">{lesson.author}</P2>
        </div>
        <div className="subheader-container">
          <P1 type="phoenix">Теги</P1>
          {lesson.traits?.length > 0 ? (
            lesson?.traits?.map((trait) => (
              <Tooltip
                direction="bottom"
                text={trait?.description}
                key={trait.id}>
                <Tag>{trait.name}</Tag>
              </Tooltip>
            ))
          ) : (
            <Tag>-</Tag>
          )}
        </div>
      </StyledSubHeader>

      <LessonInfoWrapper>
        <ReactMarkdown
          urlTransform={(value) => value}
          skipHtml={false}
          rehypePlugins={[rehypeRaw]}
          className="markdown-container">
          {lesson?.content?.replaceAll("<br>", "&nbsp; \n")}
        </ReactMarkdown>
      </LessonInfoWrapper>
      {lesson.tasks?.length > 0 && (
        <div>
          <Button onClick={() => handleTaskListToggle(true)} width="100%">
            Список заданий
          </Button>
        </div>
      )}
    </>
  );
};

export default LessonInfoPage;
