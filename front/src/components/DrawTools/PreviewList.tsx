import React from "react";
import {
  DocumentList,
  DocumentPreviewItem,
  DocumentPreviewWrapper
} from "./styles";

export interface IPreviewListProps {
  images: string[];
  selectedIndexImage?: number | null;
  onSelectImage?: (index: number) => void;
}

export const PreviewList = ({
  images = [],
  onSelectImage,
  selectedIndexImage
}: IPreviewListProps): JSX.Element => (
  <DocumentList>
    {images.map((image, i) => (
      <React.Fragment key={image}>
        <DocumentPreviewWrapper
          isSelected={i === selectedIndexImage}
          onClick={() => onSelectImage?.(i)}>
          <DocumentPreviewItem>
            <img
              src={
                image.includes("http")
                  ? image
                  : "data:image/jpeg;base64, " + image
              }
              width={80}
              height={45}
              alt="page_preview"
            />
          </DocumentPreviewItem>
        </DocumentPreviewWrapper>
      </React.Fragment>
    ))}
  </DocumentList>
);
