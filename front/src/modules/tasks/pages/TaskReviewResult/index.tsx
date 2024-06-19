import React, { useMemo, useEffect, useState } from "react";
import {
  Button,
  IBreadcrumbItem,
  Input,
  InputNumber,
  Skeleton
} from "@quark-uilib/components";
import {
  IconHome1,
  IconTask,
  IconNoteTick,
  IconClose,
  IconTick,
  IconArrowLeft
} from "@quark-uilib/icons";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { ButtonsWrapper, InputsWrapper } from "./styles";
import { clientRoutes } from "src/routes/constants";
import { ImagesTools } from "src/components/DrawTools";
import HeaderPage from "src/components/HeaderPage";
import { useStores } from "src/dal";
import { ITaskReviewInfo } from "src/modules/tasks/types";
import { DrawTools } from "src/components/DrawTools/DrawTools";

const TaskReviewResult: React.FC = observer(() => {
  const { TaskStore, AuthStore } = useStores();
  const [defects, setDefects] = useState<string[]>([]);
  const navigate = useNavigate();
  const [reviewInfo, setReviewInfo] = useState<ITaskReviewInfo | null>(null);
  const { historyId } = useParams();
  const drawtools = DrawTools.getInstance();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rectsIds, setRectsIds] = useState<(string | undefined)[]>([]);
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
        text: `Задача: ${reviewInfo?.task_name || ""}`,
        onClick: () =>
          navigate(
            generatePath(clientRoutes.task.path, { id: reviewInfo?.task_id })
          )
      },
      {
        icon: <IconNoteTick />,
        text: "Проверка результатов выполнения задачи",
        viewType: "current"
      }
    ],

    [reviewInfo]
  );

  useEffect(() => {
    TaskStore.getDefects().then((res) => setDefects(Object.values(res)));
  }, []);

  useEffect(() => {
    if (AuthStore.isAdmin) {
      drawtools.isDraw = AuthStore.isAdmin;
      drawtools.setonDrawSave((topLeft, bottomRight) => {
        if (reviewInfo) {
          const area = reviewInfo.area;
          area[currentIndex] = [
            ...area[currentIndex],
            {
              x1: topLeft.x,
              y1: topLeft.y,
              x2: bottomRight.x,
              y2: bottomRight.y
            }
          ];
          setReviewInfo((prevState) => ({
            ...prevState,
            area: [...area]
          }));
        }
      });
    }
  }, [reviewInfo, AuthStore.isAdmin]);

  useEffect(() => {
    if (historyId) {
      TaskStore.getResultReview(historyId).then((res) => {
        setReviewInfo(res);
        if (res) {
          setTimeout(() => {
            res.area[0].forEach((area) => {
              const id = drawtools.addRect({
                topLeft: { x: area.x1, y: area.y1 },
                bottomRight: { x: area.x2, y: area.y2 }
              });
              setRectsIds((prevState) => [...prevState, id]);
            });
          }, 500);
        }
      });
    }
  }, []);
  const handleChangeComments = (comments: string[]): void => {
    setReviewInfo((prevState) => ({ ...prevState, comment: comments }));
  };

  const handleChangeImage = (index: number): void => {
    setCurrentIndex(index);
    if (reviewInfo) {
      const ids: (string | undefined)[] = [];
      rectsIds.map((id) => {
        drawtools.removeRect(id);
      });
      reviewInfo.area[index].forEach((area) => {
        const id = drawtools.addRect({
          topLeft: { x: area.x1, y: area.y1 },
          bottomRight: { x: area.x2, y: area.y2 }
        });
        ids.push(id);
      });
      setRectsIds(ids);
    }
  };

  const handleResetArea = (index: number): void => {
    rectsIds.map((id) => {
      drawtools.removeRect(id);
    });
    setRectsIds([]);
  };

  const handleSaveReview = (): void => {
    if (historyId) {
      TaskStore.saveReview(historyId, reviewInfo).then(() => navigate(-1));
    }
  };

  return (
    <>
      <HeaderPage
        title="Проверка результатов выполнения задачи"
        description={reviewInfo?.task_name}
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      {reviewInfo ? (
        <>
          <ImagesTools
            images={reviewInfo.images.map((image) => image.link)}
            onChangeComments={handleChangeComments}
            onChangeImage={handleChangeImage}
            isClearRect
            handleResetArea={handleResetArea}
            commentsA={reviewInfo.comment}
            defects={defects}
          />
          <InputsWrapper>
            <Input
              isReadOnly={!AuthStore.isAdmin}
              placeholder="Итоговый комментарий"
              value={reviewInfo.main_comment || ""}
              onChange={(_, value) =>
                setReviewInfo((prevState) => ({
                  ...prevState,
                  main_comment: value
                }))
              }
            />
            <InputNumber
              isDisabled={!AuthStore.isAdmin}
              isReadOnly={!AuthStore.isAdmin}
              placeholder="Оценка"
              min={2}
              max={5}
              isRequired
              className="grade-input"
              width="200px"
              value={reviewInfo?.grade}
              onChange={(_, value) =>
                setReviewInfo((prevState) => ({
                  ...reviewInfo,
                  grade: value || prevState?.grade || 2
                }))
              }
            />
          </InputsWrapper>
          {AuthStore.isAdmin ? (
            <ButtonsWrapper>
              <Button viewType={"secondary"} icon={<IconClose />}>
                Отмена
              </Button>
              <Button icon={<IconTick />} onClick={handleSaveReview}>
                Сохранить
              </Button>
            </ButtonsWrapper>
          ) : (
            <ButtonsWrapper>
              <Button
                viewType={"primary"}
                icon={<IconArrowLeft />}
                onClick={() => navigate(-1)}>
                Назад
              </Button>
            </ButtonsWrapper>
          )}
        </>
      ) : (
        <Skeleton type="rectangle" width="100%" height="100%" />
      )}
    </>
  );
});

export default TaskReviewResult;
