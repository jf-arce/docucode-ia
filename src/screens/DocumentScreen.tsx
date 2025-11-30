"use client";

import { useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Document } from "@/types/document.types";
import { CodeAndDocumentationLayout } from "@/components/CodeAndDocumentationLayout";

interface DocumentScreenProps {
	document: Document;
}

export const DocumentScreen = ({ document }: DocumentScreenProps) => {
	const { updateCode, updateDocumentation } = useWorkspace();

	useEffect(() => {
		updateCode(document.snippet?.code || "");
		updateDocumentation(document.content || "");

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [document.id]);

	return <CodeAndDocumentationLayout document={document} />;
};
