import styled from "styled-components";

export const FilterWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  .tabs {
    flex-wrap: nowrap;

    button {
      width: max-content;
    }
  }
`;

export const TaskListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
