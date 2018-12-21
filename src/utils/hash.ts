import { createHash } from "crypto";

export const md5 = (data: string): string => {
  return createHash("md5")
    .update(data)
    .digest("hex");
};
