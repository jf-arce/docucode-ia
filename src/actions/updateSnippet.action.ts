"use server";

import { createClient } from "@/utils/supabase/server";
import { UpdateSnippetDto } from "@/types/snippet.types";

export const updateSnippetAction = async (
	updateSnippetDto: UpdateSnippetDto,
	snippetId: number,
) => {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Unauthorized" };
	}

	const { error, data: snippetUpdated } = await supabase
		.from("snippets")
		.update(updateSnippetDto)
		.eq("id", snippetId)
		.select()
		.single();

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, snippetUpdated };
};
