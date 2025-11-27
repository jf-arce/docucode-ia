"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { useEffect } from "react";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Document } from "@/types/document.types";
import { useGenerateDocumentation } from "@/hooks/use-generate-documentation";

interface DocumentScreenProps {
	document: Document;
}

export const DocumentScreen = ({ document }: DocumentScreenProps) => {
	const { updateNewDocument, code, updateCode, documentation, updateDocumentation } =
		useWorkspace();

	const { isGenerating, handleGenerate } = useGenerateDocumentation();

	useEffect(() => {
		updateNewDocument({
			snippet: {
				language: document.snippet?.language || "typescript",
				code: document.snippet?.code || "",
			},
			document: {
				id: document.id,
				title: document.title,
				project_id: document.project_id,
				content: document.content || "",
			},
		});

		updateCode(document.snippet?.code || "");
		updateDocumentation(document.content || "");

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [document.id]);

	return (
		<div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full">
			<div className="w-full h-1/2 lg:w-1/2 lg:h-full">
				<CodeEditor code={code} onGenerate={handleGenerate} isGenerating={isGenerating} />
			</div>

			<div className="w-full h-1/2 lg:w-1/2 lg:h-full">
				<DocumentationPanel documentation={documentation} isGenerating={isGenerating} />
			</div>
		</div>
	);
};
