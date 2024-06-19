import React from "react";

export interface IEnterCardProps {
  image?: string;
  hoverImage?: string;
  icon: React.ReactElement;
  title: string;
  description: string;
  path?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  colorType: "alvheim" | "freyja" | "uthgard" | "jotunheim";
}
