"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { UpdateDocument } from "@/types/document.types";

export const updateDocumentAction = async (updateDocument: UpdateDocument, documentId: number) => {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Unauthorized" };
	}

	const { error, data: documentUpdated } = await supabase
		.from("documents")
		.update(updateDocument)
		.eq("id", documentId)
		.select()
		.single();

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/workspace");

	return { documentUpdated };
};
