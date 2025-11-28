"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface GitHubRepository {
	id: number;
	name: string;
	private: boolean;
	html_url: string;
	description: string | null;
	language: string | null;
}

interface RepositoriesComboboxProps {
	repositories: GitHubRepository[];
	onSelectRepo?: (repo: GitHubRepository) => void;
}

export function RepositoriesCombobox({ repositories, onSelectRepo }: RepositoriesComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState<GitHubRepository | null>(null);

	const handleSelect = (repo: GitHubRepository) => {
		setSelected(repo);
		setOpen(false);
		onSelectRepo?.(repo);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{selected ? selected.name : "Select a repository..."}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[280px] p-0">
				<Command>
					<CommandInput placeholder="Search repositories..." />
					<CommandList>
						<CommandEmpty>No repositories found.</CommandEmpty>

						<CommandGroup>
							{repositories.map((repo) => (
								<CommandItem key={repo.id} value={repo.name} onSelect={() => handleSelect(repo)}>
									<CheckIcon
										className={cn(
											"mr-2 h-4 w-4",
											selected?.id === repo.id ? "opacity-100" : "opacity-0",
										)}
									/>
									<div className="flex flex-col">
										<span>{repo.name}</span>

										<span
											className={cn(
												"text-xs",
												repo.private ? "text-red-500" : "text-muted-foreground",
											)}
										>
											{repo.private ? "Private" : "Public"}
										</span>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
