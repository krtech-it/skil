import React, { useState } from "react";
import { H, P2 } from "@quark-uilib/components";
import { useNavigate } from "react-router-dom";
import { IEnterCardProps } from "./types";
import {
  EnterCardStyled,
  EnterCardTextBlockStyled,
  EnterCardTextWrapper
} from "./styles";

const EnterCard: React.FC<IEnterCardProps> = ({
  image,
  hoverImage,
  icon,
  title,
  path,
  isDisabled,
  description,
  colorType,
  onClick
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (): void => {
    setIsHovered(true);
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  const handleClick = (): void => {
    if (path) {
      navigate(path);
    }
    onClick?.();
  };
  return (
    <EnterCardStyled
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      colorType={colorType}
      disabled={isDisabled}>
      {image && (
        <img src={isHovered && hoverImage ? hoverImage : image} alt="title" />
      )}
      <EnterCardTextBlockStyled>
        {icon}
        <EnterCardTextWrapper>
          <H type="libra" className="entry-card__title">
            {title}
          </H>
          <P2 type="corvus" className="entry-card__description">
            {description}
          </P2>
        </EnterCardTextWrapper>
      </EnterCardTextBlockStyled>
    </EnterCardStyled>
  );
};

export default EnterCard;
