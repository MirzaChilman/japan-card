"use client";

import { useMemo, useCallback } from "react";

import { Dropdown } from "./Dropdown";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { dataAtom, dataGroupAtom, selectedGroupAtom } from "../atom/data";

export const HeaderAction = () => {
	const data = useAtomValue(dataAtom);
	const group = useAtomValue(dataGroupAtom);
	const [selectedGroup, setSelectedGroup] = useAtom(selectedGroupAtom);
	const dataGroup = useMemo(() => {
		return new Set([...data.map((datum) => datum.group)].filter(Boolean));
	}, [data]);

	const dataOptions = useMemo(() => {
		return Array.from(dataGroup).map((key) => {
			return {
				label: key,
				value: key,
			};
		});
	}, [dataGroup]);

	const handleValueChange = useCallback(
		(value: string) => {
			setSelectedGroup(value);
		},
		[setSelectedGroup],
	);

	return (
		<section className="my-5">
			<Dropdown
				items={dataOptions}
				selectedValue={selectedGroup || ""}
				onValueChange={handleValueChange}
			/>
		</section>
	);
};
