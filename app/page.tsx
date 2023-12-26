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
import { Data, GroupDataById, dummyData } from "./dummyTableData";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
	useReactTable,
	type ColumnDef,
	getCoreRowModel,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import Row from "./components/Row";

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

	const [data, setData] = useState<DataNew[]>([]);
	const [isAllChecked, setIsAllChecked] = useState(false);

	const saveToLocalStorage = useCallback((data: DataNew[]) => {
		localStorage.setItem("data", JSON.stringify(data));
	}, []);

	const inputFile = useRef<HTMLInputElement>(null);

	const handleImportClick = () => {
		inputFile.current?.click();
	};

	const handleAllClick = useCallback(() => {
		setIsAllChecked((prev) => !prev);

		setData((prevData) =>
			prevData.map((datum) => ({ ...datum, checked: !isAllChecked })),
		);
	}, [isAllChecked]);

	const handleRowClick = useCallback((id: number) => {
		setData((prevData) =>
			prevData.map((datum) =>
				datum.id === id ? { ...datum, checked: !datum.checked } : datum,
			),
		);
	}, []);

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
			{!isEmpty && (
				<Table>
					<TableCaption>A list of your japanese.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>
								<input
									onClick={handleAllClick}
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
						{data.map((datum) => {
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
									onClick={handleRowClick}
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
