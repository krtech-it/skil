import { Button, Input, MultiSelect, Select } from "@quark-uilib/components";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { DrawTools } from "./DrawTools";
import { PreviewList } from "./PreviewList";
import { ImagesToolsRoot, ViewAreaWrapper, FooterArea } from "./styles";
import { IImagesToolsProps } from "./types";
import { useStores } from "src/dal";

export const ImagesTools = observer(
  ({
    images,
    onChangeComments,
    className,
    onChangeImage,
    isClearRect,
    handleResetArea,
    commentsA = [],
    isReadOnlyComment = "true",
    defects = []
  }: IImagesToolsProps): JSX.Element => {
      const [selectedDefects, setselectedDefects] = useState([])
    const { AuthStore } = useStores();
    const [comments, setComments] = useState<string[]>(commentsA);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const drawTools = DrawTools.getInstance();

    async function getImageDimensions(
      base64String: string
    ): Promise<{ width: number; height: number }> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = `${base64String}`;
      });
    }

    const setImageFull = async (): Promise<void> => {
      if (typeof selectedIndex === "number") {
        drawTools.setIsLoadingBacking(true);
        const dimensions = await getImageDimensions(
          "data:image/png;base64, " + images[selectedIndex]
        );
        drawTools.setIsLoadingBacking(true);
        drawTools.setBacking({
          data: "data:image/png;base64, " + images[selectedIndex],
          size: [dimensions.width, dimensions.height]
        });
      }
    };

    useEffect(() => {
      setImageFull();
    }, [selectedIndex]);

    const handleSelectItem = (index: number): void => {
      setSelectedIndex(index);
      onChangeImage?.(index);
    };

    const handleChangeComment = (value: string): void => {
        if (!value) {
            setselectedDefects([])
        }
      if (typeof selectedIndex === "number") {
        const _comments = [...comments];
        _comments[selectedIndex] = value;
        setComments([..._comments]);
        onChangeComments(_comments);
      }
    };

    const handleChangeDefect = (value): void => {
        setselectedDefects(value);
      if (typeof selectedIndex === "number") {
        const _comments = [...comments];
        _comments[selectedIndex] = `${value.map((v) => v.value).join(". ")}. ${
          _comments[selectedIndex]
        }`;
        setComments([..._comments]);
        onChangeComments(_comments);
      }
    };

    return (
      <ImagesToolsRoot className={className}>
        <ViewAreaWrapper>
          <Canvas />
          <FooterArea>
            <MultiSelect
                value={selectedDefects}
              onChange={handleChangeDefect}
              placeholder="Выберите дефекты или заполните поле комментарий в ручную"
              options={defects?.map((value) => ({ label: value, value }))}
            />
            <Input
              isReadOnly={!AuthStore.isAdmin && isReadOnlyComment !== "true"}
              value={
                typeof selectedIndex === "number" ? comments[selectedIndex] : ""
              }
              placeholder="Комментарий"
              onChange={(_, value) => handleChangeComment(value)}
            />
            {isClearRect && AuthStore.isAdmin && (
              <Button
                isDisabled={!drawTools.rects.size}
                viewType="secondary"
                size="m"
                onClick={() => handleResetArea?.(selectedIndex as number)}>
                Очистить разметку ML
              </Button>
            )}
          </FooterArea>
        </ViewAreaWrapper>
        <PreviewList
          images={images}
          selectedIndexImage={selectedIndex}
          onSelectImage={handleSelectItem}
        />
      </ImagesToolsRoot>
    );
  }
);
