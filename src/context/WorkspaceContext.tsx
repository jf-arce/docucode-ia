"use client";

import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { createContext, useContext, useState, ReactNode } from "react";

interface WorkspaceState {
	code: string;
	documentation: string;
	repoDoc: GithubRepositoryDoc | null;
	updateCode: (code: string) => void;
	updateDocumentation: (doc: string) => void;
	updateRepoDoc: (doc: GithubRepositoryDoc) => void;
	resetRepoDoc: () => void;
}

const WorkspaceContext = createContext<WorkspaceState | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
	const [code, setCode] = useState<string>("");
	const [documentation, setDocumentation] = useState("");
	const [repoDoc, setRepoDoc] = useState<GithubRepositoryDoc | null>(null);

	const updateCode = (code: string) => {
		setCode(code);
	};

	const updateDocumentation = (doc: string) => {
		setDocumentation(doc);
	};

	const updateRepoDoc = (doc: GithubRepositoryDoc) => {
		setRepoDoc(doc);
	};

	const resetRepoDoc = () => {
		setRepoDoc(null);
	};

	return (
		<WorkspaceContext.Provider
			value={{
				code,
				documentation,
				repoDoc,
				updateCode,
				updateDocumentation,
				updateRepoDoc,
				resetRepoDoc,
			}}
		>
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
