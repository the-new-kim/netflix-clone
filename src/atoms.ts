import { atom } from "recoil";

export const bannerTrailerAtom = atom({
  key: "toDos",
  default: {
    id: null,
    type: null,
    playing: false,
    muted: true,
  },
});
