"use client";

import { useGenerateSnippetDocumentation } from "@/hooks/use-generate-snippet-documentation";
import { CodeEditor } from "./CodeEditor";
import { DocumentationPanel } from "./DocumentationPanel";
import { Document } from "@/types/document.types";
interface CodeAndDocumentationLayoutProps {
	document: Document;
	code: string;
	documentation: string;
	onCodeChange: (code: string) => void;
	onDocumentationChange: (doc: string) => void;
}

export const CodeAndDocumentationLayout = ({
	document,
	code,
	documentation,
	onCodeChange,
	onDocumentationChange,
}: CodeAndDocumentationLayoutProps) => {
	const { isGenerating, handleGenerate } = useGenerateSnippetDocumentation({
		document,
		code,
		onUpdateDocumentation: onDocumentationChange,
	});

	return (
		<div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full">
			<div className="w-full h-1/2 lg:w-1/2 lg:h-full">
				<CodeEditor
					code={code}
					onCodeChange={onCodeChange}
					onGenerate={handleGenerate}
					isGenerating={isGenerating}
				/>
			</div>
			<div className="w-full h-1/2 lg:w-1/2 lg:h-full">
				<DocumentationPanel documentation={documentation} isGenerating={isGenerating} />
			</div>
		</div>
	);
};
