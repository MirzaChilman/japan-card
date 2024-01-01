"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface Item {
	value: string;
	label: string;
}

interface DropdownProps {
	items: Item[];
	selectedValue?: string;
	onValueChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(
	({ items, selectedValue, onValueChange }) => {
		const [open, setOpen] = React.useState(false);

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between"
					>
						{selectedValue?.toLocaleUpperCase() || "Select item..."}
						{/* {selectedValue
							? items.find((item) => item.value === selectedValue)?.label
							: "Select item..."} */}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search item..." />
						<CommandEmpty>No item found.</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={(currentValue) => {
										onValueChange(
											currentValue === selectedValue ? "" : currentValue,
										);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedValue === item.value
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{item.label}
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		);
	},
);
Dropdown.displayName = "Dropdown";
