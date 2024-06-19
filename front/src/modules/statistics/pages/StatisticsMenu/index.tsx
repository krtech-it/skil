import React, { useMemo } from "react";
import { IconDiagram, IconHome1, IconTask, IconUserOctagon } from "@quark-uilib/icons";
import EnterCard from "../../../home/components/EnterCard";
import { EnterCardWrapper, HomePageBlockServicesWrapper } from "./styles";
import HeaderPage from "src/components/HeaderPage";
import { IBreadcrumbItem } from "@quark-uilib/components";
import { clientRoutes } from "src/routes/constants";
import { useNavigate } from "react-router";

const StatisticMenuPage: React.FC = () => {
   const navigate = useNavigate();
  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconDiagram/>,
        text: "Статистика",
        viewType: "current",
      },
    ],
    []
  );
  return (
    <>
      <HeaderPage
        title={`Статистика`}
        isBackButton={false}
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
      />
      <HomePageBlockServicesWrapper>
        <EnterCardWrapper>
          <EnterCard
            title="Рейтинг по заданиям"
            description="Топ студентов по выполненным заданиям"
            icon={<IconTask />}
            colorType="alvheim"
            path="/taskRating"
          />
          <EnterCard
            title="Рейтинг студентов"
            description="Топ всех студентов"
            icon={<IconUserOctagon />}
            colorType="uthgard"
            path={"/topRating"}
          />
          <EnterCard
            title="Рейтинг задач"
            description="Топ всех выполненных задач"
            icon={<IconUserOctagon />}
            colorType="uthgard"
            path={"/tasksRating"}
          />
          <EnterCard
            title="Статистика студента"
            description="Статистика конкретного студента"
            icon={<IconUserOctagon />}
            colorType="freyja"
            path={"/userStatistics"}
          />
        </EnterCardWrapper>
      </HomePageBlockServicesWrapper>
    </>
  );
};

export default StatisticMenuPage;
