"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useGenerateDocumentation } from "@/hooks/use-generate-documentation";
import { EmptyWorkspace } from "@/components/EmptyWorkspace";
import { useEffect } from "react";
import { Code2Icon } from "lucide-react";

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
				<div className="flex flex-col items-center justify-center flex-1 gap-4">
					<div className="flex flex-col sm:flex-row items-center gap-2 py-4">
						<h1 className="text-md font-medium text-center">Welcome to DocuCode AI</h1>
						<Code2Icon className="mx-auto text-primary/50 size-5" />
					</div>
					<EmptyWorkspace />
				</div>
			)}
			<div className="min-h-screen w-full absolute -z-50">
				<div
					className="absolute inset-0 z-0"
					style={{
						backgroundImage: `
       radial-gradient(circle at 30% 30%, #222222 0.5px, transparent 1px),
       radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
     `,
						backgroundSize: "10px 10px",
						imageRendering: "pixelated",
					}}
				/>
			</div>
		</div>
	);
}
