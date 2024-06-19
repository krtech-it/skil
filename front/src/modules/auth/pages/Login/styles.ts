import styled from "styled-components";
import { Form, ModalWindow } from "@quark-uilib/components";

export const FormWrapper = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
` as typeof Form;

export const ModalWindowStyled = styled(ModalWindow)`
  background: ${({ theme }) => theme.colors.grayscale3};
`
