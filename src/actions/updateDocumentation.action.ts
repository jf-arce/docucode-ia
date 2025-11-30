"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDocumentationAction(
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
			return { success: false, error: fetchError.message };
		}

		let snippetId = documentData.snippet_id;

		// Si el documento ya tiene un snippet, actualizarlo
		if (snippetId) {
			const { error: snippetError } = await supabase
				.from("snippets")
				.update({
					code: code,
					lenguage: language,
				})
				.eq("id", snippetId);

			if (snippetError) {
				return { success: false, error: snippetError.message };
			}
		} else {
			// Si no tiene snippet, crear uno nuevo
			const { error: snippetError, data: snippetData } = await supabase
				.from("snippets")
				.insert({
					code: code,
					lenguage: language,
				})
				.select("id")
				.single();

			if (snippetError) {
				return { success: false, error: snippetError.message };
			}

			snippetId = snippetData.id;
		}

		const { error: documentError } = await supabase
			.from("documents")
			.update({
				content: documentation,
				snippet_id: snippetId,
			})
			.eq("id", documentId);

		if (documentError) {
			return { success: false, error: documentError.message };
		}

		revalidatePath("/workspace");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
