import styled, { createGlobalStyle, css } from "styled-components";
import { ITheme, Media } from "@quark-uilib/components";
import { lightTheme } from "src/services/theme/constants";

export const GlobalStyle = createGlobalStyle`
  tbody {
    tr {
      cursor: pointer;
    }
  }
  
  #root {
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* Make clicks pass-through */
  #nprogress {
    pointer-events: none;
  }

  #nprogress .bar {
    background: blue;

    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;

    width: 100%;
    height: 3px;
  }

  /* Fancy blur effect */
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0;
    width: 100px;
    height: 100%;
    box-shadow: ${({ theme }: { theme: ITheme }) =>
      css`0 0 10px ${theme.colors.jotunheim1}  0 0 5px ${theme.colors.jotunheim1}`};
    opacity: 1;
    transform: rotate(3deg) translate(0px, -4px);
  }
`;

GlobalStyle.defaultProps = {
  theme: lightTheme
};

export const MainWrapper = styled.main`
  height: 100vh;
  min-width: 375px;
  display: flex;
  flex-direction: row;
  background: ${({ theme }) => theme.colors.sidebarBg};
  overscroll-behavior-x: none;
`;

MainWrapper.defaultProps = {
  theme: lightTheme
};

export const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-top-left-radius: 40px;
  background: ${({ theme }) => theme.colors.backgroundPrimaryMain};

  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  color: ${({ theme }) => theme.colors.textBasicPressed};
  overflow: auto;

  ${Media.desktopL`
    padding: 32px;
  `};

  ${Media.desktopM`
    padding: 24px;
  `};
`;

PageWrapper.defaultProps = {
  theme: lightTheme
};
