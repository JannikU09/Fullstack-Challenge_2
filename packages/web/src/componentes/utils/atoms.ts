import { atom } from "jotai";

export const pageSizeValueAtom = atom([5, 20, 50, 75, 100]);
export const dateAtom = atom(new Date().toLocaleDateString("de-DE"));
export const timeAtom = atom(new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }));