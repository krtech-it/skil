import React from "react";

export interface IDrawerProps {
  onClose: () => void;
  isOpen?: boolean;
  title?: string;
  subtitle?: string | React.ReactElement;
}
