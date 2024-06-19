import { ITheme } from "@quark-uilib/components";
import styled from "styled-components";

export const ImagesToolsRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px 0px 0px 16px;
  background-color: ${({ theme }) => (theme as ITheme).colors.grayscale3};
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: stretch;
  overflow: auto;
`;

export const DocumentList = styled.div`
  overscroll-behavior-x: none;
  position: relative;
  width: 120px;
  height: 100%;
  overflow-y: auto;
  padding: 16px 16px 16px 8px;
  background-color: ${({ theme }) => (theme as ITheme).colors.grayscale1};

  box-sizing: border-box;

  & > * {
    margin-bottom: 8px;
  }

  flex-shrink: 0;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
`;

export const DocumentPreviewWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  width: 88px;
  padding: 4px;
  transition: background-color 60ms ease-in;
  background-color: ${({ theme, isSelected }) =>
    isSelected
      ? (theme as ITheme).colors.componentSecondaryJotPressed
      : "transparent"};

  &:hover {
    background-color: ${({ theme }) =>
      (theme as ITheme).colors.componentSecondaryJotHover};
  }
`;
export const DocumentPreviewItem = styled.div`
  position: relative;
  width: 80px;
  height: 53px;
  overflow: none;
  padding: 4px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background-color: #ffffff;
`;

export const ViewAreaWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;

  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: stretch;
`;

export const CanvasStyled = styled.canvas`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  overscroll-behavior-x: none;
`;

export const CanvasWrapper = styled.div<{ width?: number; height?: number }>`
  position: relative;
  width: ${({ width }) => width ?? "100%"};
  height: ${({ height }) => height ?? "calc(100% - 48px)"};
`;

export const FooterArea = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  gap: 24px;
  align-items: center;
`;
