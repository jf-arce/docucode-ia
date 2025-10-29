"use client";

import { GenerateDocumentationDto } from "@/types/document.types";
import { createContext, useContext, useState, ReactNode } from "react";

interface WorkspaceState {
	newDocument: GenerateDocumentationDto;
	updateNewDocument: (doc: GenerateDocumentationDto) => void;
}

const WorkspaceContext = createContext<WorkspaceState | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
	const [newDocument, setNewDocument] = useState({
		snippet: {
			lenguage: "",
			code: "",
		},
		document: {
			title: "",
			project_id: 0,
		},
	});
	const updateNewDocument = (doc: GenerateDocumentationDto) => {
		setNewDocument(doc);
	};

	return (
		<WorkspaceContext.Provider value={{ newDocument, updateNewDocument }}>
			{children}
		</WorkspaceContext.Provider>
	);
}

export function useWorkspace() {
	const context = useContext(WorkspaceContext);
	if (!context) {
		throw new Error("useWorkspace must be used within a WorkspaceProvider");
	}
	return context;
}
