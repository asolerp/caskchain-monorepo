import { Magic } from "magic-sdk";

export const createMagic = (key: string, config: any) => {
  // We make sure that the window object is available
  // Then we create a new instance of Magic using a publishable key
  return typeof window !== "undefined" && new Magic(key, config);
};
