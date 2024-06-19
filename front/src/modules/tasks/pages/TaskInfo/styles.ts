import styled from "styled-components";

export const SubHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  flex-wrap: wrap;

  .field-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const MarkdownContent = styled.div`
  overflow: auto;
`;
