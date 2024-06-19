import styled, { css } from "styled-components";
import { LIGHT_THEME } from "@quark-uilib/components";

export const DrawerStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.overlay2};
  z-index: ${({ theme }) => theme.zindex.drawer};
  display: flex;
  justify-content: end;
`;

DrawerStyled.defaultProps = {
  theme: LIGHT_THEME
};

export const DrawerWrapper = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: flex-start;
  border-radius: 24px 0;
  background: ${({ theme }) => theme.colors.backgroundPrimaryMain};
  height: 100%;
  width: 30%;
  min-width: 375px;
`;

DrawerWrapper.defaultProps = {
  theme: LIGHT_THEME
};

export const DrawerHeaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;

  ${({ theme }) => css`
    .title {
      color: ${theme.colors.textBasicPressed};
    }

    .subtitle {
      color: ${theme.colors.textColoredJotunheim};
    }
  `}
`;

export const DrawerHeaderTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

DrawerHeaderTextWrapper.defaultProps = {
  theme: LIGHT_THEME
};

export const DrawerContentWrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`;
