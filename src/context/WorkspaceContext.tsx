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
    code: string;
    documentation: string;
    updateNewDocument: (doc: DocumentState) => void;
    updateCode: (code: string) => void;
    updateDocumentation: (doc: string) => void;
    resetNewDocument: () => void;
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

    const [code, setCode] = useState<string>("");
    const [documentation, setDocumentation] = useState("");

    const updateNewDocument = (doc: DocumentState) => {
        setNewDocument(doc);
    };

    const updateCode = (code: string) => {
        setCode(code);
    };

    const updateDocumentation = (doc: string) => {
        setDocumentation(doc);
    };

    const resetNewDocument = () => {
        setNewDocument({
            snippet: {
                language: "",
                code: "",
            },
            document: {
                id: undefined,
                title: "",
                project_id: 0,
                content: "",
            },
        });
        setCode("");
        setDocumentation("");
    };

    return (
        <WorkspaceContext.Provider
            value={{
                newDocument,
                updateNewDocument,
                code,
                documentation,
                updateCode,
                updateDocumentation,
                resetNewDocument,
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
