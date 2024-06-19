import React, { useState } from "react";
import {
  IconBook1,
  IconDiagram,
  IconTask,
  IconImport
} from "@quark-uilib/icons";
import EnterCard from "../../components/EnterCard";
import { EnterCardWrapper, HomePageBlockServicesWrapper } from "./styles";
import HeaderPage from "src/components/HeaderPage";
import LessonImage from "src/assets/lessons.webp";
import TaskImage from "src/assets/task.webp";
import StatisticImage from "src/assets/statistic.webp";
import DataImage from "src/assets/data.webp";
import { useStores } from "src/dal";
import { ModalUploadData } from "src/components/ModalUploadData";

const HomePage: React.FC = () => {
  const { AuthStore } = useStores();
  const [isOpenModal, setIsOpenModal] = useState(false);
  console.log(isOpenModal)
  return (
    <>
      <HeaderPage
        title={`Добро пожаловать, ${AuthStore.user?.full_name}!`}
        isBackButton={false}
        description={
          AuthStore.isAdmin ? "Обучай, наставляй" : "Начни обучение сейчас"
        }
      />
      <HomePageBlockServicesWrapper>
        <EnterCardWrapper>
          <EnterCard
            image={LessonImage}
            title="Учебные материалы"
            description="Выбирай и учись"
            icon={<IconBook1 />}
            colorType="alvheim"
            path="/topics"
          />
          <EnterCard
            image={TaskImage}
            title={AuthStore.isAdmin ? "Задачи" : "Мои задачи"}
            description={
              !AuthStore.isAdmin
                ? "Посмотри свои задачи"
                : "Проверь выполнения заданий студентами"
            }
            icon={<IconTask />}
            colorType="uthgard"
            path={"/tasks"}
          />
          {AuthStore.isAdmin ? (
            <>
              <EnterCard
                image={StatisticImage}
                title="Статистика"
                description="Статистика студентов"
                icon={<IconDiagram />}
                colorType="freyja"
                path={"/statistics"}
              />{" "}
              <EnterCard
                image={DataImage}
                title="Добавить данные"
                description="Импорт данных"
                icon={<IconImport />}
                colorType="jotunheim"
                onClick={() => setIsOpenModal(true)}
              />
            </>
          ) : (
            <EnterCard
              image={StatisticImage}
              title="Моя статистика"
              description="Статистика по моим заданиям"
              icon={<IconDiagram />}
              colorType="freyja"
              path={"/myStatistics"}
            />
          )}
        </EnterCardWrapper>
      </HomePageBlockServicesWrapper>
      <ModalUploadData
        isOpen={isOpenModal}
        handleClose={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default HomePage;
