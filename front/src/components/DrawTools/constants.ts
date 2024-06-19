import Paper from "paper";
import { TDrawToolsConfig } from "./types";

export const BASE64_PREFIX = "data:image/jpeg;base64, ";

export const DEFAULT_RECT_STYLE: paper.Style = new Paper.Style({
  strokeWidth: 1,
  fillColor: new Paper.Color("rgba(0, 138, 105, 0.2)"),
  strokeColor: new Paper.Color("rgba(0, 138, 105, 1)"),
  dashArray: []
});

export const FAILED_RECT_STYLE: paper.Style = new Paper.Style({
  strokeWidth: 1,
  fillColor: new Paper.Color("rgba(199, 0, 0, 0.2)"),
  strokeColor: new Paper.Color("rgba(199, 0, 0, 1)"),
  dashArray: []
});



export const DEFAULT_DRAWTOOLS_CONFIG: TDrawToolsConfig = {
  allowAutoFill: false
};

export const FALLBACK_BACKING_SIZE = -1;
export const FALLBACK_UUID_KEY = "=|_?_|_?_|=";
