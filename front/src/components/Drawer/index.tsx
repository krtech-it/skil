import React, { useRef } from "react";
import { Button, H, useOnClickOutside } from "@quark-uilib/components";
import { IconClose } from "@quark-uilib/icons";
import { IDrawerProps } from "./types";
import {
  DrawerHeaderStyled,
  DrawerWrapper,
  DrawerStyled,
  DrawerHeaderTextWrapper,
  DrawerContentWrapper
} from "./styles";

const Drawer: React.FC<React.PropsWithChildren<IDrawerProps>> = ({
  children,
  title,
  subtitle,
  onClose,
  isOpen
}) => {
  const refDrawer = useRef<HTMLDivElement>(null);

  useOnClickOutside(refDrawer, onClose);

  if (isOpen) {
    return (
      <DrawerStyled>
        <DrawerWrapper ref={refDrawer}>
          <DrawerHeaderStyled>
            <DrawerHeaderTextWrapper>
              <H type="cancer" className="title">
                {title}
              </H>
              <Button viewType="icon" onClick={onClose}>
                <IconClose />
              </Button>
            </DrawerHeaderTextWrapper>
            {subtitle && (
              <H type="libra" className="subtitle">
                {subtitle}
              </H>
            )}
          </DrawerHeaderStyled>
          <DrawerContentWrapper>{children}</DrawerContentWrapper>
        </DrawerWrapper>
      </DrawerStyled>
    );
  }
  return null;
};

export default Drawer;
