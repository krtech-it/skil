import {
  Button,
  FileCard,
  ModalWindow,
  Preloader,
  UploadDragFile
} from "@quark-uilib/components";
import { IconClose, IconCloudImport, IconTrash2 } from "@quark-uilib/icons";
import React, { useState } from "react";
import { observer } from "mobx-react";
import { FilesWrapper, UploadFilesWrapper, ModalResultStyled } from "./styles";
import { IModalUploadFilesProps } from "./types";
import { ImagesTools } from "src/components/DrawTools";

export const ModalUploadResultTask: React.FC<IModalUploadFilesProps> = observer(
  ({ isOpen, handleClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [comments, setComments] = useState<string[]>([]);
    const [isModalComments, setIsModalComments] = useState(false);

    async function fileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const handleChange = (_files: File[]): void => {
      setFiles(files.concat(_files));
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    const handleUploadFiles = async (): Promise<void> => {
      if (files.length > 0) {
        setIsLoading(true);
        try {
          const _images = await Promise.all(files.map(fileToBase64));
          setImages(_images);
          setIsModalComments(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const _handleClose = (): void => {
      files.length > 0 && setFiles([]);
      handleClose();
    };

    const handleChangeComments = (_comments: string[]): void => {
      setComments(_comments);
    };

    const handleUploadResult = (): void => {};

    return (
      <>
        {isOpen && (
          <ModalWindow
            className="modal-window-upload-file"
            title={"Загрузите результаты выполнения задания"}
            description={"Загрузите изображения"}
            isOpen={isOpen}
            onClose={_handleClose}
            type="fullscreen"
            footerContent={
              <>
                <Button
                  viewType="primary"
                  icon={isLoading ? <Preloader /> : <IconCloudImport />}
                  isDisabled={isLoading || files.length === 0}
                  onClick={handleUploadFiles}>
                  Загрузить изображения
                </Button>
                <Button
                  viewType="secondary"
                  icon={<IconClose />}
                  onClick={_handleClose}>
                  Отмена
                </Button>
              </>
            }>
            <UploadFilesWrapper>
              <UploadDragFile
                className="upload-drag-file"
                description={"Загрузите файлы"}
                icon={<IconCloudImport height={40} width={40} />}
                isMultiple
                accept=".pdf, .jpg, .tiff, .tif, .jpeg"
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
          </ModalWindow>
        )}
        <ModalResultStyled />
        <ModalWindow
          onClose={_handleClose}
          type="fullscreen"
          isOpen={isModalComments}
          className="content-result-modal"
          title={"Загрузите результаты выполнения задания"}
          description={
            "Проверьте изображения и оставьте комментарии к ним (опционально)"
          }
          footerContent={
            <>
              <Button
                viewType="primary"
                icon={isLoading ? <Preloader /> : <IconCloudImport />}
                isDisabled={isLoading || files.length === 0}
                onClick={handleUploadResult}>
                Отправить результаты
              </Button>
              <Button
                viewType="secondary"
                icon={<IconClose />}
                onClick={_handleClose}>
                Отмена
              </Button>
            </>
          }>
          <ImagesTools
            images={images}
            onChangeComments={handleChangeComments}
          />
        </ModalWindow>
      </>
    );
  }
);
