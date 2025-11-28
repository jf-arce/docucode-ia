export const exportAsMarkdown = (content: string, filename: string) => {
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
