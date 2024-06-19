import React, { useState, MouseEventHandler } from "react";
import { SidebarButtonStyled, SidebarButtonStick } from "./styles";

const SidebarButton: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<"button">>
> = ({ children, ...props }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e): void => {
    setIsSelected(true);
    props.onMouseDown?.(e);
  };

  const handleMouseUp: MouseEventHandler<HTMLButtonElement> = (e): void => {
    setIsSelected(false);
    props.onMouseEnter?.(e);
  };
  return (
    <SidebarButtonStyled
      {...props}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}>
      {children}
      {isSelected && !props.disabled && <SidebarButtonStick />}
    </SidebarButtonStyled>
  );
};

export default SidebarButton;
