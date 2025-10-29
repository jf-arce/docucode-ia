"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function WorkspacePage() {
	const [code, setCode] = useState<string>("");
	const [documentation, setDocumentation] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const { newDocument } = useWorkspace();

	const handleGenerate = async () => {
		if (!code.trim()) {
			toast.error("Please enter some code to document", {
				description: "The code editor is empty.",
				duration: 3000,
			});
			return;
		}

		setIsGenerating(true);

		// [ ... Simulación del código de documentación ... ]
		// ...

		// Simulación de la llamada a la API
		setTimeout(() => {
			const generatedDocs = `# Code Documentation ...`;

			setDocumentation(generatedDocs);
			setIsGenerating(false);

			toast.success("Documentation generated successfully", {
				duration: 3000,
			});
		}, 2000);
	};

	return (
		<div className="flex h-full flex-col">
			{newDocument.document.title ? (
				<div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
					<div className="sm:w-1/2 h-full">
						<CodeEditor
							code={code}
							setCode={setCode}
							onGenerate={handleGenerate}
							isGenerating={isGenerating}
						/>
					</div>
					<div className="sm:w-1/2 h-full">
						<DocumentationPanel
							documentation={documentation}
							setDocumentation={setDocumentation}
							isGenerating={isGenerating}
						/>
					</div>
				</div>
			) : (
				<div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
					<div className="flex flex-1 items-center justify-center">
						<p className="text-gray-500">Select or create a document to start coding.</p>
					</div>
				</div>
			)}
		</div>
	);
}
