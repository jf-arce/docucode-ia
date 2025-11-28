import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";
import "github-markdown-css/github-markdown.css";

export const exportAsPDF = async (content: string, filename: string) => {
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

	const { renderToString } = await import("react-dom/server");

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

	const opt = {
		margin: 0.5,
		filename: `${filename}.pdf`,
		image: { type: "jpeg" as const, quality: 0.98 },
		html2canvas: { scale: 2 },
		jsPDF: { unit: "in", format: "a4", orientation: "portrait" } as const,
	};

	html2pdf()
		.set(opt)
		.from(tempContainer)
		.save()
		.then(() => {
			document.body.removeChild(tempContainer);
		});
};
