"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDocumentAction(title: string, projectId: number) {
    const supabase = await createClient();

    // Verificar autenticación
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Crear un snippet vacío primero
        const { data: snippetData, error: snippetError } = await supabase
            .from("snippets")
            .insert({
                code: "",
                lenguage: "typescript",
            })
            .select()
            .single();

        if (snippetError) {
            console.error("Error creating snippet:", snippetError);
            return { success: false, error: snippetError.message };
        }

        // Crear el documento
        const { data: documentData, error: documentError } = await supabase
            .from("documents")
            .insert({
                title: title,
                content: "",
                project_id: projectId,
                snippet_id: snippetData.id,
            })
            .select()
            .single();

        if (documentError) {
            console.error("Error creating document:", documentError);
            return { success: false, error: documentError.message };
        }

        // Revalidar la página del workspace para actualizar los datos
        revalidatePath("/workspace");

        return { success: true, document: documentData };
    } catch (error) {
        console.error("Error in createDocumentAction:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
