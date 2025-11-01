"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProjectAction(projectId: number) {
	const supabase = await createClient();

	// Verificar autenticación
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		console.log("Deleting project:", projectId);

		// Obtener todos los documentos del proyecto con sus snippet_ids
		const { data: documents, error: fetchError } = await supabase
			.from("documents")
			.select("id, snippet_id")
			.eq("project_id", projectId);

		if (fetchError) {
			console.error("Error fetching documents:", fetchError);
			return { success: false, error: fetchError.message };
		}

		console.log(`Found ${documents?.length || 0} documents to delete`);

		// Eliminar todos los snippets asociados a los documentos
		if (documents && documents.length > 0) {
			const snippetIds = documents.map((doc) => doc.snippet_id).filter(Boolean);
			
			if (snippetIds.length > 0) {
				console.log("Deleting snippets:", snippetIds);
				const { error: snippetError } = await supabase
					.from("snippets")
					.delete()
					.in("id", snippetIds);

				if (snippetError) {
					console.error("Error deleting snippets:", snippetError);
				}
			}

			// Eliminar todos los documentos del proyecto
			console.log("Deleting documents for project:", projectId);
			const { data: deletedDocs, error: documentsError } = await supabase
				.from("documents")
				.delete()
				.eq("project_id", projectId)
				.select();

			if (documentsError) {
				console.error("Error deleting documents:", documentsError);
				return { success: false, error: `Failed to delete documents: ${documentsError.message}` };
			}

			console.log(`Deleted ${deletedDocs?.length || 0} documents`);
		}

		// Eliminar el proyecto
		console.log("Deleting project record:", projectId);
		const { data: deletedProject, error: projectError } = await supabase
			.from("projects")
			.delete()
			.eq("id", projectId)
			.select();

		if (projectError) {
			console.error("Error deleting project:", projectError);
			return { success: false, error: `Failed to delete project: ${projectError.message}` };
		}

		if (!deletedProject || deletedProject.length === 0) {
			console.error("Project not deleted - possible RLS issue");
			return { 
				success: false, 
				error: "Unable to delete project. Please check your permissions or try refreshing the page." 
			};
		}

		console.log("Project deleted successfully");

		// Revalidar la página del workspace para actualizar los datos
		revalidatePath("/workspace");

		return { success: true };
	} catch (error) {
		console.error("Error in deleteProjectAction:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
