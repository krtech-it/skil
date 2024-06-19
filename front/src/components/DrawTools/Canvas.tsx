import { useEffect, useRef } from "react";
import { DrawTools } from "./DrawTools";
import { CanvasStyled, CanvasWrapper } from "./styles";

export interface ICanvasProps {
  width?: number;
  height?: number;
  footerArea?: JSX.Element;
}

export const Canvas = ({
  width,
  height,
  }: ICanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawTools = DrawTools.getInstance();
  const canvasSize = useRef<[number, number]>([100, 100]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    drawTools.init(canvasRef.current);
    canvasSize.current = [canvasRef.current.width, canvasRef.current.height];

    return () => {
      drawTools.destroy();
    };
  }, []);


  return (
    <CanvasWrapper width={width} height={height}>
      <CanvasStyled
        ref={canvasRef}
        id="canvas-doc-preview"
        // width={width}
        // height={height}
      />
    </CanvasWrapper>
  );
};
