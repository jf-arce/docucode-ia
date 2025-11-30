import { useWorkspace } from "@/context/WorkspaceContext";
import { generateSnippetDocumentation } from "@/services/generate-snippet-documentation";
import { toast } from "sonner";
import { useState } from "react";
import { updateDocumentationAction } from "@/actions/updateDocumentation.action";
import { Document } from "@/types/document.types";

/**
 * Custom hook to fetch and generate documentation for the current code snippet.
 */

export const useGenerateSnippetDocumentation = ({ document }: { document: Document }) => {
	const [isGenerating, setIsGenerating] = useState(false);
	const { code, updateDocumentation } = useWorkspace();

	const handleGenerate = async () => {
		if (!code.trim()) {
			toast.error("Please enter some code to document", {
				description: "The code editor is empty.",
				duration: 3000,
			});
			return;
		}

		try {
			const editorLanguage = localStorage.getItem("editor-language") || "typescript";

			setIsGenerating(true);
			const documentation = await generateSnippetDocumentation({
				snippet: { language: editorLanguage, code: code },
				document: { title: document.title, language: "en" },
			});

			updateDocumentation(documentation);

			if (!document.id) {
				return;
			}
			const updateResult = await updateDocumentationAction(
				document.id,
				code,
				editorLanguage,
				documentation,
			);

			if (!updateResult.success) {
				throw new Error(updateResult.error || "Failed to save documentation");
			}

			toast.success("Documentation generated successfully", {
				duration: 4000,
			});
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
