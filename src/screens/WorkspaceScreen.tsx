"use client";

import { useEffect } from "react";
import { Code2Icon } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { DocumentationStarter } from "@/components/DocumentationStarter";
import { CodeAndDocumentationLayout } from "@/components/CodeAndDocumentationLayout";

export const WorkspaceScreen = () => {
	const { newDocument, resetNewDocument } = useWorkspace();

	useEffect(() => {
		resetNewDocument();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (newDocument.document.title && newDocument.document.project_id > 0) {
		return <CodeAndDocumentationLayout />;
	}

	return (
		<div className="flex flex-col items-center justify-center flex-1 gap-1 sm:gap-4">
			<div className="flex flex-col sm:flex-row items-center gap-2 py-4">
				<h1 className="text-md font-medium text-center">Welcome to DocuCode AI</h1>
				<Code2Icon className="mx-auto text-primary/50 size-5" />
			</div>
			<div className="px-4">
				<DocumentationStarter />
			</div>
		</div>
	);
};
