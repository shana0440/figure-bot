import { URL } from "url";

export const encodeURL = (url: string): string => {
  return new URL(url).toString();
};
