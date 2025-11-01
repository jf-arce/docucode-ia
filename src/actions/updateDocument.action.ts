"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDocumentAction(
	documentId: number,
	code: string,
	language: string,
	documentation: string
) {
	const supabase = await createClient();

	// Verificar autenticación
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		// Obtener el snippet_id del documento
		const { data: documentData, error: fetchError } = await supabase
			.from("documents")
			.select("snippet_id")
			.eq("id", documentId)
			.single();

		if (fetchError) {
			console.error("Error fetching document:", fetchError);
			return { success: false, error: fetchError.message };
		}

		// Actualizar el snippet con el código
		const { error: snippetError } = await supabase
			.from("snippets")
			.update({
				code: code,
				lenguage: language,
			})
			.eq("id", documentData.snippet_id);

		if (snippetError) {
			console.error("Error updating snippet:", snippetError);
			return { success: false, error: snippetError.message };
		}

		// Actualizar el documento con la documentación
		const { error: documentError } = await supabase
			.from("documents")
			.update({
				content: documentation,
			})
			.eq("id", documentId);

		if (documentError) {
			console.error("Error updating document:", documentError);
			return { success: false, error: documentError.message };
		}

		// Revalidar la página del workspace para actualizar los datos
		revalidatePath("/workspace");

		return { success: true };
	} catch (error) {
		console.error("Error in updateDocumentAction:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
