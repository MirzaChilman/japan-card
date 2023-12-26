import { TableCell, TableRow } from "@/components/ui/table";
import { memo } from "react";
interface Props {
	id: number;
	vocabulary: string;
	kanji: string;
	description: string;
	group: string;
	freq: number;
	checked: boolean;
	onClick: (id: number) => void;
}

const Row = ({
	id,
	vocabulary,
	kanji,
	description,
	group,
	freq,
	checked,
	onClick,
}: Props) => {
	console.log("rendered");
	return (
		<TableRow key={id}>
			<TableCell>
				<input onClick={() => onClick(id)} type="checkbox" checked={checked} />
			</TableCell>
			<TableCell>{id}</TableCell>
			<TableCell>{vocabulary}</TableCell>
			<TableCell>{kanji}</TableCell>
			<TableCell>{description}</TableCell>
			<TableCell>{group}</TableCell>
			<TableCell>{freq}</TableCell>
		</TableRow>
	);
};

export default memo(Row);
