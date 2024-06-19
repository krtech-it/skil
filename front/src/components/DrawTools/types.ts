export interface IImagesToolsProps {
  images: string[];
  onDelete?: () => void;
  className?: string;
  onChangeComments: (comments: string[]) => void;
  onChangeImage?: (index: number) => void;
  isClearRect?: boolean;
  handleResetArea?: (index: number) => void;
  commentsA?: string[];
  isReadOnlyComment?: boolean;
  defects?: string[];
}

export type TDrawToolsConfig = {
  allowAutoFill: boolean;
};

export type TRect = {
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  style?: "ghost" | "default" | "hidden";
};

export interface ISetBackingData {
  data: string | undefined;
  size?: [number, number];
}
