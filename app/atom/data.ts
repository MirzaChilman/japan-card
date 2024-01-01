import { atom } from "jotai";

interface Data {
	id: number;
	vocabulary: string;
	kanji: string;
	description: string;
	group: string;
	freq: number;
	checked?: boolean;
}

export const dataAtom = atom<Data[]>([]);

export const dataGroupAtom = atom<{ label: string; value: string } | null>(
	null,
);

export const selectedGroupAtom = atom<string | null>(null);
