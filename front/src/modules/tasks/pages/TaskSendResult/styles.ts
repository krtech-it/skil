import styled from "styled-components";

export const UploadFilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;

  .upload-drag-file {
    max-width: 538px;
    width: 100%;
  }
`;

export const FilesWrapper = styled.div`
  max-width: 538px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .upload-file-card p {
    flex: 1;
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 32px;
    margin-top: auto;
    margin-bottom: 0;

  button {
    width: 100%;
  }
`;
