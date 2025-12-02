"use client";

import { useState } from "react";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { updateGithubRepositoryDoc } from "@/data/github-repository-doc/update-github-repository-doc";
import { useRouter } from "next/navigation";

interface RepoDocumentationViewerProps {
    documentation: string;
    doc_language: string;
    repoId: string;
}

export function RepoDocumentationViewer({
    documentation,
    doc_language,
    repoId,
}: RepoDocumentationViewerProps) {
    const router = useRouter();
    // Estado local para el idioma (optimistic UI)
    const [currentLanguage, setCurrentLanguage] = useState(doc_language);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLanguageChange = async (language: string) => {
        // Actualización optimista: cambia la UI inmediatamente
        setCurrentLanguage(language);
        setIsUpdating(true);

        try {
            // Actualiza en la BD
            await updateGithubRepositoryDoc(repoId, { doc_language: language });
            // Refresca los datos del servidor
            router.refresh();
        } catch (error) {
            // Si falla, revierte al idioma anterior
            console.error("Error updating language:", error);
            setCurrentLanguage(doc_language);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <DocumentationPanel
            documentation={documentation}
            isGenerating={isUpdating}
            doc_language={currentLanguage}
            onLanguageChange={handleLanguageChange}
        />
    );
}
