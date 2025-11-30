"use server";

import { NewSnippetDto, Snippet } from "@/types/snippet.types";
import { createClient } from "@/utils/supabase/server";

export const createSnippetAction = async (snippet: NewSnippetDto) => {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Unauthorized" };
	}

	const { error, data } = await supabase.from("snippets").insert(snippet).select().single();

	if (error) {
		return { error: error.message };
	}

	const snippetData: Snippet = data;

	return { snippetData };
};
