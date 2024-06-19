import Paper from "paper";
import { v4 as uuidv4 } from "uuid";
import {
  DEFAULT_DRAWTOOLS_CONFIG,
  FALLBACK_BACKING_SIZE,
  FALLBACK_UUID_KEY
} from "./constants";
import { getDefinedRectStyle } from "./helpers";
import { ISetBackingData, TDrawToolsConfig, TRect } from "./types";

export class DrawTools {
  static instance: DrawTools; // синглтон инстанс
  private canvas: HTMLCanvasElement; // реф на канвас элемент
  private config: TDrawToolsConfig = DEFAULT_DRAWTOOLS_CONFIG; // конфиг, можно настроить снаружи

  private rasterLayer: paper.Layer; // слой, на котором всё рисуется

  private toolView: paper.Tool; // тул, обрабатывающий логику работы с мышкой, зумом и т.п.

  private drawGroup: paper.Group; // группа для объединения всех объектов

  private backing: paper.Raster | undefined = undefined; // объект подложки
  private startPoint: paper.Point;
  private drawRectangle: paper.Path.Rectangle | null;
  public isDraw = false;

  private onDrawSave:
    | ((arg0: { x: number; y: number }, arg1: { x: number; y: number }) => void)
    | undefined;

  private backingWidth: number = 0; // исходный размер текущей подложки
  private backingHeght: number = 0; // исходный размер текущей подложки
  private backingScalingW: number = 1; // текущий масштаб относительно исходных размеров
  private backingScalingH: number = 1; // текущий масштаб относительно исходных размеров

  public rects: Map<string, paper.Path.Rectangle> = new Map(); // МАП якорей и других прямоугольников, задающихся извне
  private flagIsLoadingBacking: boolean = false; // флаг загрузки изображения подложки, не даёт вносить изменения в значимые параметры отрисовки

