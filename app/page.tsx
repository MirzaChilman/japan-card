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

export default function Home() {
	const router = useRouter();

	const [data, setData] = useState<string[]>([]);
	const [isAllChecked, setIsAllChecked] = useState(false);

	const saveToLocalStorage = useCallback((data: GroupDataById) => {
		localStorage.setItem("data", JSON.stringify(data));
	}, []);

	const inputFile = useRef<HTMLInputElement>(null);

	const handleImportClick = () => {
		inputFile.current?.click();
	};

	const handleAllClick = () => {
		// const newData = data.map((datum) => {
		// 	return { ...datum, checked: !isAllChecked };
		// });
		// setIsAllChecked(!isAllChecked);
		// setData(newData);
	};

	const handleRowClick = (index: number) => {
		// const newData = data.map((datum, i) => {
		// 	if (i === index) {
		// 		return { ...datum, checked: !datum.checked };
		// 	}
		// 	return datum;
		// });
		// setData(newData);
	};

	const handleStudyButtonClick = () => {
		// const newData = data.filter((datum) => datum.checked);
		// const groupedData = newData.reduce<Record<string, Data>>(
		// 	(acc, datum, index) => {
		// 		acc[index] = datum;
		// 		return acc;
		// 	},
		// 	{},
		// );
		// saveToLocalStorage(groupedData);
		// router.push("/study");
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || new File([], "");
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = new Uint8Array(e.target?.result as ArrayBuffer);
			const workbook = XLSX.read(data, { type: "array" });
			const worksheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[worksheetName];
			const jsonData = XLSX.utils.sheet_to_json<string>(worksheet, {
				header: 1,
			});
			const filteredData = jsonData.filter((row) =>
				Object.values(row).some((value) => value !== null && value !== ""),
			);
			setData(filteredData);
		};
		reader.readAsArrayBuffer(file);
	};

	const isEmpty = data.length === 0;

	console.log({ data });

	return (
		<main className="m-5">
			<div>
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
							<TableHead>{data[0][0]}</TableHead>
							<TableHead>{data[0][1]}</TableHead>
							<TableHead>{data[0][2]}</TableHead>
							<TableHead>{data[0][3]}</TableHead>
							<TableHead>{data[0][4]}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((datum, index) => {
							if (index === 0) return;
							return (
								<TableRow key={datum[0] + index}>
									<TableCell>
										<input
											onClick={() => handleRowClick(index)}
											type="checkbox"
										/>
									</TableCell>
									<TableCell>{datum?.[0]}</TableCell>
									<TableCell>{datum?.[1]}</TableCell>
									<TableCell>{datum?.[2]}</TableCell>
									<TableCell>{datum?.[3]}</TableCell>
									<TableCell>{datum?.[4]}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">{dummyData.length}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			)}
		</main>
	);
}
