"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Data, GroupDataById } from "../dummyTableData";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const StudyPage = () => {
	const router = useRouter();
	const [data, setData] = useState<GroupDataById | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [reveal, setReveal] = useState(false);

	const shuffleData = useCallback((originalData: GroupDataById) => {
		const keys = Object.keys(originalData);

		for (let i = keys.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[keys[i], keys[j]] = [keys[j], keys[i]];
		}

		const shuffled: GroupDataById = {};
		let index = 0;
		for (const key of keys) {
			shuffled[index] = originalData[key];
			index++;
		}

		return shuffled;
	}, []);

	useEffect(() => {
		const savedData = localStorage.getItem("data");
		if (savedData) {
			const parsedData: GroupDataById = JSON.parse(savedData);
			const shuffledData = shuffleData(parsedData);
			setData(shuffledData);
		}
	}, [shuffleData]);

	const handleNextClickButton = () => {
		setReveal(false);
		setCurrentIndex((prev) => prev + 1);
	};

	const handleRefresh = () => {
		if (data) {
			const shuffledData = shuffleData(data);
			setData(shuffledData);
		}
		setCurrentIndex(0);
	};

	const handleShowClickButton = () => {
		setReveal(true);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case "Enter":
				console.log("test");
				handleNextClickButton();
				break;
			case " ":
				handleShowClickButton();
				break;
			default:
				break;
		}
	};

	const currentData = data?.[currentIndex];

	console.log({ data });

	const hasKanji =
		currentData &&
		(currentData.kanji.onyomi !== "-" || currentData.kanji.kunyomi !== "-");

	return (
		// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
		<main className="m-5" onKeyDown={handleKeyDown} tabIndex={0}>
			<div>
				<Button onClick={() => router.back()}>Back</Button>
				<Button onClick={handleRefresh}>Refresh</Button>
			</div>
			<section>
				<Card className="w-2/3 mx-auto mt-5 shadow-xl text-center">
					{!currentData && (
						<p className="text-3xl flex justify-center h-[278px] items-center">
							Finish
						</p>
					)}
					{currentData && (
						<>
							<CardHeader>
								<CardTitle className="text-5xl">
									{hasKanji ? (
										<>
											{currentData.kanji.kunyomi} /{currentData.kanji.onyomi}
										</>
									) : (
										<span>{currentData.japanese}</span>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-2xl">
									{reveal ? currentData.romaji : "-"}
								</CardDescription>
								<CardDescription className="text-2xl">
									{reveal ? currentData.japanese : "-"}
								</CardDescription>
								<CardDescription className="text-2xl">
									{reveal ? currentData.description : "-"}
								</CardDescription>
							</CardContent>
							<CardFooter className="flex gap-2 justify-center">
								<Button onClick={handleShowClickButton}>Show</Button>
								<Button onClick={handleNextClickButton}>Next</Button>
								<p>
									{currentIndex + 1} of {Object.keys(data || {}).length}
								</p>
							</CardFooter>
						</>
					)}
				</Card>
			</section>
		</main>
	);
};

export default StudyPage;
