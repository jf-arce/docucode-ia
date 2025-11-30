"use server";

import { CreateDocument, Document } from "@/types/document.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type CreateDocumentResponse = {
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
		return { error: "Unauthorized" };
	}

	try {
		const { data: documentData, error: documentError } = await supabase
			.from("documents")
			.insert({
				title: newDocument.title,
				project_id: newDocument.project_id,
			})
			.select()
			.single();

		if (documentError) {
			return { error: documentError.message };
		}

		revalidatePath("/workspace");

		return { document: documentData };
	} catch (error) {
		console.error("Error in createDocumentAction:", error);
		return { error: error instanceof Error ? error.message : "Unknown error" };
	}
}
