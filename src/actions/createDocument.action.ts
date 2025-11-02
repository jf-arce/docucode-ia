"use server";

import { CreateDocument, Document } from "@/types/document.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type CreateDocumentResponse = {
	success: boolean;
	document?: Document;
	error?: string;
};

export async function createDocumentAction(
	newDocument: CreateDocument,
): Promise<CreateDocumentResponse> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		const { data: snippetData, error: snippetError } = await supabase
			.from("snippets")
			.insert({
				code: newDocument.snippet.code,
				lenguage: newDocument.snippet.language,
			})
			.select()
			.single();

		if (snippetError) {
			throw new Error(`Snippet error: ${snippetError.message}`);
		}

		const { data: documentData, error: documentError } = await supabase
			.from("documents")
			.insert({
				title: newDocument.document.title,
				content: newDocument.document.content,
				project_id: newDocument.document.project_id,
				snippet_id: snippetData.id,
			})
			.select()
			.single();

		if (documentError) {
			throw new Error(`Document error: ${documentError.message}`);
		}

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
