import React, { useEffect, useMemo, useState } from "react";
import {
  FileCard,
  IBreadcrumbItem,
  UploadDragFile,
  Button
} from "@quark-uilib/components";
import {
  IconHome1,
  IconTask,
  IconSend2,
  IconCloudImport,
  IconTrash2,
  IconClose,
  IconArrowRight1
} from "@quark-uilib/icons";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import HeaderPage from "src/components/HeaderPage";
import { clientRoutes } from "src/routes/constants";
import { ITask } from "src/modules/tasks/types";
import { useStores } from "src/dal";
import { FilesWrapper, UploadFilesWrapper, ButtonsWrapper } from "./styles";
import { ImagesTools } from "src/components/DrawTools";

const TaskSendResult: React.FC = () => {
  const [task, setTask] = useState<ITask | null>(null);
  const { taskId } = useParams();
  const { TaskStore } = useStores();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddedComments, setIsAddedComments] = useState(false);

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
        text: `Задача: ${task?.title}`,
        onClick: () =>
          navigate(generatePath(clientRoutes.task.path, { id: taskId }))
      },
      {
        icon: <IconSend2 />,
        text: "Отправка результатов",
        viewType: "current"
      }
    ],

    [task]
  );

  useEffect(() => {
    if (taskId) {
      TaskStore.getTask(taskId).then((res) => setTask(res));
    }
  }, [taskId]);

  const handleChange = (_files: File[]): void => {
    setFiles(files.concat(_files));
  };

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result?.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleUploadFiles = async (): Promise<void> => {
    if (files.length > 0) {
      setIsLoading(true);
      try {
        const _images = await Promise.all(files.map(fileToBase64));
        setImages(_images);
        setIsAddedComments(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangeComments = (_comments: string[]): void => {
    setComments(_comments);
  };

  const handleSendResult = (): void => {
    if (taskId) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      comments.forEach((comment) => {
        formData.append("comments", comment);
      });
      TaskStore.postSendResult(taskId, formData).then(() => {
        navigate(generatePath(clientRoutes.task.path, { id: taskId }));
      });
    }
  };

  return (
    <>
      <HeaderPage
        title="Загрузите результаты выполнения задания"
        description={
          isAddedComments
            ? "Оставьте комментарии к изображениям (опционально)"
            : "Загрузите изображения"
        }
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      {!isAddedComments ? (
        <>
          <UploadFilesWrapper>
            <UploadDragFile
              className="upload-drag-file"
              description={"Загрузите файлы"}
              icon={<IconCloudImport height={40} width={40} />}
              isMultiple
              accept=".png, .jpg, .tiff, .tif, .jpeg"
              maxFileSize={10_000_000}
              onChange={handleChange}
            />
            <FilesWrapper>
              {files.map((file, index) => (
                <FileCard
                  className="upload-file-card"
                  key={file.name + file.type}
                  fileName={file.name.split(".")[0]}
                  fileExtension={file.type.split("/")[1]}
                  buttonIcon={<IconTrash2 />}
                  onButtonClick={() =>
                    setFiles((prevFiles) =>
                      prevFiles.filter((_, _index) => _index !== index)
                    )
                  }
                />
              ))}
            </FilesWrapper>
          </UploadFilesWrapper>
          <ButtonsWrapper>
            <Button
              viewType={"secondary"}
              icon={<IconClose />}
              onClick={() => navigate(-1)}>
              Отмена
            </Button>
            <Button icon={<IconArrowRight1 />} onClick={handleUploadFiles}>
              Продолжить
            </Button>
          </ButtonsWrapper>
        </>
      ) : (
        <>
          <ImagesTools
            isReadOnlyComment={false}
            images={images}
            onChangeComments={handleChangeComments}
          />
          <ButtonsWrapper>
            <Button
              viewType={"secondary"}
              icon={<IconClose />}
              onClick={() => navigate(-1)}>
              Отмена
            </Button>
            <Button icon={<IconSend2 />} onClick={handleSendResult}>
              Отправить
            </Button>
          </ButtonsWrapper>
        </>
      )}
    </>
  );
};

export default TaskSendResult;
