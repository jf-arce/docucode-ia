"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { FileText } from "lucide-react";

export default function WorkspacePage() {
	const [code, setCode] = useState<string>("");
	const [documentation, setDocumentation] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const { newDocument, updateNewDocument } = useWorkspace();

	// Cargar el contenido del documento cuando cambie
	useEffect(() => {
		// Si el documento tiene contenido (documento existente), cargarlo
		if (newDocument.document.id) {
			setDocumentation(newDocument.document.content || "");
			setCode(newDocument.snippet.code || "");
		} else {
			// Si es un documento nuevo, limpiar todo
			setCode("");
			setDocumentation("");
		}
	}, [newDocument.document.id, newDocument.document.title]);

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

			// Si el documento ya existe, usar la acción de actualización
			if (newDocument.document.id) {
				const { updateDocumentAction } = await import("@/actions/updateDocument.action");
				const result = await updateDocumentAction(
					newDocument.document.id,
					code,
					language,
					""
				);

				if (!result.success) {
					throw new Error(result.error || "Failed to save code");
				}

				// Generar documentación
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
							id: newDocument.document.id,
							title: newDocument.document.title,
							project_id: newDocument.document.project_id,
							language: "en",
						},
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Failed to generate documentation");
				}

				const data = await response.json();
				setDocumentation(data.document);

				// Actualizar el documento con la documentación
				const updateResult = await updateDocumentAction(
					newDocument.document.id,
					code,
					language,
					data.document
				);

				if (!updateResult.success) {
					throw new Error(updateResult.error || "Failed to save documentation");
				}

				toast.success("Documentation generated and saved successfully", {
					description: `Document updated.`,
					duration: 4000,
				});
			} else {
				// Si no existe, usar el flujo antiguo (crear nuevo)
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
							language: "en",
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
			}
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
			{newDocument.document.title && newDocument.document.project_id > 0 ? (
				<>
					<div className="border-b border-border bg-card px-6 py-3">
						<h1 className="text-lg font-semibold text-foreground">
							{newDocument.document.title}
						</h1>
						<p className="text-xs text-muted-foreground">
							Project ID: {newDocument.document.project_id}
						</p>
					</div>
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
				</>
			) : (
				<div className="flex flex-1 items-center justify-center">
					<div className="text-center">
						<FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
						<p className="mt-4 text-lg font-medium text-foreground">No document selected</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Select or create a document from the sidebar to start coding.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
