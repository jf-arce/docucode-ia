"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDocumentAction(
	documentId: number,
	code: string,
	language: string,
	documentation: string,
) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		const { data: documentData, error: fetchError } = await supabase
			.from("documents")
			.select("snippet_id")
			.eq("id", documentId)
			.single();

		if (fetchError) {
			console.error("Error fetching document:", fetchError);
			return { success: false, error: fetchError.message };
		}

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
