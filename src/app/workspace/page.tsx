"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { FileText } from "lucide-react";
import { updateDocumentAction } from "@/actions/updateDocument.action";
import { createDocumentAction } from "@/actions/createDocument.action";
import { generateDocumentation } from "@/services/generate-documentation";
import { NewProjectButton } from "@/components/NewProjectButton";

export default function WorkspacePage() {
	const [isGenerating, setIsGenerating] = useState(false);
	const { newDocument, updateNewDocument, code, documentation, updateDocumentation } =
		useWorkspace();

	const handleGenerate = async () => {
		if (!code.trim()) {
			toast.error("Please enter some code to document", {
				description: "The code editor is empty.",
				duration: 3000,
			});
			return;
		}

		setIsGenerating(true);

		try {
			const editorLanguage = localStorage.getItem("editor-language") || "typescript";

			if (newDocument.document.id) {
				const documentation = await generateDocumentation({
					snippet: { language: editorLanguage, code: code },
					document: { title: newDocument.document.title, language: "en" },
				});

				updateDocumentation(documentation);

				const updateResult = await updateDocumentAction(
					newDocument.document.id,
					code,
					editorLanguage,
					documentation,
				);

				if (!updateResult.success) {
					throw new Error(updateResult.error || "Failed to save documentation");
				}

				toast.success("Documentation generated successfully", {
					description: `Document updated.`,
					duration: 4000,
				});
			} else {
				const documentation = await generateDocumentation({
					snippet: { language: editorLanguage, code: code },
					document: { title: newDocument.document.title, language: "en" },
				});

				const { success, document } = await createDocumentAction({
					snippet: { language: editorLanguage, code: code },
					document: {
						title: newDocument.document.title,
						project_id: newDocument.document.project_id,
						content: documentation,
					},
				});

				if (success && document) {
					updateDocumentation(document.content);
					updateNewDocument({
						snippet: {
							language: editorLanguage,
							code: code,
						},
						document: {
							id: document.id,
							title: newDocument.document.title,
							project_id: newDocument.document.project_id,
							content: document.content,
						},
					});
				}

				toast.success("Documentation generated successfully", {
					description: `Document created.`,
					duration: 4000,
				});
			}
		} catch (error) {
			console.error("Error generating documentation:", error);
			toast.error("Failed to generate documentation", {
				description: "Unable to generate the documentation at the moment. Please try again later.",
			});
		} finally {
			setIsGenerating(false);
		}
	};

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
				<div className="flex flex-col flex-1 items-center justify-center gap-6">
					<div className="text-center flex flex-col gap-5">
						<div>
							<FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
							<p className="mt-3 text-2xl font-medium text-foreground">No document selected</p>
						</div>
						<p className="text-md text-muted-foreground">
							Select an existing document or Create a new project to get started documenting your
							code.
						</p>
					</div>
					<div>
						<NewProjectButton />
					</div>
				</div>
			)}
		</div>
	);
}
