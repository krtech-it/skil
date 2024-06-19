import styled from "styled-components";
import { Media } from "@quark-uilib/components";
import { IEnterCardProps } from "./types";
import { lightTheme } from "src/services/theme/constants";

type TEnterCardStyledProps = Pick<IEnterCardProps, "colorType">;

const getNameColorTokenHover = (
  colorType: TEnterCardStyledProps["colorType"]
): string => {
  if (colorType === "alvheim") {
    return "componentSecondaryAlvDefault";
  }
  if (colorType === "freyja") {
    return "componentSecondaryFrDefault";
  }
  if (colorType === "uthgard") {
    return "componentSecondaryUthDefault";
  }
  if (colorType === "jotunheim") {
    return "componentSecondaryJotDefault";
  }
  return "";
};

export const EnterCardStyled = styled.button<TEnterCardStyledProps>`
  cursor: pointer;
  border: none;
  display: flex;
  padding: 24px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  align-items: center;
  border-radius: 32px;
  background: ${({ theme, colorType }) =>
    theme.colors[
      `backgroundSecondary${colorType.charAt(0).toUpperCase()}${colorType.slice(
        1
      )}`
    ]};

  .entry-card__title {
    color: ${({ theme }) => theme.colors.textBasicPressed};
  }

  .entry-card__description {
    color: ${({ theme }) => theme.colors.textBasicDefault};
  }

  svg {
    color: ${({ theme }) => theme.colors.textBasicHover};
  }

  &:hover {
    background: ${({ theme, colorType }) =>
      theme.colors[getNameColorTokenHover(colorType)]};
  }

  &:disabled {
    cursor: not-allowed;
    background: ${({ theme, colorType }) =>
      theme.colors[
        `backgroundSecondary${colorType
          .charAt(0)
          .toUpperCase()}${colorType.slice(1)}`
      ]};

    .entry-card__title {
      color: ${({ theme }) => theme.colors.textBasicDisabled};
    }

    .entry-card__description {
      color: ${({ theme }) => theme.colors.textBasicDisabled};
    }

    svg {
      color: ${({ theme }) => theme.colors.textBasicDisabled};
    }
  }

  img {
    width: 100%;
    padding: 12px 16px;
  }
`;

EnterCardStyled.defaultProps = {
  theme: lightTheme
};

export const EnterCardTextBlockStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  padding: 40px;
  background: ${({ theme }) => theme.colors.backgroundTetriary0};
  border-radius: 32px;
  height: 100%;
  width: 100%;

  ${Media.desktopL`
    padding: 24px;
  `};

  ${Media.desktopM`
    padding: 20px 12px;
  `};
`;

EnterCardTextBlockStyled.defaultProps = {
  theme: lightTheme
};

export const EnterCardTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;
