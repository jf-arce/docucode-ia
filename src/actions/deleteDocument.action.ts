"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteDocumentAction(documentId: number) {
	const supabase = await createClient();

	// Verificar autenticación
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		// Obtener el snippet_id antes de eliminar el documento
		const { data: documentData, error: fetchError } = await supabase
			.from("documents")
			.select("snippet_id")
			.eq("id", documentId)
			.single();

		if (fetchError) {
			console.error("Error fetching document:", fetchError);
			return { success: false, error: fetchError.message };
		}

		console.log("Deleting document:", documentId);

		// Eliminar el documento
		const { data: deletedDoc, error: documentError } = await supabase
			.from("documents")
			.delete()
			.eq("id", documentId)
			.select();

		if (documentError) {
			console.error("Error deleting document:", documentError);
			return { success: false, error: `Failed to delete document: ${documentError.message}` };
		}

		if (!deletedDoc || deletedDoc.length === 0) {
			console.error("Document not deleted - possible RLS issue");
			return { 
				success: false, 
				error: "Unable to delete document. Please check your permissions or try refreshing the page." 
			};
		}

		console.log("Document deleted successfully");

		// Eliminar el snippet asociado
		if (documentData.snippet_id) {
			console.log("Deleting snippet:", documentData.snippet_id);
			const { error: snippetError } = await supabase
				.from("snippets")
				.delete()
				.eq("id", documentData.snippet_id);

			if (snippetError) {
				console.error("Error deleting snippet:", snippetError);
				// No retornamos error aquí porque el documento ya fue eliminado
			}
		}

		// Revalidar la página del workspace para actualizar los datos
		revalidatePath("/workspace");

		return { success: true };
	} catch (error) {
		console.error("Error in deleteDocumentAction:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
