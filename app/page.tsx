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
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
	useReactTable,
	type ColumnDef,
	getCoreRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	const router = useRouter();

	const [data, setData] = useState<Data[]>(dummyData);
	const [isAllChecked, setIsAllChecked] = useState(false);

	const saveToLocalStorage = useCallback((data: GroupDataById) => {
		localStorage.setItem("data", JSON.stringify(data));
	}, []);

	const handleAllClick = () => {
		const newData = data.map((datum) => {
			return { ...datum, checked: !isAllChecked };
		});
		setIsAllChecked(!isAllChecked);
		setData(newData);
	};

	const handleRowClick = (index: number) => {
		const newData = data.map((datum, i) => {
			if (i === index) {
				return { ...datum, checked: !datum.checked };
			}
			return datum;
		});
		setData(newData);
	};

	const handleStudyButtonClick = () => {
		const newData = data.filter((datum) => datum.checked);
		const groupedData = newData.reduce<Record<string, Data>>(
			(acc, datum, index) => {
				acc[index] = datum;
				return acc;
			},
			{},
		);

		saveToLocalStorage(groupedData);
		router.push("/study");
	};

	const columns = useMemo(() => {
		const res: ColumnDef<Data>[] = [
			{
				accessorKey: "checked",
				header: "Checked",
			},
			{
				accessorKey: "romaji",
				header: "Romaji",
			},
		];
		return res;
	}, []);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<main className="m-5">
			<div>
				<Button onClick={handleStudyButtonClick}>Study</Button>
			</div>
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
						<TableHead>Romaji</TableHead>
						<TableHead>Japanese</TableHead>
						<TableHead>Onyomi</TableHead>
						<TableHead>Kunyomi</TableHead>
						<TableHead>description</TableHead>
						<TableHead>JLPT</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((datum, index) => (
						<TableRow key={datum.romaji + index}>
							<TableCell>
								<input
									onClick={() => handleRowClick(index)}
									type="checkbox"
									checked={datum.checked}
								/>
							</TableCell>
							<TableCell>{datum.romaji}</TableCell>
							<TableCell>{datum.japanese}</TableCell>
							<TableCell>{datum.kanji.onyomi}</TableCell>
							<TableCell>{datum.kanji.kunyomi}</TableCell>
							<TableCell>{datum.description}</TableCell>
							<TableCell>{datum.level}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={3}>Total</TableCell>
						<TableCell className="text-right">{dummyData.length}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</main>
	);
}
