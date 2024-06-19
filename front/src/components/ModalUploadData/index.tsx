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
import { FilesWrapper, UploadFilesWrapper } from "./styles";
import { IModalUploadFilesProps } from "./types";
import { useStores } from "src/dal";

export const ModalUploadData: React.FC<IModalUploadFilesProps> = observer(
  ({ isOpen, handleClose }) => {
    const { AuthStore } = useStores();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (_files: File[]): void => {
      if (_files.length) {
        setFile(_files[0]);
      }
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    const handleUploadFiles = async (): Promise<void> => {
      if (file) {
        setIsLoading(true);
        try {
          await AuthStore.uploadInitialData(file);
          handleClose();
        }
        catch (e){
          console.error(e)
        } finally {
          setIsLoading(false);
        }
      }
    };

    const _handleClose = (): void => {
      setFile(null);
      handleClose();
    };

    return (
      <ModalWindow
        className="modal-window-upload-file"
        title={"Загрузите учебные материалы"}
        description={
          "Архив должен состоять из папок lessons и tasks, содержащие всю информацию об учебных материалах и заданиях. Также в архиве должны быть 2 файла json traits и topic."
        }
        isOpen={isOpen}
        onClose={_handleClose}
        type="fullscreen"
        footerContent={
          <>
            <Button
              viewType="primary"
              icon={isLoading ? <Preloader /> : <IconCloudImport />}
              isDisabled={isLoading || !file}
              onClick={handleUploadFiles}>
              Загрузить архив
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
            description={"Загрузите архив"}
            icon={<IconCloudImport height={40} width={40} />}
            accept=".zip"
            onChange={handleChange}
          />
          <FilesWrapper>
            {file && (
              <FileCard
                className="upload-file-card"
                key={file.name + file.type}
                fileName={file.name.split(".")[0]}
                fileExtension={file.type.split("/")[1]}
                buttonIcon={<IconTrash2 />}
                onButtonClick={() => setFile(null)}
              />
            )}
          </FilesWrapper>
        </UploadFilesWrapper>
      </ModalWindow>
    );
  }
);
