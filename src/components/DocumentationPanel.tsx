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
import { jsPDF } from "jspdf";

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
		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 20;
		const maxWidth = pageWidth - 2 * margin;
		const lineHeight = 7;
		let yPosition = margin;

		// Título
		doc.setFontSize(16);
		doc.setFont("helvetica", "bold");
		doc.text("Code Documentation", margin, yPosition);
		yPosition += lineHeight * 2;

		// Contenido
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");

		const lines = content.split("\n");

		for (const line of lines) {
			// Dividir líneas largas
			const wrappedLines = doc.splitTextToSize(line || " ", maxWidth);

			for (const wrappedLine of wrappedLines) {
				// Verificar si necesitamos una nueva página
				if (yPosition > pageHeight - margin) {
					doc.addPage();
					yPosition = margin;
				}

				doc.text(wrappedLine, margin, yPosition);
				yPosition += lineHeight;
			}
		}

		doc.save(`${filename}.pdf`);
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

			<div className="flex-1 bg-editor-bg">
				{isGenerating ? (
					<div className="flex h-full items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<Loader2 size={40} stroke={2} speed={1} />
							<p className="text-sm text-muted-foreground">Generating documentation...</p>
						</div>
					</div>
				) : documentation ? (
					<textarea
						value={documentation}
						onChange={(e) => setDocumentation(e.target.value)}
						className="p-4 h-full w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-foreground outline-none overflow-auto"
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
