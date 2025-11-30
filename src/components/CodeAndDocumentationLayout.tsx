"use client";

import { useGenerateDocumentation } from "@/hooks/use-generate-documentation";
import { CodeEditor } from "./CodeEditor";
import { DocumentationPanel } from "./DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";

export const CodeAndDocumentationLayout = () => {
	const { code, documentation } = useWorkspace();
	const { isGenerating, handleGenerate } = useGenerateDocumentation();

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
