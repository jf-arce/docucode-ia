"use client";

import { useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Document } from "@/types/document.types";
import { CodeAndDocumentationLayout } from "@/components/CodeAndDocumentationLayout";

interface DocumentScreenProps {
	document: Document;
}

export const DocumentScreen = ({ document }: DocumentScreenProps) => {
	const { updateNewDocument, updateCode, updateDocumentation } = useWorkspace();

	useEffect(() => {
		updateNewDocument({
			snippet: {
				language: document.snippet?.language || "typescript",
				code: document.snippet?.code || "",
			},
			document: {
				id: document.id,
				title: document.title,
				project_id: document.project_id,
				content: document.content || "",
			},
		});

		updateCode(document.snippet?.code || "");
		updateDocumentation(document.content || "");

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [document.id]);

	return <CodeAndDocumentationLayout />;
};
