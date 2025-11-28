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
import { Skeleton } from "./ui/skeleton";
import { GitHubIcon } from "./Icons";

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
	repoSelected: GitHubRepository | null;
	onSelectRepo?: (repo: GitHubRepository) => void;
}

export function RepositoriesCombobox({
	repositories,
	repoSelected,
	onSelectRepo,
}: RepositoriesComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState<GitHubRepository | null>(null);

	React.useEffect(() => {
		setSelected(repoSelected || null);
	}, [repoSelected]);

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
						<CommandEmpty className="p-2">
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<GitHubIcon size={24} fill="gray" className="animate-pulse delay-100" />
									<Skeleton className="h-8 w-full delay-100" />
								</div>
								<div className="flex items-center gap-2">
									<GitHubIcon size={24} fill="gray" className="animate-pulse delay-300" />
									<Skeleton className="h-8 w-full delay-300" />
								</div>
								<div className="flex items-center gap-2">
									<GitHubIcon size={24} fill="gray" className="animate-pulse delay-500" />
									<Skeleton className="h-8 w-full delay-500" />
								</div>
							</div>
						</CommandEmpty>

						<CommandGroup>
							{repositories.map((repo) => (
								<CommandItem
									key={repo.id}
									value={repo.name}
									onSelect={() => handleSelect(repo)}
									className="cursor-pointer"
								>
									<CheckIcon
										className={cn(
											"mr-2 h-4 w-4",
											selected?.id === repo.id ? "opacity-100" : "opacity-0",
										)}
									/>
									<div className="flex flex-col">
										<span className="flex items-center gap-2">
											<GitHubIcon size={24} fill="gray" />
											{repo.name}
										</span>

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
