import React, { useEffect, useMemo, useState } from "react";
import { HeaderWrapper, LessonListWrapper } from "./styles";
import HeaderPage from "src/components/HeaderPage";
import { TColumn, Table } from "@quark-uilib/table";
import LessonApi from "../../api";
import { ILesson, ITopic, ITrait } from "../../types";
import {
  Button,
  IBreadcrumbItem,
  Input,
  Tooltip,
  openSnackBar,
  useDebounce
} from "@quark-uilib/components";
import { generatePath, useNavigate, useParams } from "react-router";
import { clientRoutes } from "src/routes/constants";
import { lessonsRoutes } from "../../constants";
import { IconBook1, IconEye1, IconHome1 } from "@quark-uilib/icons";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "src/components/Pdf";
import { useStores } from "src/dal";

const API = new LessonApi();

const LessonListPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>();
  const [searchLessons, setSearchLessons] = useState<ILesson[] | []>([]);
  const [topic, setTopic] = useState<ITopic>();
  const [traits, setTraits] = useState<ITrait[] | []>([]);

  const params = useParams();
  const {AuthStore} = useStores();
  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconBook1 />,
        text: "Темы",
        onClick: () => navigate(clientRoutes.topicList.path)
      },
      {
        icon: <IconBook1 />,
        text: "Уроки",
        viewType: "current"
      }
    ],
    []
  );

  useEffect(() => {
    if (params.topicID) {
      API.getTopicLessons(params.topicID)
        .then((result) => {
          if (result.data) {
            const { data } = result;
            if (data?.lessons) {
              setTopic(data);
            }
          }
        })
        .catch(() =>
          openSnackBar({
            message: "Ошибка при загрузке данных",
            status: "error"
          })
        );
    }
    API.getTraits()
      .then((result) => {
        if (!result.data) {
          return;
        }
        setTraits(result.data);
      })
      .catch(() =>
        openSnackBar({
          message: "Ошибка при загрузке данных",
          status: "error"
        })
      );
  }, []);

  const navigate = useNavigate();
  const columns = useMemo<TColumn[]>(
    () => [
      {
        width: "50%",
        field: "title",
        title: "Название",
        isSortable: true,
        sortMenuItems: [
          {
            options: [
              { title: "А-Я", nameSort: "alphabet-asc" },
              { title: "Я-А", nameSort: "alphabet-desc" }
            ]
          }
        ],
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "alphabet-asc") {
            return valueA < valueB ? -1 : 1;
          }
          if (nameSort === "alphabet-desc") {
            return valueA > valueB ? -1 : 1;
          }
          return 0;
        }
      },
      {
        width: "20%",
        field: "author",
        title: "Автор",
        isSortable: true,
        sortMenuItems: [
          {
            options: [
              { title: "А-Я", nameSort: "alphabet-asc" },
              { title: "Я-А", nameSort: "alphabet-desc" }
            ]
          }
        ],
        comparator: (valueA, valueB, nameSort) => {
          if (nameSort === "alphabet-asc") {
            return valueA < valueB ? -1 : 1;
          }
          if (nameSort === "alphabet-desc") {
            return valueA > valueB ? -1 : 1;
          }
          return 0;
        }
      },
      {
        width: "20%",
        field: "traits",
        title: "Теги",
        valueGetter: ({ data }) =>
          data.traits?.map((traits: { name: string }) => traits.name),
        columnTypes: "tags",
        isFilter: true,
        filterFunc: (params) => {
          return (params.value as unknown as string[]).some((v) =>
            params.filterParams.includes(v)
          );
        },
        filterMenuItems: [
          {
            title: "Теги",
            options: traits.map((trait) => ({
              title: trait.name,
              name: trait.name
            }))
          }
        ]
      },
      {
        width: "10%",
        field: "asfd",
        title: " ",
        cellRenderer: () => (
          <Tooltip text="Открыть" direction="left">
            <Button viewType="icon">
              <IconEye1 />
            </Button>
          </Tooltip>
        )
      }
    ],
    [topic]
  );
  const rows = !searchText ? topic?.lessons ?? [] : searchLessons;

  const handleLessonClick = (data: any) => {
    if (!data.description) {
      navigate(
        generatePath(lessonsRoutes.lessonInfo.path, {
          topicID: params.topicID,
          lessonID: data.id
        })
      );
    }
  };

  const filterLessons = (searchText: string) => {
    const filtered = topic?.lessons?.filter((lesson) => {
      const searchSubject = [
        lesson.title,
        lesson.author,
        lesson.content,
        lesson.traits?.join(",")
      ].join(" ");
      return searchSubject.toLowerCase().includes(searchText);
    });
    if (filtered) {
      setSearchLessons(filtered);
    }
  };

  const setSearch = (searchText: string) => {
    setSearchText(searchText);
    setSearchDebounce(searchText);
  };

  const setSearchDebounce = useDebounce(filterLessons, 200);

  const handleGeneratePDF = (): void => {
if(!topic){
  openSnackBar({message: "Не удалось получить тему, пожалуйста обновите страницу", status: 'error'});
  return;
}
if(!AuthStore.user || !AuthStore.user?.full_name){
  openSnackBar({message: "Не удалось получить пользователя", status: 'error'});
  return;
}
    API.getDiplomaData(topic.id).then(async (res) => {

      const honors = !res.data.map((task) => task?.grade == 5).includes(false);
      const blob = await pdf(
        PDFDocument(honors, topic.title, AuthStore.user.full_name, "A4", res.data)
      ).toBlob();
      const link = document.createElement("a");
      link.download = "Диплом.pdf";
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(() => openSnackBar({message: "Не удалось выполнить запрос", status: "error"})); 

  };

  
  return (
    <>
      <HeaderWrapper>
      <HeaderPage
        title="Уроки"
        description={`По теме: ${topic?.title}`}
        breadcrumbs={breadcrumbs}
        maxNoCollapsedItems={2}
        leadContent={!AuthStore.isAdmin && topic?.status === 'progress' ? <Button onClick={handleGeneratePDF}>Получить диплом</Button> : undefined}
      />
      </HeaderWrapper>
      <LessonListWrapper>
        <Input
          placeholder={"Поиск по урокам"}
          onChange={(_e, value) => setSearch(value)}
          value={searchText}
        />
        <Table
          columns={columns}
          rowData={rows}
          rowClicked={(event) => handleLessonClick(event.data)}
        />
      </LessonListWrapper>
    </>
  );
};

export default LessonListPage;
