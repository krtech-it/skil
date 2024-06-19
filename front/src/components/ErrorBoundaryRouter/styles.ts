import styled from "styled-components";
import { LIGHT_THEME } from "@quark-uilib/components";

export const ErrorWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundPrimaryMain};

  .title {
    color: ${({ theme }) => theme.colors.textBasicPressed};
  }

  .description {
    color: ${({ theme }) => theme.colors.textBasicDefault};
  }
`;

ErrorWrapper.defaultProps = {
  theme: LIGHT_THEME
};
