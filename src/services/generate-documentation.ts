import { GenerateDocumentation } from "@/types/document.types";

export const generateDocumentation = async (generateDocumentation: GenerateDocumentation) => {
	const { language: snippetLanguage, code: snippetCode } = generateDocumentation.snippet;
	const { language: documentLanguage, title } = generateDocumentation.document;

	try {
		const response = await fetch("/api/generate-document", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				snippet: { language: snippetLanguage, code: snippetCode },
				document: {
					title,
					language: documentLanguage,
				},
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to generate documentation");
		}

		const data = await response.json();

		return data.documentation;
	} catch (error) {
		console.error("Error in generateDocumentationAction:", error);
		throw error;
	}
};
