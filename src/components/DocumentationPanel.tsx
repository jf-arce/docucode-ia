"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, FileCode, Globe } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

interface DocumentationPanelProps {
	documentation: string;
	setDocumentation: (doc: string) => void;
	isGenerating: boolean;
}

export function DocumentationPanel({
	documentation,
	setDocumentation,
	isGenerating,
}: DocumentationPanelProps) {
	const handleExport = (format: string) => {
		if (!documentation) {
			toast.error("No documentation to export", {
				description: "There is no content to download.",
				duration: 3000,
			});
			return;
		}

		toast.success("Exported", {
			description: `Documentation exported as ${format.toUpperCase()}`,
			duration: 3000,
		});
	};

	return (
		<div className="flex w-1/2 flex-col">
			<div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
				<h2 className="font-mono text-sm font-medium text-foreground">Generated Documentation</h2>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-8 gap-2 bg-transparent"
							disabled={!documentation || isGenerating}
						>
							<Download className="h-3.5 w-3.5" />
							Export
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleExport("markdown")}>
							<FileText className="mr-2 h-4 w-4" />
							Markdown
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleExport("pdf")}>
							<FileCode className="mr-2 h-4 w-4" />
							PDF
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleExport("html")}>
							<Globe className="mr-2 h-4 w-4" />
							HTML
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex-1 overflow-auto bg-editor-bg p-4">
				{isGenerating ? (
					<div className="flex h-full items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<Spinner className="h-8 w-8 text-primary" />
							<p className="text-sm text-muted-foreground">Generating documentation...</p>
						</div>
					</div>
				) : documentation ? (
					<textarea
						value={documentation}
						onChange={(e) => setDocumentation(e.target.value)}
						className="h-full w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-foreground outline-none"
						placeholder="Documentation will appear here..."
						spellCheck={false}
					/>
				) : (
					<div className="flex h-full items-center justify-center">
						<div className="text-center">
							<FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
							<p className="mt-4 text-sm text-muted-foreground">
								Click &quotDocument&quot to generate documentation
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
