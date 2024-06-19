import styled from "styled-components";
import { Media } from "@quark-uilib/components";
import { lightTheme } from "src/services/theme/constants";

export const SidebarWrapper = styled.div`
  height: 100%;
  width: 157px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.sidebarBg};
  ${Media.desktopM`
    width: 88px;
    padding: 24px 20px;
  `}
  color: ${({ theme }) => theme.colors.sidebarIcon};
`;

SidebarWrapper.defaultProps = {
  theme: lightTheme
};

export const SidebarHeaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;

  .avatar_icon {
    width: 48px;
    height: 48px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .title {
    padding: 8px;
    color: ${({ theme }) => theme.colors.sidebarIcon};
  }
`;

LogoWrapper.defaultProps = {
  theme: lightTheme
};

export const SidebarFooterStyled = styled.div``;
