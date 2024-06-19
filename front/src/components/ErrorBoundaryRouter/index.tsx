import React from "react";
import { useTheme } from "styled-components";
import { LIGHT_THEME, ITheme, H, P2 } from "@quark-uilib/components";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import Page404Light from "src/assets/404Light.svg?react";
import Page404Dark from "src/assets/404Dark.svg?react";
import ErrorLight from "src/assets/errorLight.svg?react";
import ErrorDark from "src/assets/errorDark.svg?react";
import { ErrorWrapper } from "./styles";

const ErrorBoundaryRouter: React.FC = () => {
  const error = useRouteError();
  const theme = (useTheme() ?? LIGHT_THEME) as ITheme;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorWrapper>
          {theme.name === "light" ? <Page404Light /> : <Page404Dark />}
        </ErrorWrapper>
      );
    } else {
      return (
        <ErrorWrapper>
          {theme.name === "light" ? <ErrorLight /> : <ErrorDark />}
          <H type={"aries"} className="title">
            {error.status}
          </H>
          <P2 type="pisces" className="description">
            {error.statusText}
          </P2>
        </ErrorWrapper>
      );
    }
  }

  if (error instanceof Error) {
    return (
      <ErrorWrapper>
        <H type="aries" className="title">
          Неожиданная ошибка
        </H>
        <P2 type="pisces" className="description">
          {error.message}
        </P2>
      </ErrorWrapper>
    );
  }
  return null;
};

export default ErrorBoundaryRouter;
