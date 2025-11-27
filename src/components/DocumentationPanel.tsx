"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, FileCode, Globe } from "lucide-react";
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

import html2pdf from "html2pdf.js";

interface DocumentationPanelProps {
	documentation: string;
	isGenerating: boolean;
}

export function DocumentationPanel({ documentation, isGenerating }: DocumentationPanelProps) {
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
					downloadAsMarkdown(documentation, filename);
					break;
				case "pdf":
					downloadAsPDF(documentation, filename);
					break;
				case "html":
					downloadAsHTML(documentation, filename);
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

	const downloadAsMarkdown = (content: string, filename: string) => {
		const blob = new Blob([content], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${filename}.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const downloadAsPDF = (content: string, filename: string) => {
		// Convertir Markdown a HTML usando ReactMarkdown de manera temporal
		const tempContainer = document.createElement("div");
		tempContainer.style.padding = "30px";
		tempContainer.style.maxWidth = "800px";
		tempContainer.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
		tempContainer.style.lineHeight = "1.6";
		tempContainer.style.backgroundColor = "#ffffff";
		tempContainer.style.color = "#111827";
		tempContainer.innerHTML = `
		<h1 style="text-align:center; font-size: 22px; border-bottom: 2px solid #007acc; padding-bottom: 10px;">Code Documentation</h1>
		<div id="markdown-content"></div>
	`;

		document.body.appendChild(tempContainer);

		// Renderizamos el markdown dentro del div temporal
		import("react-dom/server").then(({ renderToString }) => {
			const html = renderToString(
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
								<pre
									style={{
										background: "#1e1e1e",
										color: "#dcdcdc",
										padding: "10px",
										borderRadius: "6px",
										overflowX: "auto",
										fontFamily: "'Fira Code', monospace",
									}}
								>
									<code {...props}>{String(children).replace(/\n$/, "")}</code>
								</pre>
							) : (
								<code
									style={{
										background: "#f4f4f4",
										padding: "2px 4px",
										borderRadius: "4px",
										fontFamily: "'Fira Code', monospace",
									}}
									{...props}
								>
									{children}
								</code>
							);
						},
					}}
				>
					{content}
				</ReactMarkdown>,
			);

			// Insertamos el HTML generado en el contenedor
			const markdownContainer = tempContainer.querySelector("#markdown-content");
			if (markdownContainer) markdownContainer.innerHTML = html;

			html2pdf()
				.set({
					margin: 0.5,
					filename: `${filename}.pdf`,
					image: { type: "jpeg" as const, quality: 0.98 },
					html2canvas: { scale: 2 },
					jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
				})
				.from(tempContainer)
				.save()
				.then(() => {
					document.body.removeChild(tempContainer);
				});
		});
	};

	const downloadAsHTML = (content: string, filename: string) => {
		// Convertir saltos de línea a <br> y envolver en HTML básico
		const htmlContent = content.replace(/\n/g, "<br>");

		const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Documentation</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            line-height: 1.6;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #007acc;
            padding-bottom: 10px;
        }
        pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>Code Documentation</h1>
        <pre>${htmlContent}</pre>
    </div>
</body>
</html>`;

		const blob = new Blob([html], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${filename}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="min-h-[65px] flex items-center justify-between border-b border-border bg-card px-4 py-3">
				<h2 className="font-mono text-sm font-medium text-foreground">
					Generated Documentation: {document.title}
				</h2>
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

			<div className="flex-1 bg-editor-bg overflow-hidden">
				{isGenerating ? (
					<div className="min-h-[calc(100vh-65px)] flex h-full items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<Loader2 size={40} stroke={2} speed={1} />
							<p className="text-sm text-muted-foreground">Generating documentation...</p>
						</div>
					</div>
				) : documentation ? (
					<div className="max-h-[calc(100vh-65px)] p-4 w-full overflow-auto text-sm leading-relaxed font-mono text-foreground">
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
											{...props}
										>
											{String(children).replace(/\n$/, "")}
										</SyntaxHighlighter>
									) : (
										<code className="bg-muted text-foreground rounded px-1 py-0.5" {...props}>
											{children}
										</code>
									);
								},
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
