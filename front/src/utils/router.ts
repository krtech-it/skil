import { matchPath } from "react-router-dom";

export const setPathParameter = (
  path: string,
  paramName: string,
  paramValue: unknown
): string =>
  path.replace(new RegExp(`:${paramName}`, "ig"), paramValue as string);

export const setPathParameters = (
  path: string,
  params: Record<string, unknown>
): string => {
  let result = path;
  Object.keys(params).forEach((paramName) => {
    result = setPathParameter(result, paramName, params[paramName]);
  });
  return result;
};

export const matchRoutes = (path: string, url: string): string | null => {
  const match = matchPath(url, path);
  return match && match.pathname;
};
