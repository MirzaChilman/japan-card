"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DataNew } from "../page";

const StudyPage = () => {
	const router = useRouter();
	const [data, setData] = useState<DataNew[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [reveal, setReveal] = useState(false);

	const shuffleData = useCallback((originalData: DataNew[]) => {
		const data = [...originalData]; // create a copy of the original data
		let currentIndex = data.length;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			const temporaryValue = data[currentIndex];
			data[currentIndex] = data[randomIndex];
			data[randomIndex] = temporaryValue;
		}

		return data;
	}, []);

	useEffect(() => {
		const savedData = localStorage.getItem("data");
		if (savedData) {
			const parsedData = JSON.parse(savedData);
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

	const hasKanji = currentData?.kanji;

	return (
		// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
		<main className="m-5" onKeyDown={handleKeyDown} tabIndex={0}>
			<div>
				<Button onClick={() => router.back()}>Back</Button>
				<Button onClick={handleRefresh}>Refresh</Button>
			</div>
			<section>
				<Card className="w-full mx-auto mt-5 flex flex-col shadow-xl text-center min-h-[400px]">
					{!currentData && (
						<p className="text-3xl flex justify-center h-[278px] items-center">
							Finish
						</p>
					)}
					{currentData && (
						<>
							<CardHeader className="flex-2">
								<CardTitle className="text-5xl">
									{hasKanji ? currentData.kanji : currentData.vocabulary}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-1 text-left">
								<CardDescription className="text-2xl">
									{reveal ? currentData.vocabulary : "-"}
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
