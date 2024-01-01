"use client";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import Row from "./components/Row";
import { EmptyState } from "./components/EmptyState";
import { HeaderAction } from "./components/HeaderAction";
import { useAtom, useAtomValue } from "jotai";
import { dataAtom, dataGroupAtom, selectedGroupAtom } from "./atom/data";

export interface DataNew {
	id: number;
	kanji: string;
	vocabulary: string;
	description: string;
	freq: number;
	group: string;
	checked?: boolean;
}

export default function Home() {
	const router = useRouter();

	const [data, setData] = useAtom(dataAtom);
	const group = useAtomValue(dataGroupAtom);
	const selectedGroup = useAtomValue(selectedGroupAtom);
	const [isAllChecked, setIsAllChecked] = useState(false);

	const saveToLocalStorage = useCallback((data: DataNew[]) => {
		localStorage.setItem("data", JSON.stringify(data));
	}, []);

	const inputFile = useRef<HTMLInputElement>(null);

	const handleImportClick = () => {
		inputFile.current?.click();
	};

	const filteredData = useMemo(() => {
		return data.filter((datum) =>
			selectedGroup
				? datum.group?.toLocaleLowerCase() ===
				  selectedGroup?.toLocaleLowerCase()
				: true,
		);
	}, [data, selectedGroup]);

	const handleAllChange = useCallback(() => {
		setIsAllChecked((prev) => !prev);

		setData(
			filteredData.map((datum) => ({ ...datum, checked: !isAllChecked })),
		);
	}, [filteredData, isAllChecked, setData]);

	const handleRowChange = useCallback(
		(id: number) => {
			setData((prevData) =>
				prevData.map((datum) =>
					datum.id === id ? { ...datum, checked: !datum.checked } : datum,
				),
			);
		},
		[setData],
	);

	const handleStudyButtonClick = () => {
		const newData = data.filter((datum) => datum.checked);
		saveToLocalStorage(newData);
		router.push("/study");
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || new File([], "");
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = new Uint8Array(e.target?.result as ArrayBuffer);
			const workbook = XLSX.read(data, { type: "array" });
			const worksheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[worksheetName];
			const jsonData = XLSX.utils.sheet_to_json<DataNew>(worksheet, {
				blankrows: false,
			});
			setData(jsonData);
		};
		reader.readAsArrayBuffer(file);
	};

	const isEmpty = data.length === 0;

	return (
		<main className="m-5">
			<div className="flex gap-2">
				<Button onClick={handleStudyButtonClick}>Study</Button>
				<Button onClick={handleImportClick}>
					Import data
					<input
						ref={inputFile}
						type="file"
						accept=".xlsx,.xls"
						onChange={handleFileUpload}
						style={{ display: "none" }}
					/>
				</Button>
			</div>
			<HeaderAction />
			{isEmpty && <EmptyState onClick={handleImportClick} />}
			{!isEmpty && (
				<Table className="mt-5">
					<TableCaption>A list of your japanese.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>
								<input
									onChange={handleAllChange}
									type="checkbox"
									checked={isAllChecked}
								/>{" "}
							</TableHead>
							<TableHead>Id</TableHead>
							<TableHead>Vocabulary</TableHead>
							<TableHead>Kanji</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Group</TableHead>
							<TableHead>Freq</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredData.map((datum) => {
							if (!datum.vocabulary) return;
							return (
								<Row
									key={datum.id}
									id={datum.id}
									vocabulary={datum.vocabulary}
									kanji={datum.kanji}
									description={datum.description}
									group={datum.group}
									freq={datum.freq}
									checked={datum?.checked || false}
									onChange={handleRowChange}
								/>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">{data.length - 1}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			)}
		</main>
	);
}
