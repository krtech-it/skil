import React, { useEffect, useMemo, useState } from "react";
import { LessonListWrapper } from "./styles";
import HeaderPage from "src/components/HeaderPage";
import { TColumn, Table } from "@quark-uilib/table";
import LessonApi from "../../api";
import { ITopic, ITrait } from "../../types";
import {
  Button,
  IBreadcrumbItem,
  Input,
  Status,
  Tooltip,
  openSnackBar,
  useDebounce
} from "@quark-uilib/components";
import { generatePath, useNavigate } from "react-router";
import { clientRoutes } from "src/routes/constants";
import { lessonsRoutes } from "../../constants";
import { IconBook1, IconEye1, IconHome1 } from "@quark-uilib/icons";

const API = new LessonApi();
const LessonListPage: React.FC = () => {
  const breadcrumbs = useMemo<IBreadcrumbItem[]>(
    () => [
      {
        icon: <IconHome1 />,
        onClick: () => navigate(clientRoutes.home.path)
      },
      {
        icon: <IconBook1 />,
        text: "Темы",
        viewType: "current"
      }
    ],
    []
  );
  const [searchText, setSearchText] = useState<string>();
  const [searchTopics, setSearchTopics] = useState<ITopic[] | []>([]);
  const [topics, setTopics] = useState<ITopic[] | []>([]);
  const [traits, setTraits] = useState<ITrait[] | []>([]);

  useEffect(() => {
    API.getLessonsList()
      .then((result) => {
        if (!result.data) {
          return;
        }
        setTopics(result.data);
      })
      .catch(() =>
        openSnackBar({
          message: "Ошибка при загрузке данных",
          status: "error"
        })
      );
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
        field: "description",
        title: "Описание",
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
        field: "traits",
        title: "Теги",
        valueGetter: ({ data }) =>
          data.traits.map((traits: { name: string }) => traits.name),
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
        field: "id",
        title: " ",
        cellRenderer: () => (
          <Tooltip text="Открыть" direction="left">
            <Button viewType="icon">
              <IconEye1 />
            </Button>
          </Tooltip>
        )
      },
    ],
    [topics]
  );
  const rows = !searchText ? topics ?? [] : searchTopics;

  const handleTopicClick = (data: any) => {
    navigate(
      generatePath(lessonsRoutes.lessonsList.path, { topicID: data.id })
    );
  };

  const filterTopics = (searchText: string) => {
    const filtered = topics?.filter((topic) => {
      const searchSubject = [
        topic.title,
        topic.description,
      ].join(" ");
      return (
        searchSubject.toLowerCase().includes(searchText));
    });
    setSearchTopics(filtered);
  };

  const setSearch = (searchText: string) => {
    setSearchText(searchText);
    setSearchDebounce(searchText);
  };

  const setSearchDebounce = useDebounce(filterTopics, 200);

  return (
    <>
      <HeaderPage
        title="Темы учебных материалов"
        description="Список тем"
        breadcrumbs={breadcrumbs}
      />
      <LessonListWrapper>
        <Input
          placeholder={"Поиск по темам"}
          onChange={(_e, value) => setSearch(value)}
          value={searchText}
        />
        <Table
          columns={columns}
          rowData={rows}
          rowClicked={(event) => handleTopicClick(event.data)}
        />
      </LessonListWrapper>
    </>
  );
};

export default LessonListPage;
