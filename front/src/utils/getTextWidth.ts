export const getTextWidth = (text: string, font?: string): number => {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.font = font ? font : context.font;
  const textWidth = Math.floor(context.measureText(text).width);
  canvas.remove();
  return textWidth;
};
