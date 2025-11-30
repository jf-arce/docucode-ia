"use client";

import { useEffect, useState } from "react";
import { Document } from "@/types/document.types";
import { CodeAndDocumentationLayout } from "@/components/CodeAndDocumentationLayout";

interface DocumentScreenProps {
	document: Document;
}

export const DocumentScreen = ({ document }: DocumentScreenProps) => {
	const [code, setCode] = useState<string>("");
	const [documentation, setDocumentation] = useState<string>("");

	useEffect(() => {
		setCode(document.snippet?.code || "");
		setDocumentation(document.content || "");
	}, [document.id, document.snippet?.code, document.content]);

	return (
		<CodeAndDocumentationLayout
			document={document}
			code={code}
			documentation={documentation}
			onCodeChange={setCode}
			onDocumentationChange={setDocumentation}
		/>
	);
};
