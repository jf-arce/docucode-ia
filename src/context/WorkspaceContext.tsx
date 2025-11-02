"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DocumentState {
	snippet: {
		language: string;
		code: string;
	};
	document: {
		id?: number;
		title: string;
		project_id: number;
		content?: string;
	};
}

interface WorkspaceState {
	newDocument: DocumentState;
	updateNewDocument: (doc: DocumentState) => void;
}

const WorkspaceContext = createContext<WorkspaceState | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
	const [newDocument, setNewDocument] = useState<DocumentState>({
		snippet: {
			language: "",
			code: "",
		},
		document: {
			title: "",
			project_id: 0,
		},
	});
	const updateNewDocument = (doc: DocumentState) => {
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