  public onCallbackLoadBacking: () => void;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}

  static getInstance(): DrawTools {
    if (!DrawTools.instance) {
      DrawTools.instance = new DrawTools();
    }
    return DrawTools.instance;
  }

  public init(canvas: HTMLCanvasElement): void {
    Paper.setup(canvas);
    this.canvas = canvas;
    this.createRasterLayer();
    this.activateToolView();
  }

  public destroy(): void {
    this.backing?.remove();
    this.backing = undefined;
    this.backingScalingH = 1;
    this.backingScalingW = 1;
    this.destroyRasterLayer();
    this.reset();
    this.rects = new Map();
    this.onDrawSave = undefined;
  }

  public setonDrawSave = (
    func:
      | ((
          arg0: { x: number; y: number },
          arg1: { x: number; y: number }
        ) => void)
      | undefined
  ) => {
    this.onDrawSave = func;
  };

  public reset(): void {
    this.removeRects();
  }

  public setConfig = <T extends keyof TDrawToolsConfig>(
    key: T,
    data: TDrawToolsConfig[T]
  ): void => {
    this.config[key] = data;
  };

  public setIsLoadingBacking(state: boolean): void {
    this.flagIsLoadingBacking = state;
  }

  private removeRects(): void {
    this.rects.forEach((rect) => rect.remove());
    this.rects = new Map();
  }

  private createRasterLayer(): void {
    this.rasterLayer = new Paper.Layer();
  }

  public addRect(data: TRect | string): string | undefined {
    if (!this.rasterLayer) {
      return undefined;
      // throw new Error("Raster layer not exists");
    }
    if (typeof data === "string") {
      return this.rects.has(data) ? data : undefined;
    }

    this.rasterLayer?.activate();

    const res = new Paper.Path.Rectangle(
      new Paper.Point(data.topLeft),
      new Paper.Point(data.bottomRight)
    );

    res.scale(this.backingScalingW);

    const positionX =
      (this.backing?.bounds?.topLeft ?? new Paper.Point(0, 0)).x +
      res.bounds.width / 2 +
      data.topLeft.x * this.backingScalingW;
    const positionY =
      (this.backing?.bounds?.topLeft ?? new Paper.Point(0, 0)).y +
      res.bounds.height / 2 +
      data.topLeft.y * this.backingScalingW;

    res.position = new Paper.Point(positionX, positionY);

    this.drawGroup && res.addTo(this.drawGroup);
    res.bringToFront();
    res.style = getDefinedRectStyle();

    const uuid = uuidv4();
    res.data = { ...res.data, uuid };
    this.rects.set(uuid, res);

    return uuid;
  }

  public removeRect(id: string | undefined): void {
    this.rects.get(id ?? FALLBACK_UUID_KEY)?.remove();
    this.rects.delete(id ?? FALLBACK_UUID_KEY);
  }

  public setBacking({ data, size }: ISetBackingData): void {
    const prevPositionX = this.backing?.bounds?.topLeft?.x ?? 0;
    const prevPositionY = this.backing?.bounds?.topLeft?.y ?? 0;
    this.backingWidth = size?.[0] ?? FALLBACK_BACKING_SIZE;
    this.backingHeght = size?.[1] ?? FALLBACK_BACKING_SIZE;

    this.backing?.remove();

    this.rasterLayer.activate();

    const rasterConfig = {
      source: data,
      position: new Paper.Point(
        prevPositionX + this.backingWidth / 2,
        prevPositionY + this.backingHeght / 2
      )
    };

    this.backing = new Paper.Raster(rasterConfig);
    this.backing.applyMatrix = true;

    this.backing.onLoad = () => {
      this.backing?.sendToBack();
      this.fitImageToView();

      this.onCallbackLoadBacking?.();

      setTimeout(() => {
        this.setIsLoadingBacking(false);
        this.fitAllToView();
      }, 666);
    };
  }

  private fitImageToView(): void {
    if (!this.backing) {
      return;
    }
    const scalePoint = this.backing.bounds.topLeft;
    this.backing.scale(this.backingScalingW, scalePoint);
  }

  public fitAllToView(): void {
    if (!this.backing || !this.drawGroup || this.flagIsLoadingBacking) {
      return;
    }
    let scalingFactor: number = 1;

    const rasterWidth = this.backing?.bounds.width ?? this.canvas.clientWidth;
    const rasterHeight =
      this.backing?.bounds.height ?? this.canvas.clientHeight;
    if (rasterWidth >= rasterHeight) {
      scalingFactor = this.canvas.clientWidth / rasterWidth;
    } else {
      scalingFactor = this.canvas.height / rasterHeight;
    }
    this.drawGroup?.scale(scalingFactor);
    this.backingScalingW = this.backingScalingW * scalingFactor;
    this.backingScalingH = this.backingScalingH * scalingFactor;
  }

  private activateToolView(): void {
    this.toolView = new Paper.Tool();
    this.toolView.onMouseDown = (event: paper.MouseEvent): void => {
      if (this.isDraw) {
        this.startPoint = event.point;
        this.drawRectangle = new Paper.Path.Rectangle({
          point: this.startPoint,
          size: [0, 0],
          strokeColor: new Paper.Color("rgba(0, 138, 105, 1)"),
          fillColor: new Paper.Color("rgba(0, 138, 105, 0.2)")
        });
      }
    };

    this.toolView.onMouseUp = (event: paper.MouseEvent): void => {
      if (this.isDraw) {
        if (
          event.point.x <= this.backingWidth &&
          event.point.y <= this.backingHeght
        ) {
          this.onDrawSave?.(
            { x: this.startPoint.x, y: this.startPoint.y },
            { x: event.point.x, y: event.point.y }
          );
          this.drawRectangle = null;
        } else {
          this.drawRectangle?.remove();
          this.drawRectangle = null;
        }
      }
    };

    this.toolView.onMouseDrag = (event: paper.MouseEvent): void => {
      if (this.isDraw) {
        if (this.drawRectangle) {
          this.drawRectangle.remove();
          if (
            event.point.x <= this.backingWidth &&
            event.point.y <= this.backingHeght
          ) {
            this.drawRectangle = new Paper.Path.Rectangle({
              from: this.startPoint,
              to: event.point,
              strokeColor: new Paper.Color("rgba(0, 138, 105, 1)"),
              fillColor: new Paper.Color("rgba(0, 138, 105, 0.2)")
            });
          } else {
            this.drawRectangle = new Paper.Path.Rectangle({
              from: this.startPoint,
              to: event.point,
              fillColor: new Paper.Color("rgba(199, 0, 0, 0.2)"),
              strokeColor: new Paper.Color("rgba(199, 0, 0, 1)")
            });
          }
        }
      }
    };

    const wheelHandler = (e: WheelEvent): void => {
      e.stopPropagation();
      e.preventDefault();
      if (!this.backing || this.flagIsLoadingBacking) {
        return;
      }
      const h = this.backing?.view?.bounds?.height ?? Number.MAX_SAFE_INTEGER;
      const scaleFactor = 1 - (Math.sign(e.deltaY) * Math.abs(e.deltaY)) / h;
      const point = Paper.view.projectToView(
        new Paper.Point(e.offsetX, e.offsetY)
      );
      this.drawGroup?.scale(scaleFactor, point);
      const absWidth = Math.abs(
        Math.abs(
          this.backing?.bounds?.bottomRight?.x ?? FALLBACK_BACKING_SIZE
        ) - Math.abs(this.backing?.bounds?.topLeft?.x ?? FALLBACK_BACKING_SIZE)
      );
      const absHeight = Math.abs(
        Math.abs(
          this.backing?.bounds?.bottomRight?.y ?? FALLBACK_BACKING_SIZE
        ) - Math.abs(this.backing?.bounds?.topLeft?.y ?? FALLBACK_BACKING_SIZE)
      );
      this.backingScalingW = absWidth / this.backingWidth;
      this.backingScalingH = absHeight / this.backingHeght;
    };

    this.canvas.addEventListener("wheel", wheelHandler);

    this.toolView.activate();
  }

  private destroyRasterLayer(): void {
    this.backing?.remove();
    this.drawGroup?.remove();
    this.rasterLayer?.remove();
  }
}
