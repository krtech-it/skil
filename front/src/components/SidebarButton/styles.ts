import styled, { css } from "styled-components";
import { rgba } from "polished";
import { lightTheme } from "src/services/theme/constants";

export const SidebarButtonStyled = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  width: 48px;
  height: 48px;
  gap: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > * {
    color: ${({ theme }) => theme.colors.sidebarIcon};
  }

  &:hover {
    border-radius: 16px;
    ${({ theme }) => css`
      & > * {
        color: ${theme.colors.sidebarIconHover};
      }
      background: ${rgba(theme.colors.grayscale0, 0.24)};
    `}
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textBasicDisabled};
  }
`;

SidebarButtonStyled.defaultProps = {
  theme: lightTheme
};

export const SidebarButtonStick = styled.div`
  width: 8px;
  height: 2px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.sidebarIcon};
`;

SidebarButtonStick.defaultProps = {
  theme: lightTheme
};
