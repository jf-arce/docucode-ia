"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, FileCode, Globe, ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { Loader2 } from "./Loader";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import "github-markdown-css/github-markdown.css";
import { exportAsMarkdown, exportAsPDF, exportAsHTML } from "@/utils/file-exports";

interface DocumentationPanelProps {
	documentation: string;
	isGenerating: boolean;
	doc_language: string;
	onLanguageChange: (language: string) => void;
}

export function DocumentationPanel({
	documentation,
	isGenerating,
	doc_language,
	onLanguageChange,
}: DocumentationPanelProps) {
	const handleExport = (format: string) => {
		if (!documentation) {
			toast.error("No documentation to export", {
				description: "There is no content to download.",
				duration: 3000,
			});
			return;
		}

		try {
			const timestamp = new Date().toISOString().split("T")[0];
			const filename = `documentation-${timestamp}`;

			switch (format) {
				case "markdown":
					exportAsMarkdown(documentation, filename);
					break;
				case "pdf":
					exportAsPDF(documentation, filename);
					break;
				case "html":
					exportAsHTML(documentation, filename);
					break;
				default:
					throw new Error("Unsupported format");
			}

			toast.success("Exported successfully", {
				description: `Documentation exported as ${format.toUpperCase()}`,
				duration: 3000,
			});
		} catch (error) {
			console.error("Export error:", error);
			toast.error("Export failed", {
				description: "There was an error exporting the documentation.",
				duration: 3000,
			});
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="min-h-[65px] flex items-center justify-between border-b border-border bg-card px-4 py-3">
				<h2 className="font-mono text-sm font-medium text-foreground">
					Generated Documentation: {document.title}
				</h2>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
								<span className="text-base">
									{doc_language === "English" ? (
										<span className="fi fi-us fis rounded-full"></span>
									) : (
										<span className="fi fi-es fis rounded-full"></span>
									)}
								</span>
								<ChevronDown className="h-3.5 w-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem onClick={() => onLanguageChange("English")}>
								<div className="flex items-center gap-2">
									<span className="fi fi-us fis rounded-full"></span>
									<span>English</span>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onLanguageChange("Spanish")}>
								<div className="flex items-center gap-2">
									<span className="fi fi-es fis rounded-full"></span>
									<span>Spanish</span>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
			</div>

			<div className="flex-1 bg-editor-bg overflow-hidden">
				{isGenerating ? (
					<div className="min-h-[calc(100vh-65px)] flex h-full items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<Loader2 size={40} stroke={2} speed={1} />
							<p className="text-sm text-muted-foreground">Generating documentation...</p>
						</div>
					</div>
				) : documentation ? (
					<div
						className="markdown-body h-full p-4 w-full overflow-auto text-sm leading-relaxed"
						style={{ backgroundColor: "transparent" }}
					>
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={{
								code({
									className,
									children,
									...props
								}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) {
									const match = /language-(\w+)/.exec(className || "");
									const isInline = !(className && className.includes("language-"));
									return !isInline && match ? (
										<SyntaxHighlighter
											style={vscDarkPlus}
											language={match[1]}
											PreTag="div"
											className="rounded-md my-2"
											customStyle={{
												backgroundColor: "transparent",
												margin: 0,
											}}
											{...props}
										>
											{String(children).replace(/\n$/, "")}
										</SyntaxHighlighter>
									) : (
										<code className={className} {...props}>
											{children}
										</code>
									);
								},
								tr: ({ ...props }) => <tr style={{ backgroundColor: "transparent" }} {...props} />,
							}}
						>
							{documentation}
						</ReactMarkdown>
					</div>
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
