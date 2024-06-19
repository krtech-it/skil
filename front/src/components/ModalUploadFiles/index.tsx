import {
  Button,
  FileCard,
  ModalWindow,
  Preloader,
  UploadDragFile
} from "@quark-uilib/components";
import { IconClose, IconCloudImport, IconTrash2 } from "@quark-uilib/icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { FilesWrapper, UploadFilesWrapper } from "./styles";
import { IModalUploadFilesProps } from "./types";

export const ModalUploadFiles: React.FC<IModalUploadFilesProps> = observer(
  ({ isOpen, handleClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const navigate = useNavigate();

    const handleChange = (_files: File[]): void => {
      setFiles(files.concat(_files));
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    const handleUploadFiles = async (): Promise<void> => {
      if (files.length > 0) {
        setIsLoading(true);
        try {
          navigate(-1);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const _handleClose = (): void => {
      files.length > 0 && setFiles([]);
      handleClose();
    };

    return (
      <ModalWindow
        className="modal-window-upload-file"
        title={"Загрузите файлы"}
        description={"Загрузите файлы"}
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
              Загрузить файлы
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
    );
  }
);
