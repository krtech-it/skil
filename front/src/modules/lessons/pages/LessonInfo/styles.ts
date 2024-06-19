import styled from "styled-components";

export const LessonInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: auto;
`;

export const ListWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;

  li {
    height: max-content;
  }
`;

export const StyledSubHeader = styled.div`
  width: 100%;
  display: flex;
  gap: 32px;
  position: relative;
  .subheader-container {
    display: flex;
    gap: 12px;
    box-sizing: border-box;
    flex-direction: column;
    align-items: start;
  }
  .right {
    position: absolute;
    right: 0;
  }
`;
