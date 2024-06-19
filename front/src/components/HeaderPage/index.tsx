import React from "react";
import { IconArrowLeft } from "@quark-uilib/icons";
import { Breadcrumbs, P1, H, Button } from "@quark-uilib/components";
import { IHeaderPageProps } from "./types";
import { HeaderPageStyled, HeaderPageTextWrapper } from "./styles";
import { useNavigate } from "react-router-dom";

const HeaderPage: React.FC<IHeaderPageProps> = ({
  title,
  breadcrumbs,
  description,
  maxNoCollapsedItems,
  leadContent,
  isBackButton = true,
}) => {
  const navigate = useNavigate();
  return (
    <HeaderPageStyled>
      {breadcrumbs && (
        <Breadcrumbs
          items={breadcrumbs}
          maxNoCollapsedItems={maxNoCollapsedItems}
        />
      )}
      <HeaderPageTextWrapper>
        <div className="column">
        <H type="leo" className="title">
          {title}
        </H>
        {description && (
          <P1 type="phoenix" className="description">
            {description}
          </P1>
        )}
        </div>
        {leadContent && <div>{leadContent}</div>}
      </HeaderPageTextWrapper>
    </HeaderPageStyled>
  );
};

export default HeaderPage;
