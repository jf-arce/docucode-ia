"use client";

import { useEffect } from "react";
import { Code2Icon } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useGenerateDocumentation } from "@/hooks/use-generate-documentation";
import { DocumentationStarter } from "@/components/DocumentationStarter";
import { WorkspaceBackground } from "@/components/WorkspaceBackground";

export default function WorkspacePage() {
	const { newDocument, code, documentation, resetNewDocument } = useWorkspace();
	const { isGenerating, handleGenerate } = useGenerateDocumentation();

	useEffect(() => {
		resetNewDocument();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex h-full flex-col relative px-4">
			{newDocument.document.title && newDocument.document.project_id > 0 ? (
				<>
					<div className="flex flex-col sm:flex-row flex-1 overflow-hidden h-full">
						<div className="w-full h-1/2 sm:w-1/2 sm:h-full">
							<CodeEditor code={code} onGenerate={handleGenerate} isGenerating={isGenerating} />
						</div>
						<div className="w-full h-1/2 sm:w-1/2 sm:h-full">
							<DocumentationPanel documentation={documentation} isGenerating={isGenerating} />
						</div>
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center flex-1 gap-4">
					<div className="flex flex-col sm:flex-row items-center gap-2 py-4">
						<h1 className="text-md font-medium text-center">Welcome to DocuCode AI</h1>
						<Code2Icon className="mx-auto text-primary/50 size-5" />
					</div>
					<DocumentationStarter />
				</div>
			)}

			<WorkspaceBackground />
		</div>
	);
}
