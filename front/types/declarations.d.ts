/* eslint-disable import/no-default-export */

declare const __ENV__: "development";
declare const __VERSION__: string;
declare const __COMMIT_HASH__: string;
declare const __BRANCH__: string;
declare const __LAST_COMMIT_DATE_TIME__: string;

declare module "*.css" {
  const css: any;
  export default css;
}

declare module "*.svg?react" {
  const content: any;
  export default content;
}

declare module "*.svg?url" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.gif" {
  const content: any;
  export default content;
}

declare module "*.webm" {
  const content: any;
  export default content;
}

declare module "*.mp4" {
  const content: any;
  export default content;
}

declare module "*.json";

declare module "nprogress";
declare module "packages";
declare module "packages/*";
