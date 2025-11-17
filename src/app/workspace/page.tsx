"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useGenerateDocumentation } from "@/hooks/use-generate-documentation";
import { EmptyWorkspace } from "@/components/EmptyWorkspace";

export default function WorkspacePage() {
	const { newDocument, code, documentation } = useWorkspace();
	const { isGenerating, handleGenerate } = useGenerateDocumentation();

	return (
		<div className="flex h-full flex-col">
			{newDocument.document.title && newDocument.document.project_id > 0 ? (
				<>
					<div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
						<div className="sm:w-1/2 h-full">
							<CodeEditor code={code} onGenerate={handleGenerate} isGenerating={isGenerating} />
						</div>
						<div className="sm:w-1/2 h-full">
							<DocumentationPanel documentation={documentation} isGenerating={isGenerating} />
						</div>
					</div>
				</>
			) : (
				<EmptyWorkspace />
			)}
		</div>
	);
}
