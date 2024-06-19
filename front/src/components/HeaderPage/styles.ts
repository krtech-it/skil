import styled from "styled-components";
import { LIGHT_THEME } from "@quark-uilib/components";

export const HeaderPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
`;

export const HeaderPageTextWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;
  justify-content: space-between;
  .column{
     flex-direction: column;
  }
  .title {
    color: ${({ theme }) => theme.colors.textBasicPressed};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .description {
    color: ${({ theme }) => theme.colors.textBasicDefault};
  }
`;

HeaderPageTextWrapper.defaultProps = {
  theme: LIGHT_THEME
};
