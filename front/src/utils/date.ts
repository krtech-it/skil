import { format, parse, parseISO } from "date-fns";

export const formatDateToServer = (value: string): string =>
  format(parse(value, "dd.MM.yyyy", new Date()), "yyyy-MM-dd");

export const formatDateToClient = (value: string): string =>
  format(parse(value, "yyyy-MM-dd", new Date()), "dd.MM.yyyy");

export const formatDateFromTimestampToClient = (value: string): string =>
  format(parseISO(value), "dd.MM.yyyy hh:mm");
