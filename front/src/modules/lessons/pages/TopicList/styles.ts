import { Button } from "@quark-uilib/components";
import styled from "styled-components";

export const LessonListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

export const LessonWrapper = styled(Button)`

`;

export const StyledTableRow = styled.tr`
  margin: 0;
  padding: 0;
  border: 0;
  width: 100%;
  box-sizing: border-box;
  border-collapse: separate;
  border-spacing: 0px;
  &:hover{
      background: rgb(243, 244, 246);
  }
`;

export const StyledTableColumn = styled.td`
padding: 16px;

`;