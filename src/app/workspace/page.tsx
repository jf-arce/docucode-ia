"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function WorkspacePage() {
	const [code, setCode] = useState<string>("");
	const [documentation, setDocumentation] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const { newDocument, updateNewDocument } = useWorkspace();

	// Configurar un documento de prueba si no hay ninguno
	useEffect(() => {
		if (!newDocument.document.title) {
			updateNewDocument({
				snippet: {
					lenguage: "typescript",
					code: "",
				},
				document: {
					title: "Test Document",
					project_id: 1,
				},
			});
		}
	}, []);

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
			// Obtener el lenguaje del editor desde localStorage
			const language = localStorage.getItem("editor-language") || "typescript";

			// Llamada a la API de generación de documentación
			const response = await fetch("/api/generate-document", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					snippet: {
						language: language,
						code: code,
					},
					document: {
						title: newDocument.document.title,
						project_id: newDocument.document.project_id,
						language: "en", // o el idioma que prefieras
					},
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to generate documentation");
			}

			const data = await response.json();

			setDocumentation(data.document);

			toast.success("Documentation generated and saved successfully", {
				description: `Document ID: ${data.documentId}`,
				duration: 4000,
			});
		} catch (error) {
			console.error("Error generating documentation:", error);
			toast.error("Failed to generate documentation", {
				description: error instanceof Error ? error.message : "Please try again later.",
				duration: 3000,
			});
		} finally {
			setIsGenerating(false);
		}
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
