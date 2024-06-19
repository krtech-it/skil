import React, { useState } from "react";
import { Button, ITheme, ModalWindow } from "@quark-uilib/components";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import Error503Dark from "src/assets/503Dark.svg?react";
import Error503Light from "src/assets/503Light.svg?react";
import { clientRoutes } from "src/routes/constants";

const Error503: React.FC = () => {
  const theme = useTheme() as ITheme;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (): void => {
    setIsOpen(false);
    navigate(clientRoutes.main.path);
    window.location.reload();
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      type="fullscreen"
      isHiddenCloseButton
      footerContent={
        <Button onClick={handleClick}>Вернуться на главную</Button>
      }>
      {theme.name === "dark" ? <Error503Dark /> : <Error503Light />}
    </ModalWindow>
  );
};

export default Error503;
