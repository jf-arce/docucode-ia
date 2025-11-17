import { useWorkspace } from "@/context/WorkspaceContext";
import { updateDocumentAction } from "@/actions/updateDocument.action";
import { createDocumentAction } from "@/actions/createDocument.action";
import { generateDocumentation } from "@/services/generate-documentation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Custom hook to fetch and generate documentation for the current code snippet.
 */

export const useGenerateDocumentation = () => {
	const router = useRouter();
	const [isGenerating, setIsGenerating] = useState(false);
	const { newDocument, updateNewDocument, code, updateDocumentation } = useWorkspace();

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

					updateDocumentation(document.content);

					router.push(`/workspace/p-${newDocument.document.project_id}/d/${document?.id}`);
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

	return { isGenerating, handleGenerate };
};
